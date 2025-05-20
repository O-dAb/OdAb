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
import { Button } from "@/components/ui/button";

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
    setDisplayName("");
    
    // 카카오 로그아웃 진행
    const KAKAO_CLIENT_ID = "8a48914bf786805cc4d0e1087b0e03a9";
    const LOGOUT_REDIRECT_URI = `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/login`;
    
    // 로컬 로그아웃 후 랜딩 페이지로 이동
    window.location.href = "/";
  };

  // localStorage 값 확인 및 상태 업데이트
  useEffect(() => {
    const userProfileStr = localStorage.getItem("userProfile");
    if (userProfileStr) {
      try {
        const userProfile = JSON.parse(userProfileStr);
        const nickname = localStorage.getItem("nickname") || userProfile.userName || "사용자";
        setDisplayName(nickname);
      } catch (e) {
        // 파싱 에러 처리
        const fallbackName = localStorage.getItem("nickname")||localStorage.getItem("userName") || "사용자";
        setDisplayName(fallbackName);
      }
    }
  }, []);

  // 학년/학교명 한글 변환
  const schoolLabel =
    educationLevel === "middle"
      ? "중등"
      : educationLevel === "high"
      ? "고등"
      : "";
  // localStorage에서 nickname을 가져오는 대신 props로 전달받은 nickname 사용
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

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
      <header className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 shadow-lg backdrop-blur-sm rounded-b-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center gap-2"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            O! dAb
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="w-24 h-9 rounded-lg" />
        </div>
      </header>
    );
  }

  // 실제 렌더링
  return (
    <header className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 shadow-lg backdrop-blur-sm rounded-b-2xl px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center gap-2"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 p-2 rounded-full shadow-md">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          O! dAb
        </Link>
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        {isLoggedIn ? (
          <>
            <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm hover:shadow text-blue-700 dark:text-blue-300 font-medium text-sm border border-blue-200 dark:border-blue-800 transition-all duration-200">
              <Avatar className="inline-block w-8 h-8 align-middle mr-2">
                <AvatarImage
                  src={profileUrlFromContext}
                  alt="프로필 이미지"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {displayNameFromContext ? displayNameFromContext.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              {displayNameFromContext}
            </span>
            
            <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 font-medium text-sm border border-purple-200 dark:border-purple-800 shadow-inner">
              {schoolLabel} {typeof window !== 'undefined' ? localStorage.getItem('grade') : ''}학년
            </span>
            
            <button
              onClick={handleLogout}
              title="로그아웃"
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-500 dark:text-red-400" />
            </button>
          </>
        ) : (
          <Link href="/login">
            <Button className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white shadow-sm hover:shadow transition-all duration-300 font-medium px-5 py-2 h-auto">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}