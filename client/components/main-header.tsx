// components/main-header.tsx
"use client";

import Link from "next/link";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { GraduationCap } from "lucide-react";

type MainHeaderProps = {
  educationLevel: EducationLevel;
  grade: Grade;
  userName: string;
};

export function MainHeader({
  educationLevel,
  grade,
  userName,
}: MainHeaderProps) {
  // 학년/학교명 한글 변환
  const schoolLabel =
    educationLevel === "elementary"
      ? "초등"
      : educationLevel === "middle"
      ? "중등"
      : educationLevel === "high"
      ? "고등"
      : "";

  return (
    <header className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-md rounded-b-2xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="font-extrabold text-2xl text-blue-700 flex items-center gap-2"
        >
          <GraduationCap className="h-7 w-7 text-purple-500" />
          O! dab
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded-full bg-white/80 shadow text-blue-700 font-semibold text-sm border border-blue-200">
          {userName}
        </span>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 font-semibold text-sm border border-purple-200">
          {schoolLabel} {grade}학년
        </span>
      </div>
    </header>
  );
}
