"use client";
import { usePathname } from "next/navigation";
import { ClientHeader } from "@/components/client-header";
import { ClientSideNav } from "@/components/client-sidenav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex flex-col h-screen">
      <ClientHeader />
      <div className="flex flex-1 overflow-hidden">
        <ClientSideNav />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
