// components/main-header.tsx
"use client";

import Link from "next/link";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { GraduationCap, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";

interface MainHeaderProps {
  educationLevel: EducationLevel;
  grade: Grade;
  userName: string;
  nickname?: string;
}

export function MainHeader({
  educationLevel,
  grade,
  userName,
  nickname,
}: MainHeaderProps) {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    // localStorage에서 직접 nickname 가져오기
    const storedNickname = localStorage.getItem("nickname");
    setDisplayName(storedNickname || userName || "사용자");
  }, [userName]);

  // 로그아웃 처리
  const handleLogout = () => {
    if (!window.confirm("정말 로그아웃 하시겠습니까?")) {
      return;
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("grade");
    localStorage.removeItem("userProfile");
    setUserName("");
    // 카카오 로그아웃
    const KAKAO_CLIENT_ID = "8a48914bf786805cc4d0e1087b0e03a9";
    const LOGOUT_REDIRECT_URI = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/login`;
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
  };

  // localStorage 값 확인 및 상태 업데이트
  useEffect(() => {
    const userProfileStr = localStorage.getItem("userProfile");
    if (userProfileStr) {
      try {
        const userProfile = JSON.parse(userProfileStr);
        if (userProfile.userName) {
          setUserName(userProfile.userName);
        }
        if (userProfile.profileUrl) {
          setProfileUrl(userProfile.profileUrl);
        }
      } catch (e) {
        // 파싱 에러 처리 (필요시)
        setUserName("");
        setProfileUrl(undefined);
      }
    }
    console.log("LocalStorage values:", allLocalStorage); // 디버깅을 위해 추가
  }, []);

  // 학년/학교명 한글 변환
  const schoolLabel =
    educationLevel === "middle"
      ? "중등"
      : educationLevel === "high"
      ? "고등"
      : "";
  // localStorage에서 nickname을 가져오는 대신 props로 전달받은 nickname 사용
  const isLoggedIn = Boolean(userName);

  return (
    <header className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 shadow-md rounded-b-2xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="font-extrabold text-2xl text-blue-700 dark:text-blue-300 flex items-center gap-2"
        >
          <GraduationCap className="h-7 w-7 text-purple-500 dark:text-purple-300" />
          O! dAb
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 shadow text-blue-700 dark:text-blue-300 font-semibold text-sm border border-blue-200 dark:border-blue-700">
          {displayName}
        </span>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700 text-purple-700 dark:text-purple-200 font-semibold text-sm border border-purple-200 dark:border-purple-700">
          {schoolLabel} {grade}학년
        </span>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            title="로그아웃"
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
          >
            <LogOut className="h-5 w-5 text-red-500 dark:text-red-400" />
          </button>
        )}
      </div>
    </header>
  );
}
