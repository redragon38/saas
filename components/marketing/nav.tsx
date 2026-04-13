import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="font-semibold">SEO API Pack</a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
          <a href="/login">Login</a>
          <Button href="/signup">Start Free</Button>
        </nav>
      </div>
    </header>
  );
}
