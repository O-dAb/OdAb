// app/mistakes/page.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { MistakeTracker } from "@/components/study/mistake-tracker";

export default function MistakesPage() {
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;

  return <MistakeTracker educationLevel={educationLevel} grade={grade} />;
}
