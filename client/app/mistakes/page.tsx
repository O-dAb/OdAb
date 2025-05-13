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
  Undo,
  Circle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { MainHeader } from "@/components/layout/main-header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

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

  // 새로 추가된 상태들
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [availableColors] = useState([
    "#000000", // 검정
    "#FF0000", // 빨강
    "#0000FF", // 파랑
    "#008000", // 녹색
    "#FFA500", // 주황
    "#800080", // 보라
    "#FF00FF", // 핑크
  ]);

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
  }, [questionId, toast, numericQuestionId]);

  // Canvas 초기화 및 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = isEraser ? "#FFFFFF" : drawingState.color;
    ctx.lineWidth = isEraser ? 20 : drawingState.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = isEraser ? "#FFFFFF" : drawingState.color;
  }, [drawingState.color, drawingState.lineWidth, isEraser]);

  // 캔버스 상태 저장 함수 (Undo용)
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 현재 캔버스 내용 저장
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, imageData]);
  };

  // Undo 함수
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 스택에서 마지막 항목 제거
    const newStack = [...undoStack];
    newStack.pop(); // 현재 상태 제거
    setUndoStack(newStack);

    // 캔버스 비우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 마지막 저장 상태 복원
    if (newStack.length > 0) {
      ctx.putImageData(newStack[newStack.length - 1], 0, 0);
    }
  };

  // 펜 색상 변경 함수
  const changeColor = (color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 지우개 모드 해제
    setIsEraser(false);

    // 새 색상 설정
    ctx.strokeStyle = color;
    setDrawingState((prev) => ({
      ...prev,
      color: color,
    }));
  };

  // 펜 두께 변경 함수
  const changeLineWidth = (width: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 선 두께 업데이트
    ctx.lineWidth = width;
    setDrawingState((prev) => ({
      ...prev,
      lineWidth: width,
    }));
  };

  // 그리기 시작 함수 - 터치 & 마우스 지원
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault(); // 모바일에서 스크롤 방지

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 상태 저장 (undo를 위해)
    saveCanvasState();

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // 마우스/터치 좌표 가져오기
    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // 그리기 상태 업데이트
    setDrawingState({
      ...drawingState,
      isDrawing: true,
      lastPoint: { x, y },
    });

    // 점 찍기 (마우스 다운만 하고 움직이지 않을 경우를 위해)
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      // 라인 스타일 적용
      ctx.strokeStyle = isEraser ? "#FFFFFF" : drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // 점을 찍을 때 펜 크기에 맞게 원 그리기
      ctx.arc(x, y, drawingState.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 그리기 진행 함수 - 터치 & 마우스 지원
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawingState.isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // 마우스/터치 좌표 가져오기
    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    // 마지막 지점에서 현재 지점까지 선 그리기
    if (drawingState.lastPoint) {
      ctx.beginPath();
      // 라인 스타일 적용
      ctx.strokeStyle = isEraser ? "#FFFFFF" : drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(drawingState.lastPoint.x, drawingState.lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 현재 위치 업데이트
    setDrawingState({
      ...drawingState,
      lastPoint: { x, y },
    });
  };

  // 그리기 종료 함수
  const stopDrawing = () => {
    setDrawingState({
      ...drawingState,
      isDrawing: false,
      lastPoint: null,
    });
  };

  // 지우개 모드 토글
  const toggleEraser = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 지우개 모드 토글
    const newIsEraser = !isEraser;
    setIsEraser(newIsEraser);

    if (newIsEraser) {
      // 지우개 모드 활성화
      ctx.strokeStyle = "#FFFFFF"; // 흰색으로 덮어쓰기
      ctx.lineWidth = 20; // 지우개는 더 두껍게
    } else {
      // 펜 모드로 돌아가기
      ctx.strokeStyle = drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
    }
  };

  // 캔버스 지우기
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 현재 상태 저장 (undo를 위해)
    saveCanvasState();

    // 캔버스 비우기
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
                  {/* 펜/지우개 모드 전환 버튼 */}
                  <Button
                    variant={isEraser ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setIsEraser(false);
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      ctx.strokeStyle = drawingState.color;
                      ctx.lineWidth = drawingState.lineWidth;
                    }}
                    className={!isEraser ? "bg-purple-100" : ""}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={isEraser ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsEraser(true);
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      ctx.strokeStyle = "#FFFFFF";
                      ctx.lineWidth = 20;
                    }}
                    className={isEraser ? "bg-purple-100" : ""}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>

                  {/* 펜 모드일 때만 색상 선택기 */}
                  {!isEraser && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 flex items-center justify-center"
                          style={{
                            backgroundColor: drawingState.color,
                            borderColor: "rgb(216, 180, 254)",
                          }}
                        >
                          <Circle
                            className="h-4 w-4"
                            style={{ color: "white" }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="grid grid-cols-4 gap-2">
                          {availableColors.map((color) => (
                            <Button
                              key={color}
                              variant="outline"
                              className="w-10 h-10 p-0 rounded-full"
                              style={{
                                backgroundColor: color,
                                borderColor:
                                  color === drawingState.color
                                    ? "black"
                                    : "transparent",
                                borderWidth:
                                  color === drawingState.color ? "2px" : "0",
                              }}
                              onClick={() => changeColor(color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* 굵기 조절은 항상 노출 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        <span className="text-xs">
                          {drawingState.lineWidth}px
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm">굵기 조절</span>
                        <Slider
                          defaultValue={[drawingState.lineWidth]}
                          min={1}
                          max={isEraser ? 40 : 20}
                          step={1}
                          onValueChange={(value) => changeLineWidth(value[0])}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="border border-purple-100 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[300px] bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
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
