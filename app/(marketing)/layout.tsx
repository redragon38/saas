import { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing/nav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <MarketingNav />
      {children}
    </div>
  );
}
