"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, FileText, Upload, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

// API 응답 타입 정의
interface ProblemApiResponse {
  questionText: string;
  answer: string;
  imageUrl: string;
  questionSolution: string[];
  subConcepts: string[];
}

export default function ProblemUploaderPage() {
  const [manualInput, setManualInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // 문제 풀이 관련 상태
  const [problemData, setProblemData] = useState<ProblemApiResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userSolution, setUserSolution] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showProblemSolver, setShowProblemSolver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "지원하지 않는 파일 형식",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      toast({
        title: "문제 인식 결과",
        description: manualInput,
        variant: "default",
      });
    }
  };

  const handleImageSubmit = async () => {
    if (selectedFile) {
      setIsUploading(true);
      
      try {
        // FormData 객체 생성
        const formData = new FormData();
        formData.append("imageData", selectedFile, "math_problem.png");
        
        // API 요청 보내기
        const response = await axios.post<ProblemApiResponse>(
          "http://localhost:8080/api/claude",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        // 응답 데이터 처리
        const { questionText, answer, imageUrl, questionSolution, subConcepts } = response.data;
        
        // 문제 데이터 설정
        setProblemData(response.data);
        
        // 성공 메시지 표시
        toast({
          title: "문제 분석 완료",
          description: "문제와 해설이 준비되었습니다.",
          variant: "default",
        });
        
        // 문제 풀이 화면 표시
        setShowProblemSolver(true);
        
      } catch (error) {
        console.error("API 요청 오류:", error);
        
        toast({
          title: "문제 분석 실패",
          description: "서버 연결에 문제가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
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
    
    // 정답 비교 (공백 제거 후 비교)
    const isAnswerCorrect = userAnswer.trim().replace(/\s+/g, "") === 
      problemData?.answer.trim().replace(/\s+/g, "");
    
    setIsCorrect(isAnswerCorrect);

    toast({
      title: isAnswerCorrect ? "정답입니다!" : "오답입니다",
      description: isAnswerCorrect
        ? "정답을 맞추셨습니다."
        : `정답은 ${problemData?.answer}입니다. 다시 한번 생각해보세요.`,
      variant: isAnswerCorrect ? "default" : "destructive",
    });
  };

  const handleBackToUploader = () => {
    setShowProblemSolver(false);
    setProblemData(null);
    setUserAnswer("");
    setUserSolution("");
    setSubmittedAnswer("");
    setIsCorrect(null);
    setShowSolution(false);
    setCurrentStep(0);
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
      {!showProblemSolver ? (
        // 문제 업로드 화면
        <>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🦦</span>
            <span className="px-4 py-2 bg-white/80 rounded-full shadow text-brown-700 font-bold text-lg border border-brown-200 animate-bounce">
              수달이: 사진이나 텍스트로 문제를 올려보세요!
            </span>
          </div>
          <Card className="w-full max-w-7xl border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
            <CardHeader className="bg-blue-50/60 border-b-0 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <FileText className="h-6 w-6 text-purple-500" />
                <span>문제 업로드</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-6 h-full cursor-pointer hover:bg-purple-50 transition-colors shadow"
                  >
                    <FileText className="h-10 w-10 text-purple-400 mb-2" />
                    <span className="text-base font-semibold">이미지 업로드</span>
                    <span className="text-xs text-gray-500 mt-1">
                      클릭하여 파일 선택
                    </span>
                  </label>
                </div>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center py-6 rounded-xl bg-blue-100 hover:bg-blue-200 border-blue-200 shadow"
                  onClick={handleCameraCapture}
                >
                  <Camera className="h-10 w-10 text-blue-400 mb-2" />
                  <span className="text-base font-semibold">카메라로 촬영</span>
                  <span className="text-xs text-gray-500 mt-1">
                    클릭하여 촬영 시작
                  </span>
                </Button>
              </div>

              {previewImage && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">선택한 이미지</div>
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="문제 이미지"
                      className="w-full h-auto max-h-[300px] object-contain border rounded-xl shadow"
                    />
                    <Button
                      className="mt-2 bg-purple-500 hover:bg-purple-600 w-full rounded-xl font-bold"
                      onClick={handleImageSubmit}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 분석하기
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            {isUploading && (
              <CardFooter>
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-sm text-center mt-2">문제 인식 중...</p>
                </div>
              </CardFooter>
            )}
          </Card>
        </>
      ) : (
        // 문제 풀이 화면
        <div className="w-full max-w-7xl">
          <Button
            variant="outline"
            onClick={handleBackToUploader}
            className="mb-6 flex items-center gap-2 bg-white/80 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>새 문제 업로드하기</span>
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 문제 카드 - 왼쪽 */}
            <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
              <CardHeader className="bg-purple-50/60 border-b-0 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-purple-700 font-extrabold">
                    문제
                  </CardTitle>
                  <div className="flex gap-2">
                    {problemData?.subConcepts.map((concept, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-400 text-white font-bold rounded-full px-3 py-1"
                      >
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-7 space-y-4">
                {/* 문제 내용 */}
                <div className="space-y-4">
                  <p className="text-gray-700">{problemData?.questionText}</p>
                </div>

                {/* 정답 표시 */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-bold text-blue-700 mb-2">정답</h3>
                  <p className="text-gray-700 font-medium">{problemData?.answer}</p>
                </div>
              </CardContent>
            </Card>

            {/* 해설 카드 - 오른쪽 */}
            <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
              <CardHeader className="bg-blue-50/60 border-b-0 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-blue-700 font-extrabold">
                    해설
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-blue-600 hover:text-blue-700 rounded-xl font-bold"
                  >
                    {showSolution ? "해설 닫기" : "해설 보기"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {showSolution ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-blue-700">
                          {currentStep + 1}단계 / {problemData?.questionSolution.length}단계
                        </h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className="text-blue-600 hover:text-blue-700 rounded-xl font-bold"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep((prev) => 
                              Math.min((problemData?.questionSolution.length || 1) - 1, prev + 1)
                            )}
                            disabled={currentStep === (problemData?.questionSolution.length || 1) - 1}
                            className="text-blue-600 hover:text-blue-700 rounded-xl font-bold"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 전체/단계별 해설 탭 */}
                      <Tabs defaultValue="step-by-step" className="mt-4">
                        <TabsList className="bg-blue-100 mb-4">
                          <TabsTrigger 
                            value="step-by-step"
                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                          >
                            단계별 보기
                          </TabsTrigger>
                          <TabsTrigger 
                            value="all-steps"
                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                          >
                            전체 보기
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="step-by-step">
                          <div className="bg-white/70 rounded-lg p-4">
                            <p className="text-gray-700">{problemData?.questionSolution[currentStep]}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="all-steps">
                          <div className="bg-white/70 rounded-lg p-4 space-y-4">
                            {problemData?.questionSolution.map((step, index) => (
                              <div key={index} className="border-b border-blue-200 pb-3 last:border-b-0 last:pb-0">
                                <h4 className="font-medium text-blue-700 mb-1">단계 {index + 1}</h4>
                                <p className="text-gray-700">{step}</p>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 text-center">
                      해설을 보려면 "해설 보기" 버튼을 클릭하세요.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      먼저 문제를 풀어보는 것을 추천합니다!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
