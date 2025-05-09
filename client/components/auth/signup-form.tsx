"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { EducationLevel, Grade } from "@/components/profile/user-profile"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("middle")
  const [grade, setGrade] = useState<Grade>("1")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 실제 구현에서는 여기에 회원가입 API 호출 로직이 들어갑니다
      // 임시로 자동 회원가입 처리
      setTimeout(() => {
        // 사용자 정보 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "user123",
            name: name || "김수학",
            email: email || "user@example.com",
            profileImage: null,
          }),
        )

        // 프로필 정보 저장
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            level: educationLevel,
            grade: grade,
          }),
        )

        toast({
          title: "회원가입 성공",
          description: "수학 학습 도우미에 오신 것을 환영합니다!",
        })

        // 홈으로 리다이렉트
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-200">
        <CardTitle className="text-center text-xl">회원가입</CardTitle>
        <CardDescription className="text-center">수학 학습 도우미 계정을 만드세요</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-blue-100"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-blue-100"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>학교 구분</Label>
              <RadioGroup
                defaultValue={educationLevel}
                value={educationLevel}
                onValueChange={(value) => setEducationLevel(value as EducationLevel)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="middle" id="middle" className="text-green-500" />
                  <Label htmlFor="middle">중학교</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" className="text-blue-500" />
                  <Label htmlFor="high">고등학교</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>학년</Label>
              <Select value={grade} onValueChange={(value) => setGrade(value as Grade)}>
                <SelectTrigger className="w-full border-blue-100">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
          <div className="text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              로그인
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
