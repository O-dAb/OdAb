"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoadingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 로딩 애니메이션 효과
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // 사용자 로그인 상태 확인
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("user") !== null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <BrainCircuit className="h-20 w-20 text-purple-500 dark:text-purple-400 animate-pulse" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-purple-700 dark:text-purple-300">
                  {progress}%
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">O! dAb 로딩 중...</h1>
            <p className="text-gray-600 dark:text-gray-400">학습 데이터를 불러오고 있습니다.</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <Card className="border-purple-200 dark:border-gray-600 shadow-lg">
            <CardHeader className="bg-purple-50 dark:bg-gray-800 border-b border-purple-100 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <BrainCircuit className="h-12 w-12 text-purple-500 dark:text-purple-400" />
              </div>
              <CardTitle className="text-center text-2xl dark:text-gray-200">수학 도우미</CardTitle>
              <CardDescription className="text-center dark:text-gray-400">맞춤형 수학 학습을 위한 최고의 도우미</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 dark:bg-gray-800">
              <p className="text-center text-gray-600 dark:text-gray-300">
                {isLoggedIn
                  ? "환영합니다! 수학 도우미를 시작하시겠습니까?"
                  : "수학 도우미를 사용하려면 로그인이 필요합니다."}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 dark:bg-gray-800">
              {isLoggedIn ? (
                <Button className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500" onClick={() => router.push("/")}>
                  시작하기
                </Button>
              ) : (
                <>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500" onClick={() => router.push("/login")}>
                    로그인
                  </Button>
                  <div className="text-center text-sm dark:text-gray-300">
                    계정이 없으신가요?{" "}
                    <Link href="/signup" className="text-purple-500 dark:text-purple-400 hover:underline">
                      회원가입
                    </Link>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}