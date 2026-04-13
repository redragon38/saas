export default function DocsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">
      <header>
        <h1 className="text-4xl font-semibold">Documentation API</h1>
        <p className="mt-2 text-slate-600">Base URL: <code>{"$APP_URL"}</code> · Auth par Bearer API key.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Authentification</h2>
        <pre className="rounded bg-slate-900 p-4 text-sm text-slate-100">Authorization: Bearer seopk_xxx</pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Quick start</h2>
        <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">{`curl -X POST $APP_URL/api/v1/generate-title \\
-H "Authorization: Bearer seopk_xxx" \\
-H "Content-Type: application/json" \\
-d '{"topic":"Audit SEO local","count":3}'`}</pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Endpoints</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li><code>POST /api/v1/generate-title</code></li>
          <li><code>POST /api/v1/generate-meta-description</code></li>
          <li><code>POST /api/v1/generate-faq</code></li>
          <li><code>POST /api/v1/summarize-content</code></li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Format des réponses</h2>
        <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">{`{
  "success": true,
  "data": { ... },
  "meta": {
    "quota": { "used": 45, "limit": 2000, "remaining": 1955 },
    "rateLimit": { "remaining": 119 }
  }
}`}</pre>
        <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload invalide"
  }
}`}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Erreurs fréquentes</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li><code>401 MISSING_KEY</code>: header Authorization absent.</li>
          <li><code>401 INVALID_KEY</code>: clé API invalide ou révoquée.</li>
          <li><code>422 VALIDATION_ERROR</code>: payload non conforme.</li>
          <li><code>429 RATE_LIMITED</code>: trop de requêtes/minute.</li>
          <li><code>429 QUOTA_EXCEEDED</code>: quota mensuel atteint.</li>
        </ul>
      </section>
    </main>
  );
}
