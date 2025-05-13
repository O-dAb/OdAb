"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Eraser,
  Pen,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { MainHeader } from "@/components/layout/main-header";

interface SubConcept {
  subConceptId: number;
  subConceptType: string;
}

interface Solution {
  questionSolutionId: number;
  step: string;
  solutionContent: string;
}

interface Question {
  questionId: number;
  questionImg: string;
  questionText: string;
  answer: string;
  registedAt: string;
  isCorrect: boolean;
  times: number;
  solvedAt: string;
  retryQuestionSubConceptDtos: SubConcept[];
  retryQuestionSolutionDtos: Solution[];
}

interface Point {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  lastPoint: Point | null;
  color: string;
  lineWidth: number;
}

export default function RetryQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const questionId = params.id as string;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const numericQuestionId = questionId
    ? parseInt(questionId as string, 10)
    : null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastPoint: null,
    color: "#000000",
    lineWidth: 2,
  });
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get<Question>(
          `http://localhost:8080/api/v1/question/${numericQuestionId}/retry`
        );
        console.log(response.data);
        setQuestion(response.data);
      } catch (error) {
        console.error("문제 불러오기 실패:", error);
        toast({
          title: "문제 불러오기 실패",
          description: "문제를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, toast]);

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 크기 설정
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 초기 설정
    ctx.strokeStyle = drawingState.color;
    ctx.lineWidth = drawingState.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // 그리기 함수
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingState.isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingState.lastPoint) {
      ctx.beginPath();
      ctx.moveTo(drawingState.lastPoint.x, drawingState.lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setDrawingState((prev) => ({
      ...prev,
      lastPoint: { x, y },
    }));
  };

  // 그리기 시작
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawingState((prev) => ({
      ...prev,
      isDrawing: true,
      lastPoint: { x, y },
    }));
  };

  // 그리기 종료
  const stopDrawing = () => {
    setDrawingState((prev) => ({
      ...prev,
      isDrawing: false,
      lastPoint: null,
    }));
  };

  // 지우개 모드 토글
  const toggleEraser = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsEraser(!isEraser);
    ctx.strokeStyle = !isEraser ? "#FFFFFF" : drawingState.color;
    ctx.lineWidth = !isEraser ? 20 : drawingState.lineWidth;
  };

  // 캔버스 초기화
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "답변을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setSubmittedAnswer(userAnswer);
    const isCorrect = userAnswer === question?.answer;

    toast({
      title: isCorrect ? "정답입니다!" : "오답입니다",
      description: isCorrect
        ? "정답을 맞추셨습니다."
        : "다시 한번 생각해보세요.",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleBackToList = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col h-screen">
        <MainHeader activeTab="study" />
        <div className="flex-1 p-8">
          <Button variant="outline" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">
                문제를 찾을 수 없습니다
              </h2>
              <p className="text-gray-500">
                요청하신 문제가 존재하지 않거나 접근할 수 없습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <MainHeader activeTab="study" />
      <div className="flex-1 p-8">
        <Button
          variant="outline"
          onClick={handleBackToList}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로 돌아가기</span>
        </Button>

        <Card>
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex justify-between items-center">
              <CardTitle>문제 다시 풀기</CardTitle>
              <div className="flex gap-2">
                {question.retryQuestionSubConceptDtos.map((concept) => (
                  <Badge key={concept.subConceptId} variant="secondary">
                    {concept.subConceptType}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* 문제 내용 */}
            <div className="space-y-4">
              <div className="font-medium text-lg">문제</div>
              <p className="text-gray-700">{question.questionText}</p>
              {question.questionImg && (
                <img
                  src={question.questionImg}
                  alt="문제 이미지"
                  className="mt-4 max-w-full rounded-lg border border-purple-100"
                />
              )}
            </div>

            {/* 답안 입력 폼 */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <div className="font-medium">풀이 과정</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleEraser}
                    className={isEraser ? "bg-purple-100" : ""}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="border border-purple-100 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[300px] bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>

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
                  onClick={handleSubmitAnswer}
                >
                  제출
                </Button>
              </div>
            </div>

            {/* 제출한 답변 표시 */}
            {submittedAnswer && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                  {submittedAnswer === question.answer ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>제출한 답변</span>
                </div>
                <p>{submittedAnswer}</p>
              </div>
            )}

            {/* 해설 표시 */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
                className="text-purple-600 hover:text-purple-700"
              >
                {showSolution ? "해설 닫기" : "해설 보기"}
              </Button>
              {showSolution &&
                question.retryQuestionSolutionDtos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentStep === 0}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {currentStep + 1} /{" "}
                      {question.retryQuestionSolutionDtos.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentStep((prev) =>
                          Math.min(
                            question.retryQuestionSolutionDtos.length - 1,
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        currentStep ===
                        question.retryQuestionSolutionDtos.length - 1
                      }
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            </div>

            {showSolution && question.retryQuestionSolutionDtos.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-md">
                <h3 className="font-medium text-purple-700 mb-3">해설</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="font-medium text-purple-600">
                      Step {currentStep + 1}
                    </div>
                    <p className="text-gray-700">
                      {
                        question.retryQuestionSolutionDtos[currentStep]
                          .solutionContent
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
