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

// 프로필 타입
type UserProfile = {
  userName: string;
  educationLevel: EducationLevel;
  grade: Grade;
  isProfileSet: boolean;
  profileUrl: string;
  userId?: string | number;
  nickname?: string;
};

const defaultUserProfile: UserProfile = {
  userName: "사용자",
  educationLevel: "middle",
  grade: "1",
  isProfileSet: false,
  profileUrl: "",
  nickname: "",
};

// 인증 컨텍스트 타입
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile;
  updateProfile: (
    level: EducationLevel,
    grade: Grade,
    profileUrl?: string
  ) => void;
  logout: () => void;
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

  // 초기 인증 상태 체크
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedProfile = localStorage.getItem("userProfile");

    if (token && savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUserProfile({ ...defaultUserProfile, ...parsedProfile });
        setIsAuthenticated(true);
        
        // 로그인된 사용자가 루트 경로에 있으면 대시보드로 리다이렉트
        if (pathname === "/") {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Profile parsing error:", error);
        localStorage.removeItem("userProfile");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      // 로그인하지 않은 사용자가 보호된 페이지에 접근하면 루트로 리다이렉트
      if (pathname !== "/" && pathname !== "/login") {
        router.replace("/");
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  // authCode 처리
  useEffect(() => {
    if (pathname === "/" && authCode) {
      setIsLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/result?auth_code=${authCode}`
      )
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("nickname", data.nickname);
          localStorage.setItem("grade", data.grade);

          const userProfile: UserProfile = {
            userName: data.nickname,
            educationLevel: "middle" as EducationLevel,
            grade: data.grade,
            isProfileSet: true,
            profileUrl: data.profileUrl || "",
            userId: data.userId,
            nickname: data.nickname,
          };
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          setUserProfile(userProfile);
          setIsAuthenticated(true);
          router.replace("/dashboard");
        })
        .catch(() => {
          toast({
            title: "인증 실패",
            description: "로그인 인증이 만료되었거나 잘못되었습니다.",
          });
          router.replace("/");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [authCode, pathname, router, toast]);

  const updateProfile = (
    level: EducationLevel,
    grade: Grade,
    profileUrl?: string
  ) => {
    const updatedProfile = {
      ...userProfile,
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
      ...(profileUrl && { profileUrl }),
    };

    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    localStorage.setItem("grade", grade);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("grade");

    setIsAuthenticated(false);
    setUserProfile(defaultUserProfile);

    router.push("/");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userProfile,
        updateProfile,
        logout,
      }}
    >
      <AuthParamsHandler onAuthCode={setAuthCode} />
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
