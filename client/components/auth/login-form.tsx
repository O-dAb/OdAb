"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import { publicApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // 이미 로그인된 상태인지 확인
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // 카카오 로그인 시작
  const loginWithKakao = async () => {
    setIsLoading(true)
    try {
      const kakaoRes: { url: string } = await publicApi.get("/api/v1/auth/kakao");
      const kakaoUrl = kakaoRes.url;
      
      if (!kakaoUrl) {
        throw new Error('카카오 로그인 URL이 없습니다.')
      }

      window.location.href = kakaoUrl
    } catch (error) {
      console.error('카카오 로그인 에러:', error)
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "카카오 로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-center mb-4">
          <BrainCircuit className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-center text-xl">로그인</CardTitle>
        <CardDescription className="text-center">
          수학 학습 도우미에 로그인하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Button
          type="button"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={loginWithKakao}
          disabled={isLoading}
        >
          {isLoading ? (
            "로그인 중..."
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M9 1.5C4.30875 1.5 0.5 4.4175 0.5 8C0.5 10.2 1.98625 12.1062 4.14375 13.2375C3.9775 13.8388 3.4925 15.5463 3.39125 15.9275C3.26875 16.4138 3.58125 16.4125 3.8125 16.2562C3.98625 16.1412 6.10625 14.7138 7.0075 14.1275C7.6525 14.2312 8.3175 14.2875 9 14.2875C13.6912 14.2875 17.5 11.37 17.5 7.7875C17.5 4.4175 13.6912 1.5 9 1.5Z"
                  fill="black"
                />
              </svg>
              카카오톡으로 로그인
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
