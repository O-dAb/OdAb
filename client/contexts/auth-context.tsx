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
  userId?: string | number;  // userId 추가
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
  logout: () => void;  // 로그아웃 함수 추가
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

  // 프로필 이미지 URL 가져오기 함수
  const fetchProfileImage = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("accessToken");
      
      if (!token) return;
      
      const response = await fetch(`${apiUrl}/api/v1/profile_img`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.profileUrl) {
          // userProfile 상태 업데이트
          const updatedProfile = {
            ...userProfile,
            profileUrl: data.profileUrl
          };
          setUserProfile(updatedProfile);
          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        }
      }
    } catch (error) {
      console.error("프로필 이미지 가져오기 실패:", error);
    }
  };

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
            userId: data.userId,  // userId 저장
          };
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          setUserProfile(userProfile);

          setIsAuthenticated(true);
          
          // 로그인 성공 후 프로필 이미지 가져오기
          fetchProfileImage();
          
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
      
      // 토큰 확인 시 프로필 이미지 가져오기
      fetchProfileImage();
      
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
    const currentUserId = localStorage.getItem("userId");
    
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      // 저장된 프로필의 userId와 현재 userId가 일치하는지 확인
      if (!parsedProfile.userId || parsedProfile.userId === currentUserId) {
        setUserProfile({ ...defaultUserProfile, ...parsedProfile });
        
        // 로그인 상태이고 프로필 URL이 없으면 가져오기 시도
        if (localStorage.getItem("accessToken") && !parsedProfile.profileUrl) {
          fetchProfileImage();
        }
      } else {
        // userId가 일치하지 않으면 기본값 사용
        setUserProfile(defaultUserProfile);
      }
    } else {
      setUserProfile(defaultUserProfile);
    }
    setIsLoading(false);
  }, []);

  const updateProfile = (level: EducationLevel, grade: Grade, profileUrl?: string) => {
    const updatedProfile = {
      ...userProfile,
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
      ...(profileUrl && { profileUrl }),
    };
    
    setUserProfile(updatedProfile);
    
    // 로컬 스토리지에도 업데이트된 정보 저장
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };
  
  // 로그아웃 함수
  const logout = () => {
    // 토큰 및 사용자 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("grade");
    
    // 상태 초기화
    setIsAuthenticated(false);
    setUserProfile(defaultUserProfile);
    
    // 로그인 페이지로 이동
    router.push("/login");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, userProfile, updateProfile, logout }}
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