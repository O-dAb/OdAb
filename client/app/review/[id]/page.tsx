"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getReviewDetail } from "@/lib/curriculum-data";
import type { EducationLevel, Grade } from "@/components/profile/user-profile";

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

export default function ReviewDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const reviewId = Number.parseInt(searchParams.get("id") || "0");
  const educationLevel = (searchParams.get("educationLevel") ||
    "middle") as EducationLevel;
  const grade = (searchParams.get("grade") || "1") as Grade;

  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    // 복습 상세 정보 가져오기
    const reviewDetail = getReviewDetail(reviewId, educationLevel, grade);
    setReview(reviewDetail);
    setLoading(false);
  }, [reviewId, educationLevel, grade]);

  const handleSubmitAnswer = (problemIndex: number) => {
    if (!userAnswer.trim()) {
      toast({
        title: "답변을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // 답변 저장
    setSubmittedAnswers({
      ...submittedAnswers,
      [problemIndex]: userAnswer,
    });

    toast({
      title: "답변이 제출되었습니다",
      description: "다음 문제로 넘어갑니다.",
    });

    // 다음 문제로 이동하거나 완료 처리
    if (problemIndex < review.problems.length - 1) {
      setCurrentProblemIndex(problemIndex + 1);
    } else {
      toast({
        title: "복습 완료!",
        description: "모든 문제를 풀었습니다.",
      });
    }

    // 입력 초기화
    setUserAnswer("");
  };

  const handleBackToList = () => {
    router.push("/study");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={handleBackToList} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          복습 목록으로 돌아가기
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              복습 정보를 찾을 수 없습니다
            </h2>
            <p className="text-gray-500">
              요청하신 복습 정보가 존재하지 않거나 접근할 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        onClick={handleBackToList}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>복습 목록으로 돌아가기</span>
      </Button>

      <Card>
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <CardTitle className="flex justify-between items-center">
            <span>{review.topic} 복습</span>
            <Badge className="bg-purple-500">
              {REVIEW_STAGES[review.reviewStage]} 복습
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-500">최초 학습일:</span>{" "}
              {review.firstLearned} ({getDaysAgo(review.firstLearned)}일 전)
            </div>
            <Badge variant="outline" className="font-normal">
              {review.problems.length}문제
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                문제 {currentProblemIndex + 1} / {review.problems.length}
              </div>
              <div className="flex gap-2">
                {Array.from({ length: review.problems.length }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentProblemIndex
                          ? "bg-purple-500"
                          : index in submittedAnswers
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )
                )}
              </div>
            </div>

            <Card className="border-purple-100">
              <CardContent className="p-4">
                <div className="font-medium mb-4">
                  {review.problems[currentProblemIndex]}
                </div>

                {/* 문제 풀이 공간 */}
                <div className="space-y-4">
                  <Textarea
                    placeholder="여기에 풀이 과정을 작성하세요..."
                    className="min-h-[100px] border-purple-100 focus-visible:ring-purple-500"
                  />

                  <div className="flex items-center gap-2">
                    <span className="font-medium">답:</span>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="답을 입력하세요"
                      className="max-w-[200px] border-purple-100 focus-visible:ring-purple-500"
                    />
                    <Button
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600"
                      onClick={() => handleSubmitAnswer(currentProblemIndex)}
                    >
                      제출
                    </Button>
                  </div>
                </div>

                {/* 제출한 답변 표시 */}
                {currentProblemIndex in submittedAnswers && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>제출한 답변</span>
                    </div>
                    <p>{submittedAnswers[currentProblemIndex]}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-purple-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentProblemIndex > 0) {
                      setCurrentProblemIndex(currentProblemIndex - 1);
                    }
                  }}
                  disabled={currentProblemIndex === 0}
                  className="border-purple-100 text-purple-600 hover:bg-purple-50"
                >
                  이전 문제
                </Button>
                <Button
                  onClick={() => {
                    if (currentProblemIndex < review.problems.length - 1) {
                      setCurrentProblemIndex(currentProblemIndex + 1);
                    }
                  }}
                  disabled={currentProblemIndex === review.problems.length - 1}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  다음 문제
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
