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
import LoadingPage from "@/app/loading";

// 프로필 타입 (필요하다면 유지)
type UserProfile = {
  userName: string;
  educationLevel: EducationLevel;
  grade: Grade;
  isProfileSet: boolean;
  profileUrl: string;
};

const defaultUserProfile: UserProfile = {
  userName: "사용자",
  educationLevel: "middle",
  grade: "1",
  isProfileSet: false,
  profileUrl: "",
};

// 인증 컨텍스트 타입
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile;
  updateProfile: (level: EducationLevel, grade: Grade, profileUrl?: string) => void;
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
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [authCode, setAuthCode] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // authCode 처리
  useEffect(() => {
    if (pathname === "/" && authCode) {
      // 1. 서버에 auth_code로 토큰 요청
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/result?auth_code=${authCode}`)
        .then((res) => res.json())
        .then((data) => {
          // 2. 토큰/유저정보 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("nickname", data.nickname);
          localStorage.setItem("grade", data.grade);
          // 3. 프로필 정보 저장
          const userProfile: UserProfile = {
            userName: data.nickname,
            educationLevel: "middle" as EducationLevel,
            grade: String(data.grade) as Grade,
            isProfileSet: true,
            profileUrl: data.profileUrl || "",
          };
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          setUserProfile(userProfile);

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

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setUserProfile({ ...defaultUserProfile, ...JSON.parse(savedProfile) });
    } else {
      setUserProfile(defaultUserProfile);
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (level: EducationLevel, grade: Grade, profileUrl?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
      ...(profileUrl && { profileUrl }),
    }));
  };

  if (isLoading) {
    return <LoadingPage />;
  }

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
