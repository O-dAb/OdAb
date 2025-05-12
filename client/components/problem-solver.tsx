"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, BookOpen, Eye, ArrowRight, ThumbsUp, ThumbsDown, HelpCircle, CheckCircle, AlertCircle, Search, Star } from "lucide-react"
import { ProblemUploader } from "@/components/problem-uploader"
import type { EducationLevel, Grade } from "@/components/profile/user-profile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { InlineMath, BlockMath } from "react-katex"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ClipLoader } from 'react-spinners'

// MathRenderer 컴포넌트 - 수학 표현식을 적절하게 렌더링
function MathRenderer({ math, isBlock = false }: { math: string; isBlock?: boolean }) {
  try {
    return isBlock ? <BlockMath math={math} /> : <InlineMath math={math} />
  } catch (error) {
    console.error("Math rendering error:", error)
    return <span className="text-red-500">{math}</span>
  }
}

// 수학 내용이 포함된 텍스트를 파싱하여 렌더링하는 컴포넌트
function MathText({ text }: { text: string }) {
  if (!text) return null;
  // $로 둘러싸인 수식을 찾아 렌더링
  const parts = text.split(/(\$.*?\$)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // $ 기호 제거 후 수식 렌더링
          const mathContent = part.slice(1, -1)
          return <MathRenderer key={index} math={mathContent} />
        }
        // 일반 텍스트는 줄바꿈도 <br />로 변환
        return part.split(/\n|\r\n?/g).map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))
      })}
    </>
  )
}

/**
 * 문제 풀이 컴포넌트
 * 학생이 수학 문제를 업로드하고 풀이할 수 있는 기능 제공
 */
interface ProblemSolverProps {
  educationLevel: EducationLevel
  grade: Grade
}

// API 응답 타입 정의
interface UploadResponse {
  problem_id: string
  detected_text: string
  latex?: string
  problem_type?: string
  image_url?: string
}

interface SolveResponse {
  problem_id: string
  problem_text: string
  solution_steps: string[]
  final_answer: string
  confidence: number
  related_concepts?: string[]
  elapsed_time?: number
  similar_problems_found?: number
  detected_concepts?: string[]
}

interface SimilarProblem {
  id: string
  problem_text: string
  problem_type: string
  solution_summary: string
  concepts: string[]
  similarity: number
}

// 문제 해결 단계 타입 정의
interface StepInfo {
  content: string;
  keyPoints?: string[];
  formulas?: string[];
}

export function ProblemSolver({ educationLevel, grade }: ProblemSolverProps) {
  // 상태 관리
  const [problemText, setProblemText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [problemId, setProblemId] = useState<string | null>(null)
  const [problemType, setProblemType] = useState("")
  const [solutionSteps, setSolutionSteps] = useState<string[]>([])
  const [formattedSteps, setFormattedSteps] = useState<StepInfo[]>([])
  const [finalAnswer, setFinalAnswer] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [userAnswer, setUserAnswer] = useState("")
  const [isInputMode, setIsInputMode] = useState(false)
  const [viewMode, setViewMode] = useState<"step" | "all">("step")
  const [userSolution, setUserSolution] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCorrectingText, setIsCorrectingText] = useState(false)
  const [similarProblems, setSimilarProblems] = useState<SimilarProblem[]>([])
  const [detectedConcepts, setDetectedConcepts] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [userFeedback, setUserFeedback] = useState("")
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [feedbackResult, setFeedbackResult] = useState("")
  const [originalText, setOriginalText] = useState("")
  const [feedbackHistory, setFeedbackHistory] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]);
  const handleReveal = (idx: number) => {
    setRevealedSteps(prev => prev.includes(idx) ? prev : [...prev, idx]);
  };

  // 솔루션 스텝을 구조화된 형식으로 변환
  useEffect(() => {
    if (solutionSteps.length > 0) {
      const steps: StepInfo[] = solutionSteps.map(step => {
        // 기본적인 형식의 스텝 생성
        return {
          content: step,
          // 핵심 개념과 공식을 추출하는 로직 (실제로는 백엔드에서 받아오는 것이 좋음)
          keyPoints: extractKeyPoints(step),
          formulas: extractFormulas(step)
        };
      });
      setFormattedSteps(steps);
    }
  }, [solutionSteps]);

  // 문자열에서 핵심 개념을 추출하는 함수 (간단한 구현)
  const extractKeyPoints = (text: string): string[] => {
    // 여기서는 간단하게 구현, 실제로는 더 정교한 분석 필요
    const keywords = ["함수", "적분", "미분", "방정식", "인수분해", "공식", "삼각함수", "좌표", "벡터"];
    return keywords.filter(word => text.includes(word));
  };

  // 문자열에서 수식을 추출하는 함수
  const extractFormulas = (text: string): string[] => {
    // '$' 기호로 둘러싸인 수식 찾기
    const matches = text.match(/\$(.*?)\$/g) || [];
    return matches;
  };

  // 사용자가 문제 인식 텍스트를 수정할 수 있도록 하는 함수
  const handleTextCorrection = () => {
    setIsCorrectingText(true)
    setCorrectedText(problemText)
  }

  // 수정된 텍스트로 문제 해결
  const handleSolveWithCorrectedText = async () => {
    if (!problemId || !correctedText) {
      toast({
        title: "오류",
        description: "문제 ID 또는 수정된 텍스트가 없습니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post<SolveResponse>("http://localhost:8000/api/math/solve-problem", {
        problem_id: problemId,
        detected_text: problemText,
        corrected_text: correctedText,
        problem_type: problemType || "OTHER"
      })

      // 응답 데이터 처리
      setSolutionSteps(response.data.solution_steps)
      setFinalAnswer(response.data.final_answer)
      setConfidence(response.data.confidence)
      setDetectedConcepts(response.data.detected_concepts || [])
      
      // 유사 문제 검색 (추가적인 API 호출)
      try {
        const similarResponse = await axios.get<SimilarProblem[]>("http://localhost:8000/api/math/similar-problems", {
          params: {
            query: correctedText,
            problem_type: problemType,
            top_k: 3
          }
        })
        setSimilarProblems(similarResponse.data)
      } catch (error) {
        console.error("유사 문제 검색 오류:", error)
        setSimilarProblems([])
      }

      setIsCorrectingText(false)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
      setViewMode("step")
      
      toast({
        title: "문제 해결 완료",
        description: "단계별 풀이가 준비되었습니다.",
      })
    } catch (error) {
      console.error("문제 해결 오류:", error)
      toast({
        title: "문제 해결 오류",
        description: "서버에서 문제를 해결하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 이미지 업로드 후 OCR 결과 처리
  const handleProblemRecognized = async (text: string, imageFile?: File) => {
    if (!imageFile) {
      setProblemText(text)
      setCorrectedText(text)
      setOriginalText(text)
      setImageUrl(null)
      return
    }

    setIsLoading(true)
    try {
      // 이미지 파일 업로드를 위한 FormData 생성
      const formData = new FormData()
      formData.append("file", imageFile)
      if (problemType) {
        formData.append("problem_type", problemType)
      }

      // 이미지 업로드 API 호출
      const response = await axios.post<UploadResponse>(
        "http://localhost:8000/api/math/upload-problem", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      // 인식된 텍스트 설정
      setProblemText(response.data.detected_text)
      setCorrectedText(response.data.detected_text)
      setOriginalText(response.data.detected_text)
      setProblemId(response.data.problem_id)
      setProblemType(response.data.problem_type || "")
      // 이미지 URL 저장 (서버에서 반환하도록 수정 필요)
      if (response.data.image_url) {
        setImageUrl(response.data.image_url)
      } else {
        setImageUrl(null)
      }

      // 기본적으로 문제+정답구하기 화면이 보이도록
      setIsCorrectingText(false)
      setFeedbackHistory([])
      
      toast({
        title: "이미지 인식 완료",
        description: "인식된 텍스트를 확인하고 필요시 수정해주세요.",
      })
    } catch (error) {
      console.error("이미지 처리 오류:", error)
      toast({
        title: "이미지 처리 오류",
        description: "이미지에서 텍스트를 인식하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    if (isInputMode) {
      // 사용자 입력 모드인 경우, 답변 확인 후 다음 단계로
      // 간단한 정답 체크 (실제로는 더 복잡한 로직 필요)
      const isCorrect = userAnswer.trim().length > 0

      if (isCorrect) {
        toast({
          title: "정답입니다!",
          description: "다음 단계로 진행합니다.",
        })
      } else {
        toast({
          title: "다시 한번 생각해보세요",
          description: "힌트를 참고하여 다시 시도해보세요.",
          variant: "destructive",
        })
        return
      }
    }

    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setUserAnswer("")
      setIsInputMode(false)
    }
  }

  const handleShowAllSteps = () => {
    setShowAllSteps(true)
    setViewMode("all")
  }

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade)
  }

  const toggleInputMode = () => {
    setIsInputMode(!isInputMode)
  }

  const handleViewModeChange = (mode: "step" | "all") => {
    setViewMode(mode)
    if (mode === "all") {
      setShowAllSteps(true)
    } else {
      setShowAllSteps(false)
    }
  }

  // 피드백 제공 함수
  const provideFeedback = async (rating: number, feedbackText?: string) => {
    if (!problemId) return
    
    try {
      await axios.post("http://localhost:8000/api/math/feedback", {
        problem_id: problemId,
        rating,
        feedback_text: feedbackText
      })
      
      toast({
        title: "피드백 전송 완료",
        description: "풀이에 대한 피드백을 보내주셔서 감사합니다.",
      })
    } catch (error) {
      console.error("피드백 전송 오류:", error)
      toast({
        title: "피드백 전송 오류",
        description: "피드백을 전송하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleNaturalFeedbackSubmit = async () => {
    if (!problemId || !userFeedback.trim()) return

    setIsFeedbackLoading(true)
    setFeedbackError(null)
    setFeedbackResult("")

    try {
      const response = await axios.post("http://localhost:8000/api/math/natural-feedback", {
        problem_id: problemId,
        original_text: originalText,
        current_text: correctedText,
        feedback_history: feedbackHistory,
        new_feedback: userFeedback,
        image_url: imageUrl
      })

      setFeedbackResult(response.data.problem_text)
      setIsCorrectingText(false)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
      setViewMode("step")
      setFeedbackHistory(prev => [...prev, userFeedback])
      setCorrectedText(response.data.problem_text)
      setUserFeedback("")
      
      toast({
        title: "피드백 전송 완료",
        description: "피드백이 반영되었습니다.",
      })
    } catch (error) {
      console.error("피드백 전송 오류:", error)
      setFeedbackError("피드백을 전송하는 중 오류가 발생했습니다.")
    } finally {
      setIsFeedbackLoading(false)
    }
  }

  const handleAcceptFeedbackResult = () => {
    setCorrectedText(feedbackResult)
    setIsCorrectingText(false)
    setCurrentStep(0)
    setShowAllSteps(false)
    setIsInputMode(false)
    setViewMode("step")
    setFeedbackResult("")
  }

  const handleRetrySolution = async () => {
    // 기존 풀이 상태 초기화
    setSolutionSteps([])
    setFormattedSteps([])
    setFinalAnswer("")
    setCurrentStep(0)
    setShowAllSteps(false)
    setIsInputMode(false)
    setViewMode("step")
    setConfidence(0)
    setDetectedConcepts([])
    setSimilarProblems([])
    setIsLoading(true)
    try {
      // 마지막 userFeedback 또는 새 피드백으로 재풀이 요청
      await handleNaturalFeedbackSubmit()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompactFeedback = async () => {
    if (!problemId || !originalText || !finalAnswer) return;
    try {
      await axios.post("http://localhost:8000/api/math/compact-feedback", {
        problem_id: problemId,
        original_text: originalText,
        image_url: imageUrl,
        final_answer: finalAnswer
      });
      toast({
        title: "정답이 저장되었습니다!",
        description: "AI의 풀이가 벡터DB에 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "저장 오류",
        description: "정답 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  }

  // 로딩 메시지 분기
  let loadingMessage = "AI가 문제를 푸는 중입니다...";
  if (isLoading && !problemText) {
    loadingMessage = "AI가 문제를 인식하고 있는 중입니다...";
  } else if (isFeedbackLoading) {
    loadingMessage = "AI가 문제를 수정하고 있는 중입니다...";
  }

  return (
    <div className="space-y-6">
      {/* 상단 필터 영역 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Select value={selectedGrade} onValueChange={handleGradeChange}>
              <SelectTrigger className="w-[100px] bg-blue-50 border-blue-200">
                <SelectValue placeholder="학년 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      {/* 문제 업로드/개념 선택 탭 */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-yellow-100">
          <TabsTrigger
            value="upload"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
          >
            <Upload className="h-4 w-4" />
            <span>문제 업로드</span>
          </TabsTrigger>
          <TabsTrigger
            value="concepts"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span>개념 선택</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <ProblemUploader onProblemRecognized={handleProblemRecognized} />
        </TabsContent>

        <TabsContent value="concepts" className="mt-0">
          <Card className="border-yellow-200">
            <CardHeader className="bg-yellow-50 border-b border-yellow-200">
              <CardTitle>수학 개념 선택</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {detectedConcepts.length > 0 ? (
                  detectedConcepts.map((concept) => (
                  <Button
                      key={concept}
                      variant={problemType === concept ? "default" : "outline"}
                    className={`h-auto py-3 ${
                        problemType === concept
                        ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                        : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    }`}
                      onClick={() => setProblemType(concept)}
                  >
                      {concept}
                  </Button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-gray-500">
                    문제를 업로드하면 관련 개념이 여기에 표시됩니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 문제 표시 영역 */}
      {problemText && !isCorrectingText && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle>문제</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 text-lg font-medium">
              <MathText text={correctedText} />
            </div>
            {problemType && (
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <div>
                  문제 유형: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-1">{problemType}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTextCorrection}
                  className="border-blue-200 text-blue-600"
                >
                  문제 텍스트 수정
                </Button>
              </div>
            )}
            {/* 정답 구하기 버튼을 문제 아래에 항상 노출 */}
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSolveWithCorrectedText} 
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? "처리중..." : "정답 구하기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 문제 인식 결과 수정 모드 */}
      {isCorrectingText && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle>인식된 문제 확인</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">인식된 텍스트:</label>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-base mb-2">
                  <MathText text={correctedText} />
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                * 인식 결과가 잘못되었나요? 아래에서 수정 요청을 해주세요.<br />
                예시: "AB가 아니라 AC가 4cm입니다.", "각 B가 아니라 각 C가 30도입니다.", "BC=5cm로 바꿔주세요."
              </div>
              <div className="flex gap-2 items-end">
                <Textarea
                  value={userFeedback}
                  onChange={e => setUserFeedback(e.target.value)}
                  className="min-h-[40px] bg-white border-blue-200 flex-1"
                  placeholder="자연어로 수정 요청을 입력하세요."
                />
                <Button
                  className="bg-blue-400 hover:bg-blue-500 whitespace-nowrap"
                  onClick={handleNaturalFeedbackSubmit}
                  disabled={isLoading || !userFeedback.trim()}
                >
                  수정 요청
                </Button>
              </div>
              {isFeedbackLoading && (
                <div className="text-blue-500 text-sm mt-2">AI가 문제를 수정 중입니다...</div>
              )}
              {feedbackError && (
                <div className="text-red-500 text-sm mt-2">{feedbackError}</div>
              )}
              {feedbackResult && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                  <div className="font-semibold mb-1">수정된 결과:</div>
                  <div className="mb-2"><MathText text={feedbackResult} /></div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleAcceptFeedbackResult()}>이대로 진행</Button>
                    <Button size="sm" variant="outline" className="border-green-200 text-green-700" onClick={() => setFeedbackResult('')}>다시 수정 요청</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCorrectingText(false)}
              className="border-blue-200"
            >
              취소
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* 해설 영역 */}
      {finalAnswer && !isCorrectingText && (
        <Card className="border-green-100 bg-green-50/50">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-2xl font-bold text-green-900">해설</CardTitle>
            <div className="flex gap-2 mt-2 justify-end">
              {/* 단계별/한번에 보기 토글 등 추가 가능 */}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {(() => {
              let stepsJson: any[] | null = null;
              try {
                let answerStr = finalAnswer;
                if (typeof answerStr !== "string") {
                  answerStr = JSON.stringify(answerStr);
                }
                // 코드블록(````json ... ````) 제거
                answerStr = answerStr.replace(/```json[\s\S]*?```/gi, (block) => {
                  const match = block.match(/\[[\s\S]*\]/);
                  return match ? match[0] : '';
                });
                // 코드블록(```` ... ````) 제거 (일반)
                answerStr = answerStr.replace(/```[\s\S]*?```/g, (block) => {
                  const match = block.match(/\[[\s\S]*\]/);
                  return match ? match[0] : '';
                });
                // 앞뒤 설명/마크다운 제거, JSON 배열만 추출
                const jsonMatch = answerStr.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                  stepsJson = JSON.parse(jsonMatch[0]);
                }
              } catch (e) {
                console.error("최종 해설 JSON 파싱 오류:", e, finalAnswer);
                stepsJson = null;
              }
              if (!stepsJson) {
                return <div className="text-red-500">AI 해설 파싱에 실패했습니다. 관리자에게 문의해 주세요.</div>;
              }
              if (stepsJson && Array.isArray(stepsJson)) {
                return (
                  <div className="space-y-4">
                    {stepsJson.map((step, i) => {
                      const isFinal = i === stepsJson.length - 1;
                      const cardBorder = isFinal ? "border-green-200" : "border-green-200";
                      const cardBg = "bg-white";
                      const icon = isFinal ? <Star className="text-yellow-500" /> : i === 0 ? <Search className="text-green-500" /> : <BookOpen className="text-green-400" />;
                      const isRevealed = revealedSteps.includes(i);
                      return (
                        <div
                          key={i}
                          className={`flex flex-col ${cardBg} ${cardBorder} border rounded-xl p-6 shadow-md mb-4 transition-all cursor-pointer ${!isRevealed ? 'blur-sm relative' : ''}`}
                          onClick={() => !isRevealed && handleReveal(i)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {icon}
                            <span className={`font-bold text-lg ${isFinal ? "text-yellow-700" : "text-green-700"}`}>{i + 1}단계: {step.title}</span>
                          </div>
                          {isRevealed ? (
                            <>
                              <div className="text-base text-gray-900 mb-2">
                                <MathText text={step.content} />
                              </div>
                              {step.hint && (
                                <details className="mt-2">
                                  <summary className="text-green-600 cursor-pointer select-none">힌트 보기</summary>
                                  <div className="text-sm text-green-700 border-l-2 border-green-200 pl-3 mt-1">
                                    <MathText text={step.hint} />
                                  </div>
                                </details>
                              )}
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-gray-400 text-base font-semibold">클릭하여 {i + 1}단계 확인</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }
            })()}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCompactFeedback}
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              <ThumbsUp className="h-4 w-4 mr-1" /> 도움됨
            </Button>
            <Button
              variant="outline"
              onClick={handleRetrySolution}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <HelpCircle className="h-4 w-4 mr-1" /> 다시 풀이하기
            </Button>
          </CardFooter>
        </Card>
      )}

      {(isLoading || isFeedbackLoading) && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/60 z-50">
          <ClipLoader color="#36d7b7" size={60} />
          <div className="mt-4 text-lg font-semibold text-blue-500">
            {loadingMessage}
          </div>
        </div>
      )}
    </div>
  )
}
