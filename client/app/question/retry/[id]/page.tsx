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
  eraserWidth: number; // 지우개 두께 추가
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
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastPoint: null,
    color: "#000000",
    lineWidth: 2,
    eraserWidth: 10, // 기본 지우개 두께
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

  // Canvas 크기 초기화 및 설정 (페이지 로드 시 한 번만 실행)
  useEffect(() => {
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvasContainerRef.current;
      if (!container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      // 캔버스 물리적 크기 설정 (픽셀 밀도 고려)
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      // 캔버스 CSS 크기 설정
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // 컨텍스트 스케일 조정
      ctx.scale(dpr, dpr);

      // 기본 그리기 스타일 설정
      ctx.strokeStyle = drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fillStyle = drawingState.color;
    };

    // 컴포넌트 마운트 후 약간의 지연을 두고 초기화 (레이아웃이 완전히 계산된 후)
    const timer = setTimeout(() => {
      initializeCanvas();
    }, 100);

    // 윈도우 리사이즈 이벤트 리스너
    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 그리기 상태 변경 시 캔버스 컨텍스트 업데이트
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = isEraser ? "#FFFFFF" : drawingState.color;
    // 지우개 모드이면 지우개 두께 사용, 아니면 펜 두께 사용
    ctx.lineWidth = isEraser
      ? drawingState.eraserWidth
      : drawingState.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = isEraser ? "#FFFFFF" : drawingState.color;
  }, [
    drawingState.color,
    drawingState.lineWidth,
    drawingState.eraserWidth,
    isEraser,
  ]);

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
    setIsEraser(false);
    setDrawingState((prev) => ({
      ...prev,
      color: color,
    }));
  };

  // 펜 두께 변경 함수
  const changeLineWidth = (width: number) => {
    // 현재 모드에 따라 펜 두께 또는 지우개 두께를 변경
    if (isEraser) {
      setDrawingState((prev) => ({
        ...prev,
        eraserWidth: width,
      }));
    } else {
      setDrawingState((prev) => ({
        ...prev,
        lineWidth: width,
      }));
    }
  };

  // 좌표 변환 함수 - 캔버스 크기에 맞게 조정
  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return { x, y };
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

    // 마우스/터치 좌표 가져오기
    let clientX, clientY;
    if ("touches" in e) {
      // 터치 이벤트
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 마우스 이벤트
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { x, y } = getCanvasCoordinates(clientX, clientY);

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
      const currentWidth = isEraser
        ? drawingState.eraserWidth
        : drawingState.lineWidth;
      ctx.arc(x, y, currentWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 그리기 진행 함수 - 터치 & 마우스 지원
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawingState.isDrawing || !drawingState.lastPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 마우스/터치 좌표 가져오기
    let clientX, clientY;
    if ("touches" in e) {
      // 터치 이벤트
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 마우스 이벤트
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { x, y } = getCanvasCoordinates(clientX, clientY);

    // 마지막 지점에서 현재 지점까지 선 그리기
    ctx.beginPath();
    ctx.moveTo(drawingState.lastPoint.x, drawingState.lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

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
    setIsEraser(!isEraser);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <div className="flex-1 p-8">
        <Button
          variant="outline"
          onClick={handleBackToList}
          className="flex items-center gap-2 mb-4 bg-white/80 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로 돌아가기</span>
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 w-2/5">
            <CardHeader className="bg-purple-50/60 border-b-0 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-purple-700 font-extrabold">
                  문제 다시 풀기
                </CardTitle>
                <div className="flex gap-2">
                  {question.retryQuestionSubConceptDtos.map((concept) => (
                    <Badge
                      key={concept.subConceptId}
                      variant="secondary"
                      className="bg-purple-400 text-white font-bold rounded-full px-3 py-1"
                    >
                      {concept.subConceptType}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-7 space-y-4">
              {/* 문제 내용 */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-purple-700">문제</div>
                <p className="text-gray-700">{question.questionText}</p>
                {question.questionImg && (
                  <img
                    src={question.questionImg}
                    alt="문제 이미지"
                    className="mt-4 max-w-full rounded-xl border border-purple-200 shadow-md"
                  />
                )}
              </div>

              {/* 해설 표시 */}
              <div className="flex justify-between items-center mt-50 pt-20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-purple-600 hover:text-purple-700 rounded-xl font-bold"
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
                        className="text-purple-600 hover:text-purple-700 rounded-xl font-bold"
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
                        className="text-purple-600 hover:text-purple-700 rounded-xl font-bold"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
              </div>

              {showSolution &&
                question.retryQuestionSolutionDtos.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-md">
                    <h3 className="font-bold text-purple-700 mb-3">해설</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="font-bold text-purple-600">
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

          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 w-3/5">
            <CardHeader className="bg-purple-50/60 border-b-0 rounded-t-2xl">
              <CardTitle className="text-purple-700 font-extrabold">
                풀이 과정
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {/* 색상 선택기 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 flex items-center justify-center"
                        style={{
                          backgroundColor: isEraser
                            ? "white"
                            : drawingState.color,
                          borderColor: "rgb(216, 180, 254)",
                        }}
                      >
                        <Circle
                          className="h-4 w-4"
                          style={{
                            color: isEraser ? drawingState.color : "white",
                          }}
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      {!isEraser && (
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
                      )}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            {isEraser ? "지우개 두께" : "펜 두께"}
                          </span>
                          <span className="text-sm">
                            {isEraser
                              ? drawingState.eraserWidth
                              : drawingState.lineWidth}
                            px
                          </span>
                        </div>
                        <Slider
                          defaultValue={[
                            isEraser
                              ? drawingState.eraserWidth
                              : drawingState.lineWidth,
                          ]}
                          min={isEraser ? 5 : 1}
                          max={isEraser ? 50 : 20}
                          step={1}
                          value={[
                            isEraser
                              ? drawingState.eraserWidth
                              : drawingState.lineWidth,
                          ]}
                          onValueChange={(value) => changeLineWidth(value[0])}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleEraser}
                    className={isEraser ? "bg-purple-100" : ""}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>

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
              <div
                ref={canvasContainerRef}
                className="border border-purple-100 rounded-lg overflow-auto"
                style={{
                  maxHeight: "300px", // 세로 최대 높이 제한
                  maxWidth: "100%", // 가로 너비는 부모 요소 너비까지만 (스크롤 활성화 위해)
                  position: "relative",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="touch-none bg-white"
                  style={{
                    width: "1000px", // 가로 스크롤을 위해 넓은 너비 설정 (원하는 크기로 조정 가능)
                    height: "600px", // 세로 스크롤을 위해 높은 높이 설정 (원하는 크기로 조정 가능)
                    minWidth: "100%", // 최소 너비는 컨테이너 너비만큼
                    minHeight: "300px", // 최소 높이는 컨테이너 높이만큼
                  }}
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
                <span className="font-bold text-purple-700">답:</span>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="답을 입력하세요"
                  className="max-w-[200px] border-purple-100 focus-visible:ring-purple-500"
                />
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 rounded-xl font-bold"
                  onClick={handleSubmitAnswer}
                >
                  제출
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
