// contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { EducationLevel, Grade } from "@/components/user-profile";

// 프로필 타입 (필요하다면 유지)
type UserProfile = {
  userName: string;
  educationLevel: EducationLevel;
  grade: Grade;
  isProfileSet: boolean;
};

// 인증 컨텍스트 타입
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile;
  updateProfile: (level: EducationLevel, grade: Grade) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SearchParams를 처리하는 컴포넌트
function AuthParamsHandler({
  onAuthCode,
}: {
  onAuthCode: (authCode: string | null) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const authCode = searchParams.get("auth_code");
    onAuthCode(authCode);
  }, [searchParams, onAuthCode]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userName: "김수학",
    educationLevel: "middle",
    grade: "1",
    isProfileSet: false,
  });
  const [authCode, setAuthCode] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // authCode 처리
  useEffect(() => {
    if (pathname === "/" && authCode) {
      // 1. 서버에 auth_code로 토큰 요청
      fetch(`http://localhost:8080/api/auth/result?auth_code=${authCode}`)
        .then((res) => res.json())
        .then((data) => {
          // 2. 토큰/유저정보 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("nickname", data.nickname);

          // userProfile이 없으면 기본값 저장
          if (!localStorage.getItem("userProfile")) {
            localStorage.setItem(
              "userProfile",
              JSON.stringify({
                level: "middle",
                grade: "1",
              })
            );
          }

          setIsAuthenticated(true);
          setIsLoading(false);
          router.replace("/");
        })
        .catch(() => {
          setIsLoading(false);
          toast({
            title: "인증 실패",
            description: "로그인 인증이 만료되었거나 잘못되었습니다.",
          });
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
  }, [router, toast, pathname, authCode]);

  // 프로필 로딩 (리다이렉트 X)
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const { level, grade } = JSON.parse(savedProfile);
      setUserProfile((prev) => ({
        ...prev,
        educationLevel: level,
        grade: grade,
        isProfileSet: true,
      }));
    }
  }, []);

  const updateProfile = (level: EducationLevel, grade: Grade) => {
    const newProfile = {
      ...userProfile,
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
    };
    setUserProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify({ level, grade }));
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, userProfile, updateProfile }}
    >
      <Suspense fallback={<div>인증 처리 중...</div>}>
        <AuthParamsHandler onAuthCode={setAuthCode} />
      </Suspense>
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
