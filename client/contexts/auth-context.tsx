// contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { EducationLevel, Grade } from "@/components/user-profile";
import LoadingPage from "@/app/loading";

// 프로필 타입 (필요하다면 유지)
type UserProfile = {
  userName: string;
  educationLevel: EducationLevel;
  grade: Grade;
  isProfileSet: boolean;
};

const defaultUserProfile: UserProfile = {
  userName: "사용자",
  educationLevel: "middle",
  grade: "1",
  isProfileSet: false,
};

// 인증 컨텍스트 타입
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile;
  updateProfile: (level: EducationLevel, grade: Grade) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const authCode = searchParams.get("auth_code");
    if (pathname === "/" && authCode) {
      // 1. 서버에 auth_code로 토큰 요청
      fetch(`http://localhost:8080/api/auth/result?auth_code=${authCode}`)
        .then(res => res.json())
        .then(data => {
          // 2. 토큰/유저정보 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("nickname", data.nickname);
          localStorage.setItem("grade", data.grade);
          // 3. 프로필 정보 저장
          localStorage.setItem("userProfile", JSON.stringify({
            userName: data.nickname,
            educationLevel: "middle",
            grade: data.grade,
            isProfileSet: true,
          }));
          // userProfile이 없으면 기본값 저장
          if (!localStorage.getItem("userProfile")) {
            localStorage.setItem("userProfile", JSON.stringify({
              level: "middle",
              grade: "1"
            }));
          }

          setIsAuthenticated(true);
          setIsLoading(false);
          router.replace("/");
        })
        .catch(() => {
          setIsLoading(false);
          toast({ title: "인증 실패", description: "로그인 인증이 만료되었거나 잘못되었습니다." });
          router.replace("/login");
        });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      if (pathname !== "/login") {
        toast({
          title: "로그인이 필요합니다",
          description: "서비스를 이용하려면 로그인해주세요.",
        });
        router.push("/login");
      }
      setIsLoading(false);
    }
  }, [router, toast, pathname, searchParams]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile({ ...defaultUserProfile, ...JSON.parse(savedProfile) });
    } else {
      setUserProfile(defaultUserProfile);
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (level: EducationLevel, grade: Grade) => {
    const newProfile: UserProfile = {
      userName: userProfile?.userName || "사용자",
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
    };
    setUserProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
