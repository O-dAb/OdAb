"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 실제 구현에서는 여기에 로그인 API 호출 로직이 들어갑니다
      // 임시로 자동 로그인 처리
      setTimeout(() => {
        // 사용자 정보 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "user123",
            name: "김수학",
            email: email || "user@example.com",
            profileImage: null,
          }),
        )

        // 프로필 정보 저장 (이미 있는 경우 덮어쓰지 않음)
        if (!localStorage.getItem("userProfile")) {
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              level: "middle",
              grade: "1",
            }),
          )
        }

        toast({
          title: "로그인 성공",
          description: "수학 학습 도우미에 오신 것을 환영합니다!",
        })

        // 홈으로 리다이렉트
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <CardTitle className="text-center text-xl">로그인</CardTitle>
        <CardDescription className="text-center">수학 학습 도우미에 로그인하세요</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-blue-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-blue-100"
            />
          </div>
          <div className="text-right">
            <Link href="#" className="text-sm text-blue-500 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
          <div className="text-center text-sm">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              회원가입
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
