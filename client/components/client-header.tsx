// components/client-header.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { MainHeader } from "@/components/main-header";

export function ClientHeader() {
  const { userProfile } = useAuth();
  const { isProfileSet, educationLevel, grade, userName } = userProfile;

  if (!isProfileSet) return null;

  return (
    <MainHeader
      educationLevel={educationLevel}
      grade={grade}
      userName={userName}
    />
  );
}
