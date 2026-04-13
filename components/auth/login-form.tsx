"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); await signIn("credentials", { email, password, callbackUrl: "/dashboard" }); }}>
      <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border px-3 py-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded bg-brand px-3 py-2 text-white">Connexion</button>
    </form>
  );
}
