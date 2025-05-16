// components/client-sidenav.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { SideNavigation } from "@/components/side-navigation";

export function ClientSideNav() {
  const { userProfile } = useAuth();
  return <SideNavigation />;
}
