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
import { authApi } from "@/lib/api";
import { Toaster } from "@/components/ui/toaster";

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
  eraserWidth: number;
  answerCanvas: HTMLCanvasElement | null;
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
    eraserWidth: 10,
    answerCanvas: null,
  });
  const [isEraser, setIsEraser] = useState(false);
  const answerCanvasRef = useRef<HTMLCanvasElement>(null);
  const answerCanvasContainerRef = useRef<HTMLDivElement>(null);

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
  const [canvasText, setCanvasText] = useState(""); // 변환된 텍스트
  const [inputText, setInputText] = useState(""); // input에 표시될 값
  const [isChecking, setIsChecking] = useState(false);
  const [loadingType, setLoadingType] = useState<null | "text" | "submit">(
    null
  );

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get<Question>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/question/${numericQuestionId}/retry`
        );
        console.log(response.data);
        setQuestion(response.data);
      } catch (error) {
        console.error("문제 불러오기 실패:", error);
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

      // 컨포넌트 스케일 조정
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

    // 현재 상태 출력 (디버깅용)
    console.log("Drawing state updated:", {
      isEraser,
      lineWidth: drawingState.lineWidth,
      eraserWidth: drawingState.eraserWidth,
    });

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

    const targetCanvas = e.currentTarget;
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 상태 저장 (undo를 위해)
    if (targetCanvas === canvasRef.current) {
      saveCanvasState();
    }

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

    const rect = targetCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 그리기 상태 업데이트
    setDrawingState({
      ...drawingState,
      isDrawing: true,
      lastPoint: { x, y },
    });

    // 점 찍기 (마우스 다운만 하고 움직이지 않을 경우를 위해)
    ctx.beginPath();
    const currentWidth = isEraser
      ? drawingState.eraserWidth
      : drawingState.lineWidth;

    ctx.strokeStyle = isEraser ? "#FFFFFF" : drawingState.color;
    ctx.lineWidth = currentWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = isEraser ? "#FFFFFF" : drawingState.color;

    ctx.arc(x, y, currentWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  // 그리기 진행 함수 - 터치 & 마우스 지원
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawingState.isDrawing || !drawingState.lastPoint) return;

    const targetCanvas = e.currentTarget;
    const ctx = targetCanvas.getContext("2d");
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

    const rect = targetCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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

  // 답변 캔버스 초기화
  useEffect(() => {
    const initializeAnswerCanvas = () => {
      const canvas = answerCanvasRef.current;
      if (!canvas) return;

      const container = answerCanvasContainerRef.current;
      if (!container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
      ctx.strokeStyle = drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fillStyle = drawingState.color;

      setDrawingState((prev) => ({
        ...prev,
        answerCanvas: canvas,
      }));
    };

    const timer = setTimeout(() => {
      initializeAnswerCanvas();
    }, 100);

    const handleResize = () => {
      initializeAnswerCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmitAnswer = async () => {
    const canvas = answerCanvasRef.current;
    if (!canvas) return;

    // 캔버스 내용을 이미지로 변환
    const imageData = canvas.toDataURL("image/png");
    console.log(imageData);
    // base64 데이터 분리
    const base64Data = imageData.split(",")[1]; // 실제 base64 데이터만 추출
    console.log(base64Data);

    try {
      // 서버로 답변 전송
      const response = await authApi.patch(
        `/api/v1/question/${numericQuestionId}/answer`,
        {
          answerImg: base64Data,
          imageType: "image/png", // 이미지 타입 정보도 함께 전송
        }
      );

      // 답변 저장
      setSubmittedAnswer(imageData);

      // 정답 여부에 따른 토스트 메시지 표시
      const isCorrect = (response as any).correct;
      console.log(isCorrect);
      toast({
        title: isCorrect ? "정답입니다!" : "오답입니다",
        description: isCorrect
          ? "정답을 맞추셨습니다."
          : "다시 한번 생각해보세요.",
        variant: isCorrect ? "default" : "destructive",
        duration: 1000,
      });
    } catch (error) {
      console.error("답변 제출 실패:", error);
      toast({
        title: "답변 제출 실패",
        description: "답변을 제출하는 중 오류가 발생했습니다.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  // 답안 이미지를 텍스트로 변환하는 함수
  const handleImageToText = async () => {
    const canvas = answerCanvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL("image/png");
    const base64Data = imageData.split(",")[1];
    setIsChecking(true);
    setLoadingType("text");
    try {
      const response = await authApi.post(
        `/api/v1/question/${numericQuestionId}/text`,
        { answerImg: base64Data, imageType: "image/png" }
      );
      const text = response as any;
      console.log("text:", text);
      setCanvasText(text);
      setInputText(text);
      toast({
        title: "텍스트 변환 성공",
        description: "이미지에서 텍스트를 추출했습니다.",
        variant: "default",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "텍스트 변환 실패",
        description: "이미지에서 텍스트 추출에 실패했습니다.",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsChecking(false);
      setLoadingType(null);
    }
  };

  // 텍스트 정답 제출 및 정답 확인 함수
  const handleTextSubmit = async () => {
    setIsChecking(true);
    setLoadingType("submit");
    const canvas = answerCanvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL("image/png");
    const base64Data = imageData.split(",")[1];
    try {
      const response = await authApi.patch(
        `/api/v1/question/${numericQuestionId}/answer`,
        { answerText: inputText, answerImg: base64Data, imageType: "image/png" }
      );
      const isCorrect =
        (response as any).isCorrect ?? (response as any).correct;
      toast({
        title: isCorrect ? "정답입니다!" : "오답입니다",
        description: isCorrect
          ? "정답을 맞추셨습니다."
          : "다시 한번 생각해보세요.",
        variant: isCorrect ? "default" : "destructive",
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: "정답 제출 실패",
        description: "정답을 제출하는 중 오류가 발생했습니다.",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsChecking(false);
      setLoadingType(null);
    }
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
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <Card className="border-0 shadow-xl rounded-2xl bg-white dark:bg-gray-800 w-2/5">
              <div className="flex flex-col space-y-1.5 p-6 bg-blue-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
                <div className="text-2xl font-semibold leading-none tracking-tight flex justify-between items-center text-blue-700 dark:text-blue-300">
                  <span>문제 다시 풀기</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-blue-50/60 dark:bg-gray-800/60 border-t border-blue-100 dark:border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {question.retryQuestionSubConceptDtos.map((concept) => (
                    <Badge
                      key={concept.subConceptId}
                      variant="secondary"
                      className="bg-purple-400 dark:bg-purple-600 text-white font-bold rounded-lg px-3 py-1 hover:bg-purple-400 dark:hover:bg-purple-600"
                    >
                      {concept.subConceptType}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="pt-8 space-y-6">
                {/* 문제 내용 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg text-purple-700 dark:text-purple-300">
                    문제
                  </div>
                  <p className="text-gray-700 dark:text-gray-100">
                    {question.questionText}
                  </p>
                  {question.questionImg && (
                    <img
                      src={question.questionImg}
                      alt="문제 이미지"
                      className="mt-4 max-w-full rounded-xl border border-purple-200 dark:border-purple-700 shadow-md"
                    />
                  )}
                </div>

                {/* 해설 표시 */}
                <div className="flex justify-between items-center mt-50 pt-20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl font-bold border-purple-200 dark:border-purple-700"
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
                          className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl font-bold border-purple-200 dark:border-purple-700"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
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
                          className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl font-bold border-purple-200 dark:border-purple-700"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                </div>

                {showSolution &&
                  question.retryQuestionSolutionDtos.length > 0 && (
                    <div className="mt-6 p-4 bg-purple-50 dark:bg-gray-800/50 border border-purple-100 dark:border-gray-700 rounded-md">
                      <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-3">
                        해설
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="font-bold text-purple-600 dark:text-purple-400">
                            Step {currentStep + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-100">
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

            <Card className="border-0 shadow-xl rounded-2xl bg-white dark:bg-gray-800 w-3/5">
              <div className="flex flex-col space-y-1.5 p-6 bg-blue-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
                <div className="text-2xl font-semibold leading-none tracking-tight flex justify-between items-center text-blue-700 dark:text-blue-300">
                  <span>풀이 과정</span>
                </div>
              </div>
              <CardContent className="pt-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {/* 색상 및 펜 두께 선택기 */}
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
                          onClick={(e) => {
                            e.preventDefault(); // 팝오버가 바로 닫히는 것 방지
                            if (isEraser) {
                              // 지우개 모드에서 펜 모드로 전환
                              console.log("Switching to pen mode");
                              setIsEraser(false);
                            }
                          }}
                        >
                          <Pen
                            className="h-4 w-4"
                            style={{
                              color: isEraser ? drawingState.color : "white",
                            }}
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
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">펜 두께</span>
                            <span className="text-sm">
                              {drawingState.lineWidth}px
                            </span>
                          </div>
                          <Slider
                            defaultValue={[drawingState.lineWidth]}
                            min={1}
                            max={20}
                            step={1}
                            value={[drawingState.lineWidth]}
                            onValueChange={(value) => {
                              console.log("Changing pen width to:", value[0]);
                              setDrawingState((prev) => ({
                                ...prev,
                                lineWidth: value[0],
                              }));
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* 지우개 두께 선택기 - 새로 추가 */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault(); // 팝오버가 바로 닫히는 것 방지
                            if (!isEraser) {
                              // 펜 모드에서 지우개 모드로 전환
                              console.log("Switching to eraser mode");
                              setIsEraser(true);
                            }
                          }}
                          className={isEraser ? "bg-purple-100" : ""}
                        >
                          <Eraser className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">지우개 두께</span>
                            <span className="text-sm">
                              {drawingState.eraserWidth}px
                            </span>
                          </div>
                          <Slider
                            defaultValue={[drawingState.eraserWidth]}
                            min={5}
                            max={50}
                            step={1}
                            value={[drawingState.eraserWidth]}
                            onValueChange={(value) => {
                              console.log(
                                "Changing eraser width to:",
                                value[0]
                              );
                              setDrawingState((prev) => ({
                                ...prev,
                                eraserWidth: value[0],
                              }));
                            }}
                          />
                          <div className="mt-3 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEraser(false)}
                              className="text-xs"
                            >
                              펜 모드로 전환
                            </Button>
                          </div>
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

                  {/* 빠른 굵기 조절 */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {isEraser ? "지우개" : "펜"} 굵기:
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 py-0 text-xs"
                        onClick={() => {
                          if (isEraser) {
                            const newWidth = Math.max(
                              5,
                              drawingState.eraserWidth - 5
                            );
                            setDrawingState((prev) => ({
                              ...prev,
                              eraserWidth: newWidth,
                            }));
                          } else {
                            const newWidth = Math.max(
                              1,
                              drawingState.lineWidth - 1
                            );
                            setDrawingState((prev) => ({
                              ...prev,
                              lineWidth: newWidth,
                            }));
                          }
                        }}
                      >
                        -
                      </Button>
                      <span className="text-xs min-w-[30px] text-center">
                        {isEraser
                          ? drawingState.eraserWidth
                          : drawingState.lineWidth}
                        px
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 py-0 text-xs"
                        onClick={() => {
                          if (isEraser) {
                            const newWidth = Math.min(
                              50,
                              drawingState.eraserWidth + 5
                            );
                            setDrawingState((prev) => ({
                              ...prev,
                              eraserWidth: newWidth,
                            }));
                          } else {
                            const newWidth = Math.min(
                              20,
                              drawingState.lineWidth + 1
                            );
                            setDrawingState((prev) => ({
                              ...prev,
                              lineWidth: newWidth,
                            }));
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
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
                  <span className="font-bold text-purple-900 dark:text-purple-300">
                    답:
                  </span>
                  <div
                    ref={answerCanvasContainerRef}
                    className="border border-purple-100 dark:border-purple-700 rounded-lg overflow-hidden"
                    style={{
                      width: "300px",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    <canvas
                      ref={answerCanvasRef}
                      className="touch-none bg-white"
                      style={{
                        width: "100%",
                        height: "100%",
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
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl font-bold"
                      onClick={() => {
                        const canvas = answerCanvasRef.current;
                        if (!canvas) return;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold"
                      onClick={handleImageToText}
                    >
                      텍스트 변환
                    </Button>
                  </div>
                </div>
                {/* 변환된 텍스트 input 및 제출 UI */}
                {(canvasText || isChecking) && (
                  <div className="mt-4 relative min-h-[60px]">
                    {/* 텍스트 변환 중일 때 위에 프로그레스 바 */}
                    {isChecking && loadingType === "text" && (
                      <div className="absolute top-0 left-0 w-full h-1 z-10">
                        <ProgressBar />
                      </div>
                    )}
                    {canvasText && (
                      <>
                        <label className="block mb-1 font-bold">
                          정답(수정 가능):
                        </label>
                        <Input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                        <Button
                          className="mt-2 px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                          onClick={handleTextSubmit}
                          disabled={isChecking}
                        >
                          정답 제출
                        </Button>
                        {/* 정답 제출 중일 때 아래에 프로그레스 바 */}
                        {isChecking && loadingType === "submit" && (
                          <div className="w-full mt-2">
                            <ProgressBar />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 12);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-1 bg-blue-100 rounded">
      <div
        className="h-1 bg-blue-500 rounded transition-all duration-75"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
