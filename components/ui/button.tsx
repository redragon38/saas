import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-700", className)}>
      {children}
    </Link>
  );
}
