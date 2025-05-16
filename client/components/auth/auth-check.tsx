"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 확인
    const user = localStorage.getItem("user")

    // 2. 토큰 체크
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      toast({
        title: "로그인이 필요합니다",
        description: "서비스를 이용하려면 로그인해주세요.",
      })
      router.push("/login")
    }

    setIsLoading(false)
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null




}
