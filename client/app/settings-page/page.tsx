// app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import SettingsPage from "@/components/settings-page";
import { useState } from "react";

export default function Settings() {
  const { userProfile, updateProfile } = useAuth();
  const { educationLevel, grade } = userProfile;
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  // 프로필 이미지 업데이트 핸들러
  const handleProfileImageUpdate = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  return (
    <SettingsPage
      educationLevel={educationLevel}
      grade={grade}
      profileImageUrl={profileImageUrl}
      onProfileUpdate={updateProfile}
      onProfileImageUpdate={handleProfileImageUpdate}
    />
  );
}
