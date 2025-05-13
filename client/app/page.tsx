// app/page.tsx
"use client";

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

  // 프로필이 설정되지 않은 경우 처리
  if (!userProfile.isProfileSet) {
    return null; // UserProfile 컴포넌트는 layout.tsx에서 처리
  }
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
    <div className="space-y-6 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-purple-600 drop-shadow-sm flex items-center gap-3">
          <span>안녕하세요! 오늘도 함께 공부해요.</span>
          <span className="text-4xl">🦦</span>
          <span className="ml-2 px-3 py-1 bg-white/80 rounded-full shadow text-brown-700 font-bold text-base border border-brown-200 animate-bounce">
            수달이가 응원해요!
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
          <CardHeader className="bg-blue-50/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="h-5 w-5 text-blue-500" />
              <span>빠른 시작</span>
            </CardTitle>
            <CardDescription className="text-blue-500 font-medium">
              자주 사용하는 기능을 바로 시작해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-3">
            <Link href="/problem-uploader" className="w-full">
              <Button className="h-auto py-4 bg-blue-400 hover:bg-blue-500 w-full rounded-xl text-lg shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  <span>문제 풀이</span>
                </div>
              </Button>
            </Link>
            <Link href="/mistake-tracker" className="w-full">
              <Button className="h-auto py-4 bg-yellow-400 hover:bg-yellow-500 w-full rounded-xl text-lg shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>오답 노트</span>
                </div>
              </Button>
            </Link>
            <Link href="/concept-browser" className="w-full">
              <Button className="h-auto py-4 bg-pink-300 hover:bg-pink-400 w-full rounded-xl text-lg shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <History className="h-6 w-6" />
                  <span>개념 학습</span>
                </div>
              </Button>
            </Link>
            <Link href="/review-schedule" className="w-full">
              <Button className="h-auto py-4 bg-green-300 hover:bg-green-400 w-full rounded-xl text-lg shadow-md">
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
        <Card className="border-green-100">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <span>오늘의 복습</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {todayReviews.length > 0 ? (
              <div className="space-y-3">
                {todayReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-green-50 rounded-md"
                  >
                    <div>
                      <div className="font-medium">{review.topic}</div>
                      <div className="text-sm text-gray-500">
                        {review.stage} 복습
                      </div>
                    </div>
                    <Badge className="bg-green-400">{review.stage}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                오늘 복습할 항목이 없습니다.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/review" className="w-full">
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-600 hover:bg-green-50"
              >
                복습하기
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <span>학습 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">최근 학습</div>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-600"
                >
                  오늘
                </Badge>
              </div>

              <div className="space-y-2">
                {recentTopics.length > 0 ? (
                  recentTopics.map((topic, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded-md">
                      {topic}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-gray-500">
                    최근 학습 기록이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/solve" className="w-full">
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                문제 풀기
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
