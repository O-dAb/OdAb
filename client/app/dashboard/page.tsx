"use client";

import { Suspense, useEffect, useState } from "react";
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
import { authApi } from "@/lib/api";

// 날짜 배열을 YYYY-MM-DD 형식 문자열로 변환하는 함수
function formatDate(dateArr: number[] | string) {
  if (Array.isArray(dateArr) && dateArr.length === 3) {
    const [y, m, d] = dateArr;
    return `${y}년 ${m}월 ${d}일`;
  }
  return dateArr || "";
}

function formatDateYMD(dateStrOrArr: string | number[]) {
  if (Array.isArray(dateStrOrArr) && dateStrOrArr.length === 3) {
    const [y, m, d] = dateStrOrArr;
    return `${y}년 ${m}월 ${d}일`;
  }
  if (typeof dateStrOrArr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStrOrArr)) {
    const [y, m, d] = dateStrOrArr.split("-");
    return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
  }
  return dateStrOrArr || "";
}

function formatDateDash(dateStrOrArr: string | number[]) {
  if (Array.isArray(dateStrOrArr) && dateStrOrArr.length === 3) {
    const [y, m, d] = dateStrOrArr;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  if (typeof dateStrOrArr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStrOrArr)) {
    return dateStrOrArr;
  }
  return dateStrOrArr || "";
}

export default function DashboardPage() {
  // AuthContext에서 사용자 정보 가져오기
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;
  const router = useRouter();

  // 상태: 오늘의 복습, 최근 학습
  const [todayReviews, setTodayReviews] = useState<any[]>([]);
  const [recentStudy, setRecentStudy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile.isProfileSet) {
      router.push("/landing");
      return;
    }
    // API 호출
    authApi.get("/api/v1/main")
      .then((res) => {
        console.log("authApi /api/v1/main 응답:", res.data);
        setTodayReviews(res.data?.todayReviewList || []);
        setRecentStudy(res.data?.recentStudySubConcept || null);
      })
      .finally(() => setLoading(false));
  }, [userProfile.isProfileSet, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // 최근 학습한 주제
  const recentTopics = getRecentlyStudiedTopics(
    educationLevel as EducationLevel,
    grade
  );

  return (
    <div className="space-y-6 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-purple-600 dark:text-purple-200 drop-shadow-sm flex items-center gap-3">
          <span>안녕하세요! 오늘도 함께 공부해요.</span>
          <span className="text-4xl">🦦</span>
          <span className="ml-2 px-3 py-1 bg-white/80 dark:bg-gray-700/80 rounded-full shadow text-brown-700 dark:text-gray-200 font-bold text-base border border-brown-200 dark:border-gray-600 animate-bounce">
            수달이가 응원해요!
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <CardHeader className="bg-blue-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
              <Calculator className="h-5 w-5 text-blue-500 dark:text-blue-300" />
              <span>빠른 시작</span>
            </CardTitle>
            <CardDescription className="text-blue-500 dark:text-blue-300 font-medium">
              자주 사용하는 기능을 바로 시작해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-3">
            <Link href="/problem-uploader" className="w-full">
              <Button className="h-auto py-4 bg-blue-400 hover:bg-blue-500 dark:bg-blue-600/70 dark:hover:bg-blue-500/70 w-full rounded-xl text-lg shadow-md text-white">
                <div className="flex flex-col items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  <span>문제 업로드</span>
                </div>
              </Button>
            </Link>

            <Link href="/mistake-tracker" className="w-full">
              <Button className="h-auto py-4 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-600/70 dark:hover:bg-yellow-500/70 w-full rounded-xl text-lg shadow-md text-yellow-700 dark:text-white">
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>오답 노트</span>
                </div>
              </Button>
            </Link>

            <Link href="/concept-browser" className="w-full">
              <Button className="h-auto py-4 bg-pink-100 hover:bg-pink-200 dark:bg-pink-600/70 dark:hover:bg-pink-500/70 w-full rounded-xl text-lg shadow-md text-pink-700 dark:text-white">
                <div className="flex flex-col items-center gap-2">
                  <History className="h-6 w-6" />
                  <span>개념 학습</span>
                </div>
              </Button>
            </Link>

             <Link href="/review-schedule" className="w-full"> 
               <Button className="h-auto py-4 bg-green-100 hover:bg-green-200 dark:bg-green-600/70 dark:hover:bg-green-500/70 w-full rounded-xl text-lg shadow-md text-green-700 dark:text-white">
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
        <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-green-100 via-yellow-50 to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <CardHeader className="bg-green-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-200">
              <Clock className="h-5 w-5 text-green-500 dark:text-green-300" />
              <span>오늘의 복습</span>
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-300 font-medium">
              효과적인 학습을 위한 오늘의 복습 항목
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {todayReviews.length > 0 ? (
              <div className="space-y-3">
                {todayReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-green-50/80 dark:bg-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-medium text-green-700 dark:text-green-200">
                        {review.subConceptType}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        마지막 학습일: {formatDateDash(review.lastLearningTime)}
                      </div>
                    </div>
                    <Badge className="bg-green-400 dark:bg-green-500 rounded-lg px-3 py-1">
                      복습
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-300">
                오늘 복습할 항목이 없습니다.
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 pb-6">
            {/* <Link href="/review-schedule" className="w-full"> */}
              {/* <Button className="w-full bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600 rounded-xl font-medium shadow-sm"> */}
                {/* 복습하기 */}
              {/* </Button> */}
            {/* </Link> */}
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <CardHeader className="bg-blue-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
              <BarChart2 className="h-5 w-5 text-blue-500 dark:text-blue-300" />
              <span>학습 현황</span>
            </CardTitle>
            <CardDescription className="text-blue-500 dark:text-blue-300 font-medium">
              내 학습 진도와 최근 학습한 주제
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-200">
                  최근 학습
                </div>
                {recentStudy && recentStudy.lastLearningTime ? (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-blue-200 rounded-lg px-3 py-1">
                    {formatDateDash(recentStudy.lastLearningTime)}
                  </Badge>
                ) : null}
              </div>
              {recentStudy ? (
                <div className="mt-2">
                  <div className="font-bold text-lg text-blue-700 dark:text-blue-200">
                    {recentStudy.subConceptType}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    마지막 학습일: {formatDateDash(recentStudy.lastLearningTime)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 mt-2">
                  최근 학습 데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 