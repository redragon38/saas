import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const hasError = !!searchParams?.error;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-6 text-3xl font-semibold">Connexion</h1>
      {hasError ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">Échec de connexion. Vérifie ton email/mot de passe puis réessaie.</p> : null}
      <LoginForm />
    </main>
  );
}
