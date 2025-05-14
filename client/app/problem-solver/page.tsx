"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

// API 응답 타입 정의
interface ProblemApiResponse {
  questionText: string;
  answer: string;
  imageUrl: string;
  questionSolution: string[];
  subConcepts: string[];
}

export default function ProblemSolverPage() {
  const [problemData, setProblemData] = useState<ProblemApiResponse | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userSolution, setUserSolution] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 문제 데이터 가져오기
    const storedData = localStorage.getItem("problemData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as ProblemApiResponse;
        setProblemData(parsedData);
      } catch (error) {
        console.error("데이터 파싱 오류:", error);
        toast({
          title: "문제 데이터 로드 실패",
          description: "문제 데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "문제 데이터 없음",
        description: "문제 데이터가 없습니다. 문제 업로드 페이지로 이동합니다.",
        variant: "destructive",
      });
      router.push("/problem-uploader");
    }
  }, [toast, router]);

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
    router.push("/problem-uploader");
  };

  if (!problemData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={handleBackToUploader}
          className="mb-6 flex items-center gap-2 bg-white/80 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>문제 업로드로 돌아가기</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 문제 카드 */}
          <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
            <CardHeader className="bg-purple-50/60 border-b-0 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-purple-700 font-extrabold">
                  문제
                </CardTitle>
                <div className="flex gap-2">
                  {problemData.subConcepts.map((concept, index) => (
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
                <p className="text-gray-700">{problemData.questionText}</p>
                {problemData.imageUrl && (
                  <img
                    src={problemData.imageUrl}
                    alt="문제 이미지"
                    className="mt-4 max-w-full rounded-xl border border-purple-200 shadow-md"
                  />
                )}
              </div>

              {/* 풀이 입력 */}
              <div className="mt-6 space-y-4">
                <div className="font-bold text-lg text-purple-700">풀이 과정</div>
                <Textarea
                  placeholder="여기에 풀이 과정을 작성하세요..."
                  className="min-h-[150px] bg-white border-purple-100 focus-visible:ring-purple-500"
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                />
              </div>

              {/* 답안 입력 */}
              <div className="flex items-center gap-2 mt-4">
                <span className="font-bold text-purple-700">답:</span>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="답을 입력하세요"
                  className="max-w-[200px] border-purple-100 focus-visible:ring-purple-500"
                />
                <Button
                  className="bg-purple-500 hover:bg-purple-600 rounded-xl font-bold"
                  onClick={handleSubmitAnswer}
                >
                  제출
                </Button>
              </div>

              {/* 제출 결과 */}
              {submittedAnswer && isCorrect !== null && (
                <div className={`mt-4 p-3 rounded-lg ${
                  isCorrect ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"
                }`}>
                  <p className="font-medium">
                    {isCorrect ? "정답입니다! 🎉" : `오답입니다. 정답은 ${problemData.answer}입니다.`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 해설 카드 */}
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
                  {/* 해설 단계별 표시 */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-blue-700">
                        {currentStep + 1}단계 / {problemData.questionSolution.length}단계
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
                            Math.min(problemData.questionSolution.length - 1, prev + 1)
                          )}
                          disabled={currentStep === problemData.questionSolution.length - 1}
                          className="text-blue-600 hover:text-blue-700 rounded-xl font-bold"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700">{problemData.questionSolution[currentStep]}</p>
                  </div>

                  {/* 전체 해설 보기 */}
                  <div className="mt-4">
                    <Tabs defaultValue="step-by-step">
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
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <p className="text-gray-700">{problemData.questionSolution[currentStep]}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="all-steps">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-4">
                          {problemData.questionSolution.map((step, index) => (
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
    </div>
  );
}
