export function DashboardSidebar() {
  return (
    <aside className="w-56 border-r bg-white p-4">
      <p className="mb-4 font-semibold">Dashboard</p>
      <nav className="space-y-2 text-sm">
        <a className="block" href="/dashboard">Overview</a>
        <a className="block" href="/dashboard/api">API Key</a>
        <a className="block" href="/dashboard/usage">Usage</a>
        <a className="block" href="/dashboard/billing">Billing</a>
        <a className="block" href="/docs">Docs</a>
      </nav>
    </aside>
  );
}
