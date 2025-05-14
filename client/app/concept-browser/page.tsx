"use client";

import { useAuth } from "@/contexts/auth-context";
import { ConceptBrowser } from "@/components/study/concept-browser";

export default function ConceptsPage() {
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;

  return <ConceptBrowser educationLevel={educationLevel} grade={grade} />;
}
