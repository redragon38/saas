import { PLAN_CONFIG } from "@/lib/plans";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Pricing simple et prévisible</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
          <div key={key} className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-1 text-2xl font-bold">{plan.priceLabel}/mois</p>
            <p className="mt-2 text-sm text-slate-600">{plan.quota.toLocaleString()} requêtes/mois</p>
          </div>
        ))}
      </div>
    </main>
  );
}
