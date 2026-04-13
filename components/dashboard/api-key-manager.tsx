"use client";

import { useState } from "react";

export function ApiKeyManager({ maskedPrefix }: { maskedPrefix: string }) {
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function regenerate() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/dashboard/api-keys/regenerate", { method: "POST" });
    const json = await res.json();
    setLoading(false);

    if (!res.ok || !json.success) {
      setError("Impossible de régénérer la clé API.");
      return;
    }

    setKey(json.data.rawKey);
  }

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <p className="text-sm text-slate-600">Clé active (masquée)</p>
      <p className="font-mono text-sm">{maskedPrefix}******</p>

      {key ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-3">
          <p className="mb-2 text-xs font-medium text-amber-700">Nouvelle clé (visible une seule fois)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto text-xs">{key}</code>
            <button className="rounded border px-2 py-1 text-xs" onClick={() => navigator.clipboard.writeText(key)}>Copier</button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button onClick={regenerate} disabled={loading} className="rounded bg-brand px-3 py-2 text-white disabled:opacity-50">
        {loading ? "Régénération..." : "Régénérer la clé API"}
      </button>
    </div>
  );
}
