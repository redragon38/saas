"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);
        if (!res || res.error) {
          setError("Identifiants invalides.");
          return;
        }
        window.location.href = "/dashboard";
      }}
    >
      <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border px-3 py-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="w-full rounded bg-brand px-3 py-2 text-white disabled:opacity-50">{loading ? "Connexion..." : "Connexion"}</button>
    </form>
  );
}
