"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Next.js의 Link 컴포넌트 추가
import axios from "axios";
import { authApi } from "@/lib/api";
/**
 * 복습 일정 컴포넌트
 * 학생이 이전에 학습한 내용을 효과적으로 복습할 수 있도록 일정을 관리
 */

// 타입 정의
interface TodayReview {
  subConceptId: number;
  subConceptType: string;
  questionCount: string;
}

interface ScheduledReview {
  subConceptId: number;
  subConceptType: string;
  questionCount: string;
}

interface SubConcept {
  subConceptId: number;
  subConceptType: string;
  lastLearningDate: number[] | null;
}

interface MajorConcept {
  majorConceptId: number;
  majorConceptType: string;
  subConceptList: SubConcept[];
}

interface ReviewApiResponse {
  todayDate: string;
  todayReviewList: TodayReview[];
  scheduledReviewList: ScheduledReview[];
  majorConceptList: MajorConcept[];
}

// 날짜 배열 → yyyy-mm-dd 문자열 변환
function formatDateArray(dateArr: number[] | null): string {
  if (!dateArr || dateArr.length < 3) return "미학습";
  const [year, month, day] = dateArr;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export function ReviewSchedule({
  educationLevel,
  grade,
}: {
  educationLevel: EducationLevel;
  grade: Grade;
}) {
  // API에서 받아온 복습 데이터 상태
  const [reviewData, setReviewData] = useState<ReviewApiResponse | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // Next.js 라우터 (프로그래매틱 네비게이션 필요 시 사용)
  const router = useRouter();
  // 오늘 날짜 (yyyy-mm-dd)
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // 비동기 함수로 API 데이터 fetch
    async function fetchReviewData() {
      setLoading(true);
      // 디버깅: 요청 시작 로그
      console.log("[복습] API 요청 시작", today);
      try {
        
        // 실제 서버로 요청 (프록시 미설정 시 http://localhost:8080 명시)
        //authApi.get( auth로  하면 오류. 
        const res = await authApi.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learning/review`,
          {
            params: { date: today },
          }
        );
        // 디버깅: 응답 전체 로그
        console.log("[복습] API 응답", res);
        // 응답 데이터 구조 확인
        if (res && res.data) {
          setReviewData(res.data);
          // 디버깅: 파싱된 데이터 로그
          console.log("[복습] 파싱된 데이터", res.data);
        } else {
          // 응답 구조가 예상과 다를 때
          setReviewData(null);
          console.error("[복습] 응답 데이터 구조 이상", res.data);
        }
      } catch (e) {
        // 네트워크 에러, 서버 에러 등
        setReviewData(null);
        console.error("[복습] API 요청 에러", e);
      }
      setLoading(false);
    }
    fetchReviewData();
  }, [today]);

  if (loading) {
    // 로딩 중 표시
    return <div className="text-center py-10 dark:text-white">로딩 중...</div>;
  }

  return (
    <div className="space-y-12 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-6 flex flex-col items-center">
      {/* 오늘의 복습 */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-green-100 via-yellow-50 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full max-w-6xl">
        <CardHeader className="bg-green-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
          <CardTitle className="flex justify-between items-center text-green-700 dark:text-green-300 text-xl font-extrabold">
            <span>복습 일정</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              
              <span className="font-medium dark:text-gray-200">오늘의 복습</span>
            </div>
            <Badge
              variant="outline"
              className="font-normal bg-white/80 dark:bg-gray-800/80 border-green-200 dark:border-gray-600 text-green-700 dark:text-green-300 rounded-full px-3 py-1"
            >
              {reviewData ? reviewData.todayDate : today}
            </Badge>
          </div>
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500 dark:text-red-400">
              데이터를 불러오지 못했습니다.
            </div>
          ) : reviewData.todayReviewList.length > 0 ? (
            <div className="space-y-3">
              {reviewData.todayReviewList.map((review) => (
                <Link
                  key={review.subConceptId}
                  href={`/review/${review.subConceptId}`}
                  className="block"
                >
                  <Card className="cursor-pointer border-0 shadow-md rounded-xl bg-gradient-to-r from-green-50 via-yellow-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 hover:scale-105 transition-transform duration-200">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div className="font-bold text-green-700 dark:text-green-300">
                        {review.subConceptType}
                      </div>
                      <Badge className="bg-green-400 dark:bg-green-600 text-white text-base px-3 py-1 rounded-full shadow">
                        {review.questionCount}문제
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              오늘 복습할 항목이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 예정된 복습 */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full max-w-6xl">
        <CardHeader className="bg-yellow-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
          <CardTitle className="text-yellow-700 dark:text-yellow-300 text-xl font-extrabold">
            예정된 복습
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500 dark:text-red-400">
              데이터를 불러오지 못했습니다.
            </div>
          ) : reviewData.scheduledReviewList.length > 0 ? (
            <div className="space-y-3">
              {reviewData.scheduledReviewList.map((review) => (
                <Link
                  key={review.subConceptId}
                  href={`/review/${review.subConceptId}`}
                  className="block"
                >
                  <Card className="cursor-pointer border-0 shadow-md rounded-xl bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 hover:scale-105 transition-transform duration-200">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div className="font-bold text-yellow-700 dark:text-yellow-300">
                        {review.subConceptType}
                      </div>
                      <Badge className="bg-yellow-400 dark:bg-yellow-600 text-white text-base px-3 py-1 rounded-full shadow">
                        {review.questionCount}문제
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              예정된 복습 항목이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주제별 마지막 학습일 */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full max-w-6xl">
        <CardHeader className="bg-blue-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
          <CardTitle className="text-blue-700 dark:text-blue-300 text-xl font-extrabold">
            주제별 마지막 학습일
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500 dark:text-red-400">
              데이터를 불러오지 못했습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviewData.majorConceptList.map((majorConcept) => (
                <Card
                  key={majorConcept.majorConceptId}
                  className="border-0 shadow rounded-xl bg-white/80 dark:bg-gray-800/80"
                >
                  <CardContent className="p-5">
                    <div className="font-bold mb-2 text-blue-700 dark:text-blue-300">
                      {majorConcept.majorConceptType}
                    </div>
                    {majorConcept.subConceptList.map((subConcept) => (
                      <div
                        key={subConcept.subConceptId}
                        className="flex justify-between items-center mb-1"
                      >
                        <div className="dark:text-gray-300">{subConcept.subConceptType}</div>
                        <Badge
                          variant="outline"
                          className="bg-white/80 dark:bg-gray-700/80 border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1"
                        >
                          {formatDateArray(subConcept.lastLearningDate)}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}