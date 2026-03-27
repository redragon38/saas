from datetime import datetime, timedelta
from decimal import Decimal
import os
import secrets

from flask import Flask, flash, redirect, render_template, request, url_for
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-me")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///saas.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    company_name = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    clients = db.relationship("Client", backref="owner", lazy=True, cascade="all, delete")
    invoices = db.relationship("Invoice", backref="owner", lazy=True, cascade="all, delete")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    monthly_value = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default="pending")
    due_date = db.Column(db.Date, nullable=False)
    paid_at = db.Column(db.DateTime, nullable=True)
    payment_token = db.Column(db.String(40), unique=True, nullable=False, default=lambda: secrets.token_urlsafe(24))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    client = db.relationship("Client")


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    return render_template("marketing.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"].strip().lower()
        company_name = request.form["company_name"].strip()
        password = request.form["password"].strip()

        if User.query.filter_by(email=email).first():
            flash("Cet email existe déjà.", "error")
            return redirect(url_for("register"))

        user = User(email=email, company_name=company_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        flash("Bienvenue ! Votre workspace SaaS est prêt.", "success")
        return redirect(url_for("dashboard"))
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"].strip().lower()
        password = request.form["password"].strip()
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            flash("Identifiants invalides.", "error")
            return redirect(url_for("login"))
        login_user(user)
        return redirect(url_for("dashboard"))
    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/dashboard")
@login_required
def dashboard():
    clients = Client.query.filter_by(user_id=current_user.id).all()
    invoices = Invoice.query.filter_by(user_id=current_user.id).order_by(Invoice.created_at.desc()).all()

    mrr = sum(float(c.monthly_value) for c in clients)
    pending_revenue = sum(float(i.amount) for i in invoices if i.status == "pending")
    paid_this_month = sum(
        float(i.amount)
        for i in invoices
        if i.status == "paid" and i.paid_at and i.paid_at >= datetime.utcnow() - timedelta(days=30)
    )

    return render_template(
        "dashboard.html",
        clients=clients,
        invoices=invoices[:10],
        mrr=mrr,
        pending_revenue=pending_revenue,
        paid_this_month=paid_this_month,
    )


@app.route("/clients", methods=["POST"])
@login_required
def add_client():
    name = request.form["name"].strip()
    email = request.form["email"].strip().lower()
    monthly_value = Decimal(request.form["monthly_value"])

    client = Client(user_id=current_user.id, name=name, email=email, monthly_value=monthly_value)
    db.session.add(client)
    db.session.commit()
    flash("Client ajouté.", "success")
    return redirect(url_for("dashboard"))


@app.route("/invoices", methods=["POST"])
@login_required
def add_invoice():
    title = request.form["title"].strip()
    amount = Decimal(request.form["amount"])
    client_id = int(request.form["client_id"])
    due_date = datetime.strptime(request.form["due_date"], "%Y-%m-%d").date()

    client = Client.query.filter_by(id=client_id, user_id=current_user.id).first_or_404()
    invoice = Invoice(
        user_id=current_user.id,
        client_id=client.id,
        title=title,
        amount=amount,
        due_date=due_date,
    )
    db.session.add(invoice)
    db.session.commit()
    flash("Facture générée et lien de paiement prêt.", "success")
    return redirect(url_for("dashboard"))


@app.route("/pay/<token>", methods=["GET", "POST"])
def pay_invoice(token):
    invoice = Invoice.query.filter_by(payment_token=token).first_or_404()
    if request.method == "POST" and invoice.status != "paid":
        invoice.status = "paid"
        invoice.paid_at = datetime.utcnow()
        db.session.commit()
        flash("Paiement simulé accepté ✅", "success")
        return redirect(url_for("pay_invoice", token=token))
    return render_template("pay_invoice.html", invoice=invoice)


@app.cli.command("init-db")
def init_db():
    db.create_all()
    print("Database initialisée.")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
