"use client";

import { BrainCircuit, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import type { EducationLevel, Grade } from "@/types/profile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

/**
 * 메인 헤더 컴포넌트
 * 앱의 상단 네비게이션 바를 제공
 */
interface MainHeaderProps {
  activeTab: string;
  educationLevel?: EducationLevel;
  grade?: Grade;
  userName?: string;
}

export function MainHeader({
  activeTab,
  educationLevel,
  grade,
  userName = "사용자",
}: MainHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    // 로컬스토리지에서 profileImageUrl 직접 가져오기
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile.profileImageUrl) {
          setProfileImageUrl(parsedProfile.profileImageUrl);
        }
      } catch (e) {
        console.error("프로필 정보 파싱 에러:", e);
      }
    }
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case "home":
        return "홈";
      case "upload":
        return "문제 업로드 ";
      case "mistakes":
        return "오답 노트";
      case "concepts":
        return "개념 학습";
      case "review":
        return "복습하기";
      case "settings":
        return "설정";
      case "help":
        return "도움말";
      case "profile":
        return "프로필";
      default:
        return "수학 학습 도우미";
    }
  };

  const getEducationLevelText = () => {
    if (!educationLevel) return "";
    return educationLevel === "middle" ? "중등" : "고등";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");
    
    toast({
      title: "로그아웃 되었습니다",
      description: "다음에 또 만나요!",
    });
    router.push("/login");
  };

  return (
    <header
      className={`${
        educationLevel === "middle" ? "bg-green-400" : "bg-blue-500"
      } text-white py-3 px-6 sticky top-0 z-10`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-opacity-20 hover:bg-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[240px] sm:w-[300px] bg-blue-400 text-white"
            >
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
                  <Button
                    variant="ghost"
                    className="justify-start text-white hover:bg-opacity-20 hover:bg-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-white" />
            <span className="font-bold text-xl hidden md:inline">
              수학 도우미
            </span>
          </Link>
          <span className="font-bold text-xl md:hidden">{getTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block mr-2">
            <span className="text-white font-medium">{userName}님</span>
          </div>
          {educationLevel && grade && (
            <Badge
              variant="outline"
              className="hidden md:flex border-white text-white"
            >
              {getEducationLevelText()}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-white text-white hover:bg-opacity-20 hover:bg-white"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={profileImageUrl || userProfile.profileUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white text-blue-500 text-xs">
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">프로필</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>프로필 관리</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
