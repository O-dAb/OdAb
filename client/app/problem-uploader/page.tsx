"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  FileText,
  Upload,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { authApi } from "@/lib/api";
import Image from "next/image";

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
  const [problemData, setProblemData] = useState<ProblemApiResponse | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [userSolution, setUserSolution] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showProblemSolver, setShowProblemSolver] = useState(false);
  const [showExplanationCard, setShowExplanationCard] = useState(false); // 해설 카드 표시 여부

  // 문제 텍스트 수정용 상태 추가
  const [editableQuestionText, setEditableQuestionText] = useState("");
  const [isSearching, setIsSearching] = useState(false); // 유사 문제 검색 중 상태
  const [isModifying, setIsModifying] = useState(false); // 문제 수정 중 상태 추가

  // 문제 수정 설명용 상태 추가
  const [modificationExplanation, setModificationExplanation] = useState("");

  // 비디오 참조 추가
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  // Textarea 높이 자동 조절을 위한 ref 추가
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const modificationTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Textarea 높이 자동 조절 함수
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

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

        // API 요청 보내기 (authApi는 response.data를 직접 반환)
        const response = (await authApi.post<ProblemApiResponse>(
          "/api/claude/text",
          formData,
          {
            timeout: 900000,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )) as unknown as ProblemApiResponse;

        // 응답 데이터 처리 (authApi는 이미 data를 반환)
        const {
          questionText,
          answer,
          imageUrl,
          questionSolution,
          subConcepts,
        } = response;

        // 문제 데이터 설정
        setProblemData(response);
        // 문제 텍스트 수정용 상태도 초기화
        setEditableQuestionText(response.questionText);
        
        // 해설 카드는 표시하지 않음 (유사 문제 검색 후에만 표시)
        setShowExplanationCard(false);

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
    const isAnswerCorrect =
      userAnswer.trim().replace(/\s+/g, "") ===
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
    setShowExplanationCard(false); // 해설 카드 숨김
    setProblemData(null);
    setUserAnswer("");
    setUserSolution("");
    setSubmittedAnswer("");
    setIsCorrect(null);
    setShowSolution(false);
    setCurrentStep(0);
    setPreviewImage(null);
    setSelectedFile(null);
    // editableQuestionText도 초기화
    setEditableQuestionText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearchSimilar = async () => {
    if (!editableQuestionText.trim()) {
      toast({
        title: "문제 텍스트를 입력해주세요.",
        description: "수정된 문제 내용이 비어있습니다.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedFile) {
      toast({
        title: "이미지 파일이 없습니다.",
        description: "원본 이미지 파일이 선택되지 않았습니다. 다시 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.append("userAsk", editableQuestionText);
      formData.append("imageData", selectedFile, "math_problem.png");

      // API 요청 (두 번째 API endpoint /api/claude 사용)
      const response = (await authApi.post<ProblemApiResponse>(
        "/api/claude", 
        formData,
        {
          timeout: 900000, // 15분 타임아웃
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )) as unknown as ProblemApiResponse;

      // 새로운 문제 데이터로 상태 업데이트
      setProblemData(response);
      setEditableQuestionText(response.questionText); // 응답받은 문제 텍스트로 다시 업데이트

      // 관련 상태 초기화 (예: 해설 닫기, 첫 단계로)
      setCurrentStep(0);
      setUserAnswer("");
      setSubmittedAnswer("");
      setIsCorrect(null);
      
      // 검색 후 해설 자동으로 표시 및 해설 카드 표시
      setShowSolution(true);
      setShowExplanationCard(true);

      toast({
        title: "유사 문제 검색 완료",
        description: "새로운 문제와 해설이 준비되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("유사 문제 검색 API 요청 오류:", error);
      toast({
        title: "유사 문제 검색 실패",
        description: "서버 연결에 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleModifyProblem = async () => {
    if (!editableQuestionText.trim()) {
      toast({
        title: "문제 텍스트를 입력해주세요.",
        description: "수정할 문제 내용이 비어있습니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!modificationExplanation.trim()) {
      toast({
        title: "수정 설명을 입력해주세요.",
        description: "고쳐야 할 부분에 대한 설명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsModifying(true);
    try {
      // API 요청 준비
      const requestData = {
        problem: editableQuestionText,
        userAsk: modificationExplanation
      };

      // API 요청
      const response = await authApi.post<{ problem: string }>(
        "/api/claude/fix", 
        requestData,
        {
          timeout: 900000, // 15분 타임아웃
        }
      );

      // 디버깅용 로그 추가
      console.log("API 응답 데이터:", response);
      
      // 응답 처리 (authApi는 response.data를 직접 반환함)
      // 응답이 직접 객체이거나 응답.data가 존재할 수 있음
      const responseData = response;
      
      if (responseData) {
        // 응답이 객체고 problem 속성이 있는 경우
        if (typeof responseData === 'object' && 'problem' in responseData && typeof responseData.problem === 'string') {
          setEditableQuestionText(responseData.problem);
          toast({
            title: "문제 수정 완료",
            description: "문제가 수정되었습니다.",
            variant: "default",
          });
        } 
        // 응답이 문자열인 경우
        else if (typeof responseData === 'string') {
          setEditableQuestionText(responseData);
          toast({
            title: "문제 수정 완료",
            description: "문제가 수정되었습니다.",
            variant: "default",
          });
        } 
        else {
          console.error("알 수 없는 응답 형식:", responseData);
          throw new Error("응답 데이터 형식이 올바르지 않습니다.");
        }
      } else {
        throw new Error("API 응답이 비어있습니다.");
      }
    } catch (error) {
      console.error("문제 수정 API 요청 오류:", error);
      toast({
        title: "문제 수정 실패",
        description: "서버 연결에 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsModifying(false);
    }
  };

  // 문제 텍스트 변경 핸들러
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableQuestionText(e.target.value);
    // 높이 자동 조절
    adjustTextareaHeight(questionTextareaRef.current);
  };

  // 수정 설명 텍스트 변경 핸들러
  const handleModificationExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModificationExplanation(e.target.value);
    // 높이 자동 조절
    adjustTextareaHeight(modificationTextareaRef.current);
  };

  // 컴포넌트 마운트 시 초기 높이 설정을 위한 useEffect 추가
  useEffect(() => {
    adjustTextareaHeight(questionTextareaRef.current);
    adjustTextareaHeight(modificationTextareaRef.current);
  }, [problemData]); // problemData가 변경될 때만 실행

  // API 요청 상태 변경 시 비디오 재생/정지 처리
  useEffect(() => {
    // 첫 번째 비디오 처리
    const video = videoRef.current;
    if (video) {
      if (isUploading || isSearching || isModifying) {
        video.currentTime = 0;
        video.play().catch(err => console.error('비디오 재생 오류:', err));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
    
    // 두 번째 비디오 처리
    const video2 = videoRef2.current;
    if (video2) {
      if (isUploading || isSearching || isModifying) {
        video2.currentTime = 0;
        video2.play().catch(err => console.error('비디오 재생 오류:', err));
      } else {
        video2.pause();
        video2.currentTime = 0;
      }
    }
  }, [isUploading, isSearching, isModifying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center py-10">
      {!showProblemSolver ? (
        // 문제 업로드 화면
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
          {/* 왼쪽: 문제 업로드 카드 */}
          <Card className="w-full max-w-lg border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
            <CardHeader className="bg-blue-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
                <FileText className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                <span>문제 업로드</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col gap-6">
                {/* 이미지 업로드 */}
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
                  className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-6 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors shadow"
                >
                  <FileText className="h-10 w-10 text-purple-400 dark:text-purple-300 mb-2" />
                  <span className="text-base font-semibold dark:text-gray-200">이미지 업로드</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">클릭하여 파일 선택</span>
                </label>
                {/* 카메라 촬영 */}

              </div>

              {previewImage && (
                <div className="space-y-2 mt-8">
                  <div className="text-sm font-medium dark:text-gray-300">선택한 이미지</div>
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="문제 이미지"
                      className="w-full h-auto max-h-[300px] object-contain border rounded-xl shadow dark:border-gray-700"
                    />
                    <Button
                      className="mt-4 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 w-full rounded-xl font-bold"
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
              <CardFooter className="pb-6">
                <div className="w-full">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-sm text-center mt-2 dark:text-gray-300">문제 인식 중...</p>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* 오른쪽: 수달 이미지와 말풍선 멘트 */}
          <div className="w-full max-w-lg flex flex-col items-center justify-center">
            {/* 말풍선 */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 md:-right-10 md:left-auto md:translate-x-0 z-10">
              <div className="relative inline-block">
                {/* <span className="px-6 py-3 bg-white rounded-2xl shadow text-brown-700 font-bold text-lg border border-brown-200 text-center block">
                  수달이: 사진이나 텍스트로 문제를 올려보세요!
                </span> */}
                {/* 말꼬리 */}
                <span className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <video
                ref={videoRef2}
                className="w-auto h-auto max-w-[400px] max-h-[400px]"
                muted
                playsInline
                loop
              >
                <source src="/pencil.webm" type="video/webm" />
                비디오를 재생할 수 없습니다
              </video>
            </div>
          </div>
        </div>
      ) : (
        // 문제 풀이 화면
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
          {/* 왼쪽: 문제 카드 영역 */}
          <div className="w-full max-w-lg">
            <Button
              variant="outline"
              onClick={handleBackToUploader}
              className="mb-6 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>새 문제 업로드하기</span>
            </Button>

            {/* 문제 카드 */}
            <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              <CardHeader className="bg-blue-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
                    <FileText className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    <span>문제</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    {problemData?.subConcepts?.map((concept, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-400 dark:bg-purple-600 text-white font-bold rounded-full px-3 py-1"
                      >
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-7 space-y-4">
                {/* 문제 이미지 표시 추가 */}
                {(previewImage || problemData?.imageUrl) && (
                  <div className="mb-4">
                    <img
                      src={problemData?.imageUrl || previewImage || ""}
                      alt="문제 이미지"
                      className="w-full h-auto max-h-[300px] object-contain border rounded-xl shadow mx-auto dark:border-gray-700"
                    />
                  </div>
                )}
                
                {/* 문제 내용 수정 가능하도록 Textarea로 변경 */}
                <div className="space-y-4">
                  <Textarea
                    ref={questionTextareaRef}
                    value={editableQuestionText}
                    onChange={handleQuestionTextChange}
                    className="w-full min-h-[100px] text-gray-700 dark:text-gray-200 p-3 border border-purple-200 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 focus:border-purple-400 dark:focus:border-purple-500 bg-white/90 dark:bg-gray-800/90 shadow-sm resize-none overflow-hidden"
                    placeholder="문제 텍스트를 확인하고 수정할 수 있습니다."
                  />
                  
                  <Textarea
                    ref={modificationTextareaRef}
                    value={modificationExplanation}
                    onChange={handleModificationExplanationChange}
                    className="w-full min-h-[80px] text-gray-700 dark:text-gray-200 p-3 border border-purple-200 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 focus:border-purple-400 dark:focus:border-purple-500 bg-white/90 dark:bg-gray-800/90 shadow-sm mt-3 resize-none overflow-hidden"
                    placeholder="고쳐야 할 부분 설명해 주세요"
                  />
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition-colors duration-150 ease-in-out shadow hover:shadow-md"
                      onClick={handleSearchSimilar}
                      disabled={isSearching || !selectedFile}
                    >
                      {isSearching ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          검색 중...
                        </>
                      ) : (
                        "오케이"
                      )}
                    </Button>
                    
                    <Button
                      className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-lg py-3 transition-colors duration-150 ease-in-out shadow hover:shadow-md"
                      onClick={handleModifyProblem}
                      disabled={isModifying}
                    >
                      {isModifying ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          수정 중...
                        </>
                      ) : (
                        "문제 수정"
                      )}
                    </Button>
                  </div>
                </div>

                {/* 정답 표시 */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700 rounded-lg">
                  <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">정답</h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {problemData?.answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 수달 이미지 또는 해설 카드 */}
          <div className="w-full max-w-lg mt-10 md:mt-0">
            {/* 유사 문제 검색 전에는 수달 이미지 표시 */}
            {!showExplanationCard && (
              <div className="w-full max-w-lg flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <video
                    ref={videoRef2}
                    className="w-auto h-auto max-w-[400px] max-h-[400px]"
                    muted
                    playsInline
                    loop
                  >
                    <source src="/pencil.webm" type="video/webm" />
                    비디오를 재생할 수 없습니다
                  </video>
                </div>
              </div>
            )}

            {/* 유사 문제 검색 후에는 해설 카드 표시 */}
            {showExplanationCard && (
              <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full">
                <CardHeader className="bg-blue-50/60 dark:bg-gray-700/60 border-b-0 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
                      <FileText className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                      <span>해설</span>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 rounded-xl font-bold"
                    >
                      {showSolution ? "해설 닫기" : "해설 보기"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {showSolution ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-blue-700 dark:text-blue-300">
                            {currentStep + 1}단계 /{" "}
                            {problemData?.questionSolution?.length}단계
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentStep((prev) => Math.max(0, prev - 1))
                              }
                              disabled={currentStep === 0}
                              className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 rounded-xl font-bold"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentStep((prev) =>
                                  Math.min(
                                    (problemData?.questionSolution?.length || 1) -
                                      1,
                                    prev + 1
                                  )
                                )
                              }
                              disabled={
                                currentStep ===
                                (problemData?.questionSolution?.length || 1) - 1
                              }
                              className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 rounded-xl font-bold"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* 전체/단계별 해설 탭 */}
                        <Tabs defaultValue="step-by-step" className="mt-4">
                          <TabsList className="bg-blue-100 dark:bg-gray-700 mb-4">
                            <TabsTrigger
                              value="step-by-step"
                              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                            >
                              단계별 보기
                            </TabsTrigger>
                            <TabsTrigger
                              value="all-steps"
                              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
                            >
                              전체 보기
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="step-by-step">
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4">
                              <p className="text-gray-700 dark:text-gray-200">
                                {problemData?.questionSolution?.[currentStep]}
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="all-steps">
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 space-y-4">
                              {problemData?.questionSolution?.map(
                                (step, index) => (
                                  <div
                                    key={index}
                                    className="border-b border-blue-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
                                  >
                                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      단계 {index + 1}
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-200">{step}</p>
                                  </div>
                                )
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        해설을 보려면 "해설 보기" 버튼을 클릭하세요.
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                        먼저 문제를 풀어보는 것을 추천합니다!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}