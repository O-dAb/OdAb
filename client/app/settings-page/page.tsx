// app/settings/page.tsx
"use client";

import { Suspense } from "react";
import SettingsPage from "@/components/settings-page";

export default function Settings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}
