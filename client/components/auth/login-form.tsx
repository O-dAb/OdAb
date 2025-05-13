"use client";


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import axios from "axios"


export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()


    // 카카오 로그인 시작
  const loginWithKakao = async () => {
    try {
      const response = await axios.get<{ url: string }>('http://localhost:8080/api/v1/auth/kakao');
      const kakaoUrl = response.data.url;
      window.location.href = kakaoUrl; // 여기서 실제로 카카오 로그인 페이지로 이동!
    } catch (error) {
      alert('카카오 로그인 URL을 가져오지 못했습니다.');
    }
  };
  
  const handleKakaoLogin = () => {
    setIsLoading(true)

    // 실제 구현에서는 카카오 SDK를 사용하여 로그인 처리
    // 여기서는 예시로 간단히 구현
    router.push("/")
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
  );
}
