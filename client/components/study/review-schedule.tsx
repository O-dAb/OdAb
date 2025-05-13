"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { EducationLevel, Grade } from "@/components/profile/user-profile";
import {
  getReviewSchedule,
  getAllReviewSchedule,
  getMajorConcepts,
  getCurriculumTopics,
} from "@/lib/curriculum-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

/**
 * 복습 일정 컴포넌트
 * 학생이 이전에 학습한 내용을 효과적으로 복습할 수 있도록 일정을 관리
 */
interface ReviewScheduleProps {
  educationLevel: EducationLevel;
  grade: Grade;
}

// 복습 단계별 레이블
const REVIEW_STAGES = {
  1: "1일차",
  2: "4일차",
  3: "6일차",
  4: "13일차",
};

// 경과일 계산 함수
const getDaysAgo = (dateString: string) => {
  const today = new Date();
  const pastDate = new Date(dateString);
  const diffTime = Math.abs(today.getTime() - pastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function ReviewSchedule({ educationLevel, grade }: ReviewScheduleProps) {
  // 상태 관리
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);
  const [expandedMajorConcepts, setExpandedMajorConcepts] = useState<
    Record<number, boolean>
  >({});
  const router = useRouter();

  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  // 복습 일정 가져오기
  const reviewSchedule = showAllGrades
    ? getAllReviewSchedule(educationLevel)
    : getReviewSchedule(educationLevel, selectedGrade);

  // 오늘 복습할 항목
  const todayReviews = reviewSchedule.filter(
    (review) => review.nextReview === today
  );

  // 예정된 복습 항목
  const upcomingReviews = reviewSchedule.filter(
    (review) => review.nextReview > today
  );

  // 주제 목록 가져오기 - 현재 학년
  const currentGradeTopics = getCurriculumTopics(educationLevel, grade);

  // 대주제 목록 가져오기
  const majorConcepts = getMajorConcepts(educationLevel);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade);
  };

  const toggleMajorConcept = (majorConceptId: number) => {
    setExpandedMajorConcepts((prev) => ({
      ...prev,
      [majorConceptId]: !prev[majorConceptId],
    }));
  };

  const handleReviewClick = (reviewId: number) => {
    // 복습 상세 페이지로 이동
    router.push(
      `/review/${reviewId}?educationLevel=${educationLevel}&grade=${selectedGrade}`
    );
  };

  return (
    <div className="space-y-6">
      {/* 오늘의 복습 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>복습 일정</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                이전에 학습한 문제 기준
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="font-medium">오늘의 복습</span>
            </div>
            <Badge variant="outline" className="font-normal">
              {today}
            </Badge>
          </div>

          {todayReviews.length > 0 ? (
            <div className="space-y-3">
              {todayReviews.map((review) => (
                <Card
                  key={review.id}
                  className="cursor-pointer hover:bg-gray-50 border-purple-100"
                  onClick={() => handleReviewClick(review.id)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{review.topic}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {REVIEW_STAGES[review.reviewStage]} 복습
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        처음 학습: {getDaysAgo(review.firstLearned)} 일 전
                      </div>
                    </div>
                    <Badge className="bg-purple-500">
                      {review.problems.length}문제
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              오늘 복습할 항목이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 예정된 복습 */}
      <Card>
        <CardHeader>
          <CardTitle>예정된 복습</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReviews.length > 0 ? (
            <div className="space-y-3">
              {upcomingReviews.map((review) => (
                <Card
                  key={review.id}
                  className="cursor-pointer hover:bg-gray-50 border-blue-100"
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{review.topic}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {REVIEW_STAGES[review.reviewStage]} 복습
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        처음 학습: {getDaysAgo(review.firstLearned)} 일 전
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                    >
                      {review.nextReview}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              예정된 복습 항목이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주제별 마지막 학습일 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>주제별 마지막 학습일</span>
            <div className="flex items-center gap-2">
              <Select value={selectedGrade} onValueChange={handleGradeChange}>
                <SelectTrigger className="w-[100px] bg-blue-50 border-blue-100">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 대주제별 마지막 학습일 */}
          {majorConcepts.map((majorConcept) => (
            <div
              key={majorConcept.majorConceptId}
              className="border rounded-lg overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleMajorConcept(majorConcept.majorConceptId)}
              >
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <span>{majorConcept.majorConceptType}</span>
                </h3>
                {expandedMajorConcepts[majorConcept.majorConceptId] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {expandedMajorConcepts[majorConcept.majorConceptId] && (
                <div className="p-4 space-y-3">
                  {majorConcept.subConceptList.map((subConcept) => (
                    <Card
                      key={subConcept.subConceptId}
                      className="border-blue-100"
                    >
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="font-medium">
                          {subConcept.subConceptType}
                        </div>
                        {subConcept.lastLearningDate ? (
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-600"
                          >
                            {subConcept.lastLearningDate}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100">
                            미학습
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
