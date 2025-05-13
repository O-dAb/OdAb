// app/review/page.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { ReviewSchedule } from "@/components/review-schedule";

export default function ReviewPage() {
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;

  return <ReviewSchedule educationLevel={educationLevel} grade={grade} />;
}
