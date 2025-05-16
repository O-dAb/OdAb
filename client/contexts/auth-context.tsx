// contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { EducationLevel, Grade } from "@/components/user-profile";

type UserProfile = {
  userName: string;
  educationLevel: EducationLevel;
  grade: Grade;
  isProfileSet: boolean;
};

type AuthContextType = {
  userProfile: UserProfile;
  updateProfile: (level: EducationLevel, grade: Grade) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    userName: "김수학", // 기본값
    educationLevel: "middle",
    grade: "1",
    isProfileSet: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 프로필 확인
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const { level, grade } = JSON.parse(savedProfile);
      setUserProfile((prev) => ({
        ...prev,
        educationLevel: level,
        grade: grade,
        isProfileSet: true,
      }));
    } else if (pathname !== "/settings" && pathname !== "/") {
      // 프로필이 설정되지 않았고 홈이나 설정 페이지가 아니면 홈으로 리다이렉트
      router.push("/");
    }
  }, [pathname, router]);

  const updateProfile = (level: EducationLevel, grade: Grade) => {
    const newProfile = {
      ...userProfile,
      educationLevel: level,
      grade: grade,
      isProfileSet: true,
    };

    setUserProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify({ level, grade }));

    // 프로필 설정 후 홈으로 리다이렉트 (만약 초기 설정이었다면)
    if (!userProfile.isProfileSet && pathname === "/") {
      router.refresh(); // 현재 페이지 새로고침
    }
  };

  return (
    <AuthContext.Provider value={{ userProfile, updateProfile }}>
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
