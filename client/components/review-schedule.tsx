"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import type { EducationLevel, Grade } from "@/components/user-profile"
import {
  getReviewSchedule,
  getAllReviewSchedule,
  getTopicLastStudyDate,
  getAllTopicLastStudyDate,
  getCurriculumTopics,
  getAllCurriculumTopics,
} from "@/lib/curriculum-data"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

/**
 * 복습 일정 컴포넌트
 * 학생이 이전에 학습한 내용을 효과적으로 복습할 수 있도록 일정을 관리
 */
interface ReviewScheduleProps {
  educationLevel: EducationLevel
  grade: Grade
}

// 복습 단계별 레이블
const REVIEW_STAGES = {
  1: "1일차",
  2: "4일차",
  3: "6일차",
  4: "13일차",
}

// 경과일 계산 함수
const getDaysAgo = (dateString: string) => {
  const today = new Date()
  const pastDate = new Date(dateString)
  const diffTime = Math.abs(today.getTime() - pastDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function ReviewSchedule({ educationLevel, grade }: ReviewScheduleProps) {
  // 상태 관리
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [showingProblems, setShowingProblems] = useState(false)
  const [showAllGrades] = useState(true) // 항상 true로 고정하여 불필요한 상태 변경 방지
  const [selectedGrade] = useState<Grade>(grade) // 초기값으로 고정하여 불필요한 상태 변경 방지
  const [userAnswer, setUserAnswer] = useState("")
  const router = useRouter();

  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0]

  // 복습 일정 가져오기
  const reviewSchedule = showAllGrades
    ? getAllReviewSchedule(educationLevel)
    : getReviewSchedule(educationLevel, selectedGrade)

  // 오늘 복습할 항목
  const todayReviews = reviewSchedule.filter((review) => review.nextReview === today)

  // 예정된 복습 항목
  const upcomingReviews = reviewSchedule.filter((review) => review.nextReview > today)

  // 주제 목록 가져오기
  const topics = showAllGrades
    ? getAllCurriculumTopics(educationLevel)
    : getCurriculumTopics(educationLevel, selectedGrade)

  // 사용하지 않는 함수 제거
  // const handleGradeChange = (value: string) => {
  //   setSelectedGrade(value as Grade)
  // }

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
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    router.push(`/review/${review.id}?educationLevel=${educationLevel}&grade=${grade}`)
                  }}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{review.topic}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {REVIEW_STAGES[review.reviewStage as keyof typeof REVIEW_STAGES]} 복습
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        처음 학습: {getDaysAgo(review.firstLearned)} 일 전
                      </div>
                    </div>
                    <Badge>{review.problems.length}문제</Badge>
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
          {upcomingReviews.length > 0 ? (
            <div className="space-y-3">
              {upcomingReviews.map((review) => (
                <Card
                  key={review.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    router.push(`/review/${review.id}?educationLevel=${educationLevel}&grade=${grade}`)
                  }}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{review.topic}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {REVIEW_STAGES[review.reviewStage as keyof typeof REVIEW_STAGES]} 복습
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        처음 학습: {getDaysAgo(review.firstLearned)} 일 전
                      </div>
                    </div>
                    <Badge variant="outline">{review.nextReview}</Badge>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => {
              const lastStudyDate = showAllGrades
                ? getAllTopicLastStudyDate(topic, educationLevel)
                : getTopicLastStudyDate(topic, educationLevel, selectedGrade)
              return (
                <Card key={topic}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="font-medium">{topic}</div>
                    {lastStudyDate ? (
                      <Badge variant="outline">{lastStudyDate}</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">
                        미학습
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
