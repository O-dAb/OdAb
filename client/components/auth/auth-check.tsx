"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const authCode = searchParams.get("auth_code");
    // 메인페이지에서만 auth_code 예외 허용
    if (pathname === "/" && authCode) {
      setIsLoading(false);
      setIsAuthenticated(true); // 임시로 인증된 것처럼 children 렌더
      return;
    }

    // 2. 토큰 체크
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    } else {
      // 3. /login이 아니면 리다이렉트
      if (pathname !== "/login") {
        toast({
          title: "로그인이 필요합니다",
          description: "서비스를 이용하려면 로그인해주세요.",
        })
        router.push("/login")
      }
    }
    setIsLoading(false)
  }, [router, toast, pathname, searchParams])

  // 4. 로딩 중에는 스피너
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 5. 인증된 경우에만 children 렌더
  return isAuthenticated ? <>{children}</> : null
}
