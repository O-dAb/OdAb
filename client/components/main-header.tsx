// components/main-header.tsx
"use client";

import Link from "next/link";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { GraduationCap, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface MainHeaderProps {
  educationLevel: EducationLevel;
  grade: Grade;
  userName: string;
}

type User = {
  userId: string;
  token: string;
  nickname?: string;
} | null;

export function MainHeader({ educationLevel, grade }: MainHeaderProps) {
  const [user, setUser] = useState<User>(null);

  // 로그인 상태 확인 및 처리
  useEffect(() => {
    const checkLoginStatus = async () => {
      // 1. URL에서 auth_code 확인
      const params = new URLSearchParams(window.location.search);
      const authCode = params.get("auth_code");

      if (authCode) {
        try {
          // 2. auth_code로 토큰/유저정보 요청
          const response = await axios.get<{
            token: string;
            userId: string;
            nickname: string;
          }>(`http://localhost:8080/api/auth/result?auth_code=${authCode}`);

          // 3. 받은 정보 저장
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("nickname", response.data.nickname);

          setUser({
            userId: response.data.userId,
            token: response.data.token,
            nickname: response.data.nickname,
          });

          // 4. URL에서 auth_code 제거
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch (error) {
          console.error("로그인 처리 중 오류:", error);
          alert("로그인 인증이 만료되었거나 잘못되었습니다.");
        }
      } else {
        // 5. localStorage에서 기존 로그인 정보 복원
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const nickname = localStorage.getItem("nickname");

        if (token && userId) {
          setUser({
            userId,
            token,
            nickname: nickname || undefined,
          });
        }
      }
    };

    checkLoginStatus();
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    setUser(null);

    // 카카오 로그아웃
    const KAKAO_CLIENT_ID = "8a48914bf786805cc4d0e1087b0e03a9";
    const LOGOUT_REDIRECT_URI = "http://localhost:3000/login";
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
  };

  // 학년/학교명 한글 변환
  const schoolLabel =
    educationLevel === "middle"
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
          {user?.nickname ?? "사용자"}
        </span>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 font-semibold text-sm border border-purple-200">
          {schoolLabel} {grade}학년
        </span>
        {user && (
          <button
            onClick={handleLogout}
            title="로그아웃"
            className="p-2 rounded-full hover:bg-red-100 transition"
          >
            <LogOut className="h-5 w-5 text-red-500" />
          </button>
        )}
      </div>
    </header>
  );
}
