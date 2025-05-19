// app/page.tsx
"use client";

import { Suspense } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, History, Clock, BarChart2 } from "lucide-react";
import { getRecentlyStudiedTopics } from "@/lib/curriculum-data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EducationLevel } from "@/components/user-profile";

export default function HomePage() {
  // AuthContext에서 사용자 정보 가져오기
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;
  const router = useRouter();

  // 최근 학습한 주제
  const recentTopics = getRecentlyStudiedTopics(
    educationLevel as EducationLevel,
    grade
  );

  // 오늘의 복습 (예시 데이터)
  const todayReviews = [
    { topic: "수와 연산", stage: "1일차" },
    { topic: "변화와 관계", stage: "4일차" },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-pink-950 dark:via-blue-950 dark:to-purple-950 min-h-screen p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-300 drop-shadow-sm flex items-center gap-3">
            <span>안녕하세요! 오늘도 함께 공부해요.</span>
            <span className="text-4xl">🦦</span>
            <span className="ml-2 px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full shadow text-brown-700 dark:text-gray-300 font-bold text-base border border-brown-200 dark:border-gray-700 animate-bounce">
              수달이가 응원해요!
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
            <CardHeader className="bg-blue-50/60 dark:bg-blue-950/60 border-b-0 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Calculator className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span>빠른 시작</span>
              </CardTitle>
              <CardDescription className="text-blue-500 dark:text-blue-400 font-medium">
                자주 사용하는 기능을 바로 시작해보세요
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-2 gap-3">
              <Link href="/problem-uploader" className="w-full">
                <Button className="h-auto py-4 bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 w-full rounded-xl text-lg shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    <span>문제 업로드</span>
                  </div>
                </Button>
              </Link>
              <Link href="/mistake-tracker" className="w-full">
                <Button className="h-auto py-4 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-600 w-full rounded-xl text-lg shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>오답 노트</span>
                  </div>
                </Button>
              </Link>
              <Link href="/concept-browser" className="w-full">
                <Button className="h-auto py-4 bg-pink-300 hover:bg-pink-400 dark:bg-pink-700 dark:hover:bg-pink-600 w-full rounded-xl text-lg shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <History className="h-6 w-6" />
                    <span>개념 학습</span>
                  </div>
                </Button>
              </Link>
              <Link href="/review-schedule" className="w-full">
                <Button className="h-auto py-4 bg-green-300 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600 w-full rounded-xl text-lg shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-6 w-6" />
                    <span>복습하기</span>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-green-100 via-yellow-50 to-green-50 dark:from-green-900 dark:via-yellow-900 dark:to-green-900">
            <CardHeader className="bg-green-50/60 dark:bg-green-950/60 border-b-0 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Clock className="h-5 w-5 text-green-500 dark:text-green-400" />

                <span>오늘의 복습</span>
              </CardTitle>
              <CardDescription className="text-green-500 dark:text-green-400 font-medium">
                효과적인 학습을 위한 오늘의 복습 항목
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {todayReviews.length > 0 ? (
                <div className="space-y-3">
                  {todayReviews.map((review, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-green-50/80 dark:bg-green-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="font-medium text-green-700 dark:text-green-300">
                          {review.topic}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {review.stage} 복습
                        </div>
                      </div>
                      <Badge className="bg-green-400 dark:bg-green-600 rounded-lg px-3 py-1">
                        {review.stage}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  오늘 복습할 항목이 없습니다.
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link href="/review" className="w-full">
                <Button className="w-full bg-green-400 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 rounded-xl font-medium shadow-sm">
                  복습하기
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-blue-100 dark:from-blue-900 dark:via-purple-900 dark:to-blue-900">
            <CardHeader className="bg-blue-50/60 dark:bg-blue-950/60 border-b-0 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <BarChart2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span>학습 현황</span>
              </CardTitle>
              <CardDescription className="text-blue-500 dark:text-blue-400 font-medium">
                내 학습 진도와 최근 학습한 주제
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    최근 학습
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg px-3 py-1">
                    오늘
                  </Badge>
                </div>

                <div className="space-y-2">
                  {recentTopics.length > 0 ? (
                    recentTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="text-blue-700 dark:text-blue-300">
                          {topic}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                      최근 학습 기록이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link href="/solve" className="w-full">
                <Button className="w-full bg-blue-400 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-xl font-medium shadow-sm">
                  문제 풀기
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
