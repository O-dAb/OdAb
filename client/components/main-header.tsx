"use client"

import { BrainCircuit, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import type { EducationLevel, Grade } from "@/components/user-profile"
import { useRouter } from "next/navigation"

/**
 * 메인 헤더 컴포넌트
 * 앱의 상단 네비게이션 바를 제공
 */
interface MainHeaderProps {
  activeTab: string
  educationLevel?: EducationLevel
  grade?: Grade
  userName?: string
}

export function MainHeader({ activeTab, educationLevel, grade, userName = "사용자" }: MainHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [user, setUser] = useState<{ userId: string; token: string; nickname?: string } | null>(null)

  useEffect(() => {
    // 로그인 성공 시 쿼리 파라미터에서 토큰/유저 정보 읽기
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const nickname = params.get('nickname');
    if (token && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      if (nickname) localStorage.setItem('nickname', nickname);
      setUser({ userId, token, nickname: nickname || undefined });
      // 쿼리 파라미터 제거 (UX 개선)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 로그아웃 처리 (JWT 토큰 + 카카오 로그아웃)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    setUser(null);
    // 카카오 로그아웃도 함께 처리
    const KAKAO_CLIENT_ID = '8a48914bf786805cc4d0e1087b0e03a9'; // 실제 값으로 교체
    const LOGOUT_REDIRECT_URI = 'http://localhost:3000/login'; // 실제 값으로 교체
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
  };

  const getTitle = () => {
    switch (activeTab) {
      case "home":
        return "홈"
      case "solve":
        return "문제 풀이"
      case "mistakes":
        return "오답 노트"
      case "concepts":
        return "개념 학습"
      case "review":
        return "복습하기"
      case "settings":
        return "설정"
      case "help":
        return "도움말"
      default:
        return "수학 학습 도우미"
    }
  }

  const getEducationLevelText = () => {
    if (!educationLevel) return ""
    return educationLevel === "middle" ? "중등" : "고등"
  }

  return (
    <header
      className={`${educationLevel === "middle" ? "bg-green-400" : "bg-blue-500"} text-white py-3 px-6 sticky top-0 z-10`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-opacity-20 hover:bg-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-blue-400 text-white">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-2 px-4">
                  <BrainCircuit className="h-6 w-6 text-white" />
                  <span className="font-bold text-xl">수학 도우미</span>
                </div>
                <nav className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    문제 풀이
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    오답 노트
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    개념 학습
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={() => setIsOpen(false)}
                  >
                    복습하기
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <BrainCircuit className="h-6 w-6 text-white" />
          <span className="font-bold text-xl hidden md:inline">수학 도우미</span>
          <span className="font-bold text-xl md:hidden">{getTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block mr-2">
            <span className="text-white font-medium">{userName}님</span>
          </div>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={handleLogout}
              aria-label="로그아웃"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
          {educationLevel && grade && (
            <Badge variant="outline" className="hidden md:flex border-white text-white">
              {getEducationLevelText()}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-white text-white hover:bg-opacity-20 hover:bg-white"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">프로필</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
