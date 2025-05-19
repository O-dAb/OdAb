// components/main-header.tsx
"use client";

import Link from "next/link";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { GraduationCap, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { userProfile, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  useEffect(() => {
    // localStorage에서 nickname만 가져오기
    const storedNickname = localStorage.getItem("nickname") || "사용자";
    setDisplayName(storedNickname);
    // localStorage에서 userProfile의 profileUrl 가져오기
    const userProfileStr = localStorage.getItem("userProfile");
    if (userProfileStr) {
      try {
        const userProfileObj = JSON.parse(userProfileStr);
        setProfileUrl(userProfileObj.profileUrl || "/default-profile.png");
      } catch {
        setProfileUrl("/default-profile.png");
      }
    } else {
      setProfileUrl("/default-profile.png");
    }
  }, []);

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
    setDisplayName(""); // setUserName 대신 setDisplayName 사용
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
        const nickname = localStorage.getItem("nickname") || userProfile.userName || "사용자";
        setDisplayName(nickname);
        if (userProfile.profileUrl) {
          // profileUrl은 현재 컴포넌트에서 사용되지 않으므로 제거
        }
      } catch (e) {
        // 파싱 에러 처리
        const fallbackName = localStorage.getItem("nickname")||localStorage.getItem("userName") || "사용자";
        setDisplayName(fallbackName);
      }
    }
    console.log("LocalStorage values:", localStorage); // 디버깅을 위해 추가
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

  // localStorage의 nickname이 있으면 사용, 없으면 userProfile.nickname/userName 사용
  const displayNameFromContext =
    (typeof window !== "undefined" && localStorage.getItem("nickname")) ||
    userProfile.nickname ||
    userProfile.userName ||
    "사용자";

  // localStorage의 userProfile.profileUrl이 있으면 사용, 없으면 context, 없으면 기본 이미지
  let profileUrlFromContext = userProfile.profileUrl || "/default-profile.png";
  if (typeof window !== "undefined") {
    try {
      const localProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      if (localProfile.profileUrl) profileUrlFromContext = localProfile.profileUrl;
    } catch {}
  }

  // 로딩 중이면 Skeleton 또는 null 반환
  if (isLoading) {
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
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="w-20 h-6 rounded" />
        </div>
      </header>
    );
  }

  // 실제 렌더링
  return (
    <header className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-md rounded-b-2xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="font-extrabold text-2xl text-blue-700 dark:text-blue-200 flex items-center gap-2"
        >
          <GraduationCap className="h-7 w-7 text-purple-500 dark:text-purple-300" />
          O! dAb
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 shadow text-blue-700 dark:text-blue-300 font-semibold text-sm border border-blue-200 dark:border-blue-700">
          <Avatar className="inline-block w-9 h-9 align-middle mr-2">
            <AvatarImage
              src={profileUrlFromContext}
              alt="프로필 이미지"
            />
            <AvatarFallback>{displayNameFromContext ? displayNameFromContext.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          {displayNameFromContext}
        </span>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50 text-purple-700 dark:text-purple-200 font-semibold text-sm border border-purple-200 dark:border-gray-600">
          {schoolLabel} {typeof window !== 'undefined' ? localStorage.getItem('grade') : ''}학년
        </span>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            title="로그아웃"
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition"
          >
            <LogOut className="h-5 w-5 text-red-500 dark:text-red-400" />
          </button>
        )}
      </div>
    </header>
  );
}