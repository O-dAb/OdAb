"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrainCircuit, ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 이미 로그인된 상태인지 확인
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 카카오 로그인 시작
  const loginWithKakao = async () => {
    setIsLoading(true);
    try {
      const kakaoRes: { url: string } = await publicApi.get("/api/v1/auth/kakao");
      const kakaoUrl = kakaoRes.url;
      
      if (!kakaoUrl) {
        throw new Error('카카오 로그인 URL이 없습니다.');
      }

      window.location.href = kakaoUrl;
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "카카오 로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center px-4 relative">
      {/* 배경 장식 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
      </div>

      {/* 부유하는 수학 요소들 */}
      <div className="absolute top-1/4 left-10 animate-float-slow opacity-10 dark:opacity-5">
        <span className="text-5xl">π</span>
      </div>
      <div className="absolute bottom-1/3 right-16 animate-float-medium opacity-10 dark:opacity-5">
        <span className="text-4xl">∑</span>
      </div>
      <div className="absolute top-2/3 left-1/4 animate-float opacity-10 dark:opacity-5">
        <span className="text-3xl">√</span>
      </div>
      
      <Card className="w-full max-w-md mx-auto border-0 shadow-xl dark:shadow-blue-900/10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg pt-8 pb-6 px-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/mascot_with_pencil.png"
              alt="수달 캐릭터"
              className="w-40 h-40 object-contain rounded-full bg-blue-100 dark:bg-blue-900/30 shadow"
              draggable={false}
            />
          </div>
          <CardTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300">
            O! dAb
          </CardTitle>
          <CardDescription className="text-center text-lg font-medium text-gray-600 dark:text-gray-300 mt-2">
            나만의 답을 찾아보세요!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="text-center mb-2">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">로그인하고 학습을 시작하세요</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              중학생을 위한 AI 기반 맞춤형 수학 학습
            </p>
          </div>
          
          <Button
            type="button"
            className={`w-full h-12 bg-[#FEE500] hover:bg-[#FFD600] text-black font-medium rounded-xl shadow-md hover:shadow-lg transition-all ${isLoading ? 'opacity-70' : ''}`}
            onClick={loginWithKakao}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>로그인 중...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
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
              </div>
            )}
          </Button>
          
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute border-t border-gray-200 dark:border-gray-700 w-full"></div>
            <div className="relative bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
              또는
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              disabled={isLoading}
              onClick={() => router.push('/')}
            >
              <LockKeyhole className="h-4 w-4 mr-2" />
              게스트로 둘러보기
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-0 flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <span>O! dAb 이용이 처음이신가요? </span>
            <Link href="/" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              자세히 알아보기
            </Link>
          </div>
          
          <div className="text-center text-xs text-gray-400 dark:text-gray-500">
            로그인함으로써 <Link href="#" className="underline">이용약관</Link>과 <Link href="#" className="underline">개인정보처리방침</Link>에 동의합니다
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 애니메이션 스타일 - LoginPage.tsx나 layout.tsx에 추가
export function loginStyles() {
  return (
    <style jsx global>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes float-medium {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
      .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
    `}</style>
  );
}