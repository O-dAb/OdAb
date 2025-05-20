// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { GraduationCap, Brain, BookOpen, Lightbulb, ArrowRight, CheckCircle2, Star, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoadingPage from "./loading";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  // 로그인하지 않은 경우 랜딩 페이지 표시
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 히어로 섹션 - 애니메이션 추가 */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        {/* 배경 장식 요소 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-block animate-bounce-slow mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
              <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          {/* 프로젝트 이름 강조 */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 dark:from-purple-300 dark:via-blue-300 dark:to-violet-300">
                O! 답
              </span>
            </h1>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 italic">
              "나만의 답을 찾아보세요!"
            </p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 relative">
            AI와 함께하는
            <br />
            <span className="text-blue-600 dark:text-blue-300">수학의 즐거움</span>
            <span className="absolute -right-12 -top-6">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            중학생을 위한 AI 기반 맞춤형 수학 학습 도우미
            <br />
            단계별 풀이를 통해 논리적인 추론과정을 배워보세요
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 shadow-md shadow-purple-200 dark:shadow-purple-900/20 transform hover:scale-105 transition-all">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/login">
              {/* <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-400 px-8 transform hover:scale-105 transition-all">
                로그인
              </Button> */}
            </Link>
          </div>
        </div>
        
        {/* 부유하는 수학 요소들 */}
        <div className="absolute top-1/4 left-8 animate-float-slow opacity-20 dark:opacity-10">
          <span className="text-5xl">π</span>
        </div>
        <div className="absolute bottom-1/4 right-12 animate-float-medium opacity-20 dark:opacity-10">
          <span className="text-4xl">∑</span>
        </div>
        <div className="absolute top-2/3 left-1/4 animate-float opacity-20 dark:opacity-10">
          <span className="text-3xl">√</span>
        </div>
      </section>

      {/* 수달이 소개 섹션 - 새로 추가 */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square max-w-md mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full p-8 relative overflow-hidden">
                {/* 여기서는 수달 이미지가 있다고 가정합니다. 실제 이미지로 교체하세요 */}
                <div className="w-full h-full rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                  <span className="text-6xl">🦦</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full shadow-lg">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-block bg-purple-100 dark:bg-purple-900/30 px-4 py-1 rounded-full text-purple-600 dark:text-purple-300 font-medium text-sm mb-2">
                AI 학습 친구
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                수달이를 소개합니다
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                수달이는 여러분의 개인 AI 수학 튜터입니다. 친절하고 똑똑한 수달이는 여러분의 학습 패턴을 이해하고, 
                어려운 수학 개념을 쉽게 설명해 드립니다. 언제든지 질문하고, 도움을 받아보세요!
              </p>
              <div className="pt-4">
                <div className="flex space-x-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">24시간 학습 도우미</p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">개인화된 학습 계획 설계</p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">실시간 문제 풀이 지원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 - 카드 디자인 개선 */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white inline-block relative">
            주요 기능
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-xl group hover:-translate-y-1">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
              <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI 기반 맞춤형 학습</h3>
            <p className="text-gray-600 dark:text-gray-300">
              학생의 수준과 학습 패턴을 분석하여 최적화된 학습 경험을 제공합니다. 
              어려운 부분은 더 자세히, 쉬운 부분은 빠르게 진행합니다.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:shadow-xl group hover:-translate-y-1">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">단계별 풀이 과정</h3>
            <p className="text-gray-600 dark:text-gray-300">
              문제 해결 과정을 단계별로 제시하여 논리적 사고력을 키웁니다.
              수달이가 각 단계를 차근차근 설명해 드립니다.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 transition-all hover:shadow-xl group hover:-translate-y-1">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">맞춤형 피드백</h3>
            <p className="text-gray-600 dark:text-gray-300">
              실시간 피드백으로 오답 노트를 자동으로 관리하고 취약점을 보완합니다.
              실수를 반복하지 않도록 도와드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 학습 과정 섹션 - 타임라인 형태로 개선 */}
      <section id="journey" className="container mx-auto px-4 py-20 relative">
        <div className="absolute left-1/2 top-40 bottom-32 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 hidden md:block"></div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            수달이와 함께하는 학습 여정
          </h2>
          
          <div className="space-y-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="md:w-1/2 md:text-right order-2 md:order-1">
                <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
                  1. 개념 이해하기
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  AI가 제시하는 단계별 설명으로 수학 개념을 쉽게 이해할 수 있습니다.
                  시각적 자료와 함께 직관적으로 설명해 드립니다.
                </p>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">
                    "수달이의 설명 덕분에 방정식의 개념이 머릿속에 쏙쏙 들어와요!" - 중2 김수학
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 order-1 md:order-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 hidden md:block order-3"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="md:w-1/2 hidden md:block order-1"></div>
              
              <div className="relative z-10 order-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 md:text-left order-3">
                <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-4">
                  2. 문제 풀이 연습
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  난이도별 문제를 풀며 실력을 향상시키고 자신감을 키웁니다.
                  수달이가 학습 진도에 맞춰 문제를 추천합니다.
                </p>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">
                    "어려운 문제도 단계별로 접근하니 해결할 수 있어요!" - 중3 박문제
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="md:w-1/2 md:text-right order-2 md:order-1">
                <h3 className="text-2xl font-semibold text-green-600 dark:text-green-300 mb-4">
                  3. 복습과 피드백
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  AI가 분석한 학습 데이터를 바탕으로 맞춤형 복습 계획을 제공합니다.
                  취약점을 집중적으로 보완할 수 있습니다.
                </p>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md border-l-4 border-green-500">
                  <p className="text-sm italic text-gray-500 dark:text-gray-400">
                    "수달이의 피드백으로 내 약점을 정확히 알게 되었어요!" - 중1 이피드백
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 order-1 md:order-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 hidden md:block order-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 성공 사례 섹션 - 새로 추가 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1 rounded-full text-yellow-600 dark:text-yellow-300 font-medium text-sm mb-2">
            학생들의 이야기
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            학생들의 성공 사례
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-300">
                JH
              </div>
              <div className="flex">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">정현, 중3</h3>
            <p className="text-gray-600 dark:text-gray-300">
              "수학이 항상 어려웠는데, 수달이와 함께 공부하면서 성적이 많이 올랐어요! 
              특히 도형 문제가 어려웠는데 이제는 자신 있게 풀 수 있어요."
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-purple-600 dark:text-purple-300">
                SY
              </div>
              <div className="flex">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">소연, 중2</h3>
            <p className="text-gray-600 dark:text-gray-300">
              "친구들에게 수학 문제를 설명해주는 게 어려웠는데, 수달이가 설명하는 방식을 
              배우고 나니 저도 논리적으로 설명할 수 있게 되었어요!"
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-green-600 dark:text-green-300">
                MJ
              </div>
              <div className="flex">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">민준, 중1</h3>
            <p className="text-gray-600 dark:text-gray-300">
              "수학 공부가 지루했는데, 수달이와 함께하니까 재미있어졌어요. 
              게임하듯이 문제를 풀다 보니 어느새 실력이 늘었어요!"
            </p>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 - 새로 추가 */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h2>
            <p className="text-gray-600 dark:text-gray-300">궁금한 점이 있으신가요? 아래 질문들을 확인해보세요</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                수달이는 어떤 학년을 대상으로 하나요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                수달이는 중학교 1-3학년 학생들을 주 대상으로 합니다. 각 학년별 교육과정에 맞춘 
                맞춤형 학습을 제공합니다.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                무료로 이용할 수 있나요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                네, 기본 기능은 무료로 이용 가능합니다. 더 많은 문제와 심화 학습을 원하시면 
                프리미엄 플랜을 이용해보세요.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                부모님도 학습 진도를 확인할 수 있나요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                네, 학부모용 대시보드를 통해 자녀의 학습 진도와 성취도를 확인할 수 있습니다. 
                정기적인 학습 리포트도 제공됩니다.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                모바일에서도 사용 가능한가요?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                네, 모바일 앱을 통해 언제 어디서나 학습이 가능합니다. iOS와 안드로이드 버전 모두 
                제공됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 - 디자인 개선 */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 수달이와 함께하세요!
            </h2>
            
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              AI 기반의 맞춤형 수학 학습으로 더 효과적인 학습 경험을 만들어보세요.
              오늘부터 수달이와 함께 수학의 즐거움을 느껴보세요!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 px-8 shadow-lg shadow-purple-700/20 transform hover:scale-105 transition-all">
                  시작하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 px-8">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 - 개선 */}
      <footer className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-300 mb-4">O! dAb</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                중학생을 위한 AI 기반 맞춤형 수학 학습 도우미
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">학습 자료</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">중1 수학</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">중2 수학</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">중3 수학</a></li>
                {/* <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">수학 경시대회</a></li> */}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">회사 정보</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">소개</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">팀</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">블로그</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">채용</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">지원</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">FAQ</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">문의하기</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">이용약관</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
            <p>© 2024 O! dAb. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 애니메이션을 위한 커스텀 스타일 추가
export function globalStyles() {
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
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
      .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
      .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
    `}</style>
  );
}