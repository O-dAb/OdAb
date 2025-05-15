// components/client-header.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { MainHeader } from "@/components/main-header";

export function ClientHeader() {
  const { userProfile } = useAuth();
  const { educationLevel, grade, userName } = userProfile;

  return (
    <MainHeader
      educationLevel={educationLevel}
      grade={grade}
      userName={userName}
    />
  );
}
