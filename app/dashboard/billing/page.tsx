export default function BillingPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold">Billing</h1>
      <form action="/api/stripe/portal" method="post"><button className="rounded bg-brand px-3 py-2 text-white">Ouvrir le portail Stripe</button></form>
      <p className="text-sm text-slate-600">Gérez votre abonnement, changement de plan et annulation via Stripe Customer Portal.</p>
    </div>
  );
}
