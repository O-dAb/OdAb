"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { EducationLevel, Grade } from "@/components/user-profile"
import { useRouter } from "next/navigation"
import axios from "axios"

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
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function ReviewSchedule({ educationLevel, grade }: { educationLevel: EducationLevel; grade: Grade }) {
  // API에서 받아온 복습 데이터 상태
  const [reviewData, setReviewData] = useState<ReviewApiResponse | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // Next.js 라우터
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
        const res = await axios.get("http://localhost:8080/api/v1/learning/review", {
          params: { date: today },
        });
        // 디버깅: 응답 전체 로그
        console.log("[복습] API 응답", res);
        // 응답 데이터 구조 확인
        if (res.data && res.data.data) {
          setReviewData(res.data.data);
          // 디버깅: 파싱된 데이터 로그
          console.log("[복습] 파싱된 데이터", res.data.data);
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
    return <div className="text-center py-10">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 오늘의 복습 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>복습 일정</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="font-medium">오늘의 복습</span>
            </div>
            <Badge variant="outline" className="font-normal">
              {reviewData ? reviewData.todayDate : today}
            </Badge>
          </div>
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500">데이터를 불러오지 못했습니다.</div>
          ) : reviewData.todayReviewList.length > 0 ? (
            <div className="space-y-3">
              {reviewData.todayReviewList.map((review) => (
                <Card
                  key={review.subConceptId}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    router.push(`/review/${review.subConceptId}?educationLevel=${educationLevel}&grade=${grade}`)
                  }}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="font-medium">{review.subConceptType}</div>
                    <Badge>{review.questionCount}문제</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">오늘 복습할 항목이 없습니다.</div>
          )}
        </CardContent>
      </Card>

      {/* 예정된 복습 */}
      <Card>
        <CardHeader>
          <CardTitle>예정된 복습</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500">데이터를 불러오지 못했습니다.</div>
          ) : reviewData.scheduledReviewList.length > 0 ? (
            <div className="space-y-3">
              {reviewData.scheduledReviewList.map((review) => (
                <Card
                  key={review.subConceptId}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    router.push(`/review/${review.subConceptId}?educationLevel=${educationLevel}&grade=${grade}`)
                  }}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="font-medium">{review.subConceptType}</div>
                    <Badge variant="outline">{review.questionCount}문제</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">예정된 복습 항목이 없습니다.</div>
          )}
        </CardContent>
      </Card>

      {/* 주제별 마지막 학습일 */}
      <Card>
        <CardHeader>
          <CardTitle>주제별 마지막 학습일</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 데이터가 없을 때 에러 메시지 */}
          {!reviewData ? (
            <div className="text-center py-6 text-red-500">데이터를 불러오지 못했습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewData.majorConceptList.map((majorConcept) => (
                <Card key={majorConcept.majorConceptId}>
                  <CardContent className="p-4">
                    <div className="font-bold mb-2">{majorConcept.majorConceptType}</div>
                    {majorConcept.subConceptList.map((subConcept) => (
                      <div key={subConcept.subConceptId} className="flex justify-between items-center mb-1">
                        <div>{subConcept.subConceptType}</div>
                        <Badge variant="outline">{formatDateArray(subConcept.lastLearningDate)}</Badge>
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
  )
}
