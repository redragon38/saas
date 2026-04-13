export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <h1 className="text-4xl font-semibold">Documentation API</h1>
      <section>
        <h2 className="text-2xl font-semibold">Authentification</h2>
        <pre className="mt-3 rounded bg-slate-900 p-4 text-sm text-slate-100">Authorization: Bearer seopk_xxx</pre>
      </section>
      <section>
        <h2 className="text-2xl font-semibold">Quick start cURL</h2>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">{`curl -X POST $APP_URL/api/v1/generate-title \\
  -H "Authorization: Bearer seopk_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"topic":"Audit SEO local","count":3}'`}</pre>
      </section>
    </main>
  );
}
