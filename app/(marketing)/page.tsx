import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center">
        <p className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm text-brand">SEO API Pack</p>
        <h1 className="text-5xl font-semibold">Toutes les APIs SEO essentielles dans un seul abonnement.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">Un micro-SaaS API prêt pour la production: auth, billing Stripe, quotas mensuels, API keys, logs, docs développeur et dashboard clair.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/signup">Créer un compte gratuit</Button>
          <Button href="/docs" className="bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-100">Voir la docs API</Button>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-2">
        {[
          "/api/v1/generate-title",
          "/api/v1/generate-meta-description",
          "/api/v1/generate-faq",
          "/api/v1/summarize-content"
        ].map((endpoint) => (
          <div key={endpoint} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Endpoint</p>
            <p className="font-mono text-sm">{endpoint}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
