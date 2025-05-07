"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, BookOpen, GraduationCap, ArrowRight, Eye, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react"
import { ProblemUploader } from "@/components/problem-uploader"
import type { EducationLevel, Grade } from "@/components/user-profile"
import { getCurriculumTopics, getAllCurriculumTopics } from "@/lib/curriculum-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface SequentialProblemSolverProps {
  educationLevel: EducationLevel
  grade: Grade
}

// 문제 해결 단계 타입 정의
interface SolutionStep {
  title: string
  content: string
  hint?: string
  userInput?: string
  isCorrect?: boolean
}

export function SequentialProblemSolver({ educationLevel, grade }: SequentialProblemSolverProps) {
  const [problemText, setProblemText] = useState("")
  const [problemType, setProblemType] = useState("")
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [showAllGrades, setShowAllGrades] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [userAnswer, setUserAnswer] = useState("")
  const [isInputMode, setIsInputMode] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const { toast } = useToast()

  // 교육과정에 맞는 주제 가져오기
  const topics = showAllGrades
    ? getAllCurriculumTopics(educationLevel)
    : getCurriculumTopics(educationLevel, selectedGrade)

  // 예시 문제 데이터
  const exampleProblems = {
    이차방정식: [
      {
        text: "다음 이차방정식을 풀어라: x² - 5x + 6 = 0",
        difficulty: "easy",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 이차방정식 x² - 5x + 6 = 0을 풀어 x의 값을 구하는 문제입니다.",
            hint: "이차방정식의 표준형은 ax² + bx + c = 0 입니다. 여기서 a = 1, b = -5, c = 6 입니다.",
          },
          {
            title: "해결 방법 선택하기",
            content: "이차방정식을 풀기 위한 여러 방법 중 인수분해를 사용해 보겠습니다.",
            hint: "인수분해는 (x-p)(x-q) = 0 형태로 만들어 x = p 또는 x = q 라는 해를 구하는 방법입니다.",
          },
          {
            title: "인수분해 적용하기",
            content: "x² - 5x + 6을 인수분해하면 (x-2)(x-3) = 0 입니다.",
            hint: "두 수 p, q가 있을 때, p + q = -b/a = 5, p × q = c/a = 6이 되어야 합니다. p = 2, q = 3이 조건을 만족합니다.",
          },
          {
            title: "해 구하기",
            content: "(x-2)(x-3) = 0이므로, x-2 = 0 또는 x-3 = 0입니다. 따라서 x = 2 또는 x = 3입니다.",
            hint: "인수가 0이 되는 경우를 각각 계산하면 됩니다.",
          },
          {
            title: "검산하기",
            content:
              "x = 2를 대입하면, 2² - 5×2 + 6 = 4 - 10 + 6 = 0 ✓\nx = 3을 대입하면, 3² - 5×3 + 6 = 9 - 15 + 6 = 0 ✓",
            hint: "구한 해를 원래 방정식에 대입하여 좌변이 0이 되는지 확인합니다.",
          },
        ],
      },
      {
        text: "다음 이차방정식을 풀어라: 2x² - 7x + 3 = 0",
        difficulty: "medium",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 이차방정식 2x² - 7x + 3 = 0을 풀어 x의 값을 구하는 문제입니다.",
            hint: "이차방정식의 표준형은 ax² + bx + c = 0 입니다. 여기서 a = 2, b = -7, c = 3 입니다.",
          },
          {
            title: "해결 방법 선택하기",
            content: "이 방정식은 인수분해가 쉽지 않아 보입니다. 근의 공식을 사용해 보겠습니다.",
            hint: "근의 공식은 x = (-b ± √(b² - 4ac)) / 2a 입니다.",
          },
          {
            title: "판별식 계산하기",
            content: "판별식 D = b² - 4ac = (-7)² - 4×2×3 = 49 - 24 = 25",
            hint: "판별식이 양수이므로 서로 다른 두 실근을 가집니다.",
          },
          {
            title: "근의 공식 적용하기",
            content: "x = (-b ± √D) / 2a = (7 ± √25) / 4 = (7 ± 5) / 4",
            hint: "√25 = 5 입니다.",
          },
          {
            title: "해 구하기",
            content: "x = (7 + 5) / 4 = 12 / 4 = 3 또는 x = (7 - 5) / 4 = 2 / 4 = 1/2",
            hint: "분수 형태의 답도 정확히 계산해야 합니다.",
          },
          {
            title: "검산하기",
            content:
              "x = 3을 대입: 2×3² - 7×3 + 3 = 2×9 - 21 + 3 = 18 - 21 + 3 = 0 ✓\nx = 1/2를 대입: 2×(1/2)² - 7×(1/2) + 3 = 2×(1/4) - 7/2 + 3 = 1/2 - 7/2 + 3 = 0 ✓",
            hint: "구한 해를 원래 방정식에 대입하여 좌변이 0이 되는지 확인합니다.",
          },
        ],
      },
    ],
    미분법: [
      {
        text: "함수 f(x) = x³ - 3x² + 2의 도함수를 구하시오.",
        difficulty: "medium",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 함수 f(x) = x³ - 3x² + 2의 도함수 f'(x)를 구하는 문제입니다.",
            hint: "도함수는 함수의 순간 변화율을 나타내며, 미분을 통해 구할 수 있습니다.",
          },
          {
            title: "미분 법칙 적용하기",
            content: "각 항을 개별적으로 미분한 후 더합니다. 다항함수의 미분 공식을 사용합니다.",
            hint: "x^n의 미분은 nx^(n-1)입니다. 상수항의 미분은 0입니다.",
          },
          {
            title: "x³ 항 미분하기",
            content: "x³의 미분은 3x²입니다.",
            hint: "x^n → nx^(n-1) 공식 적용: x³ → 3x²",
          },
          {
            title: "-3x² 항 미분하기",
            content: "-3x²의 미분은 -3 × 2x = -6x입니다.",
            hint: "-3x^2 → -3 × 2x^1 = -6x",
          },
          {
            title: "상수항 미분하기",
            content: "상수항 2의 미분은 0입니다.",
            hint: "상수의 미분은 항상 0입니다.",
          },
          {
            title: "결과 정리하기",
            content: "따라서 f'(x) = 3x² - 6x + 0 = 3x² - 6x 입니다.",
            hint: "각 항의 미분 결과를 모두 더합니다.",
          },
        ],
      },
    ],
    적분법: [
      {
        text: "∫(2x + 3)dx를 계산하시오.",
        difficulty: "easy",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 함수 2x + 3의 부정적분 ∫(2x + 3)dx를 구하는 문제입니다.",
            hint: "부정적분은 미분의 역과정으로, 주어진 함수를 미분하면 원래 함수가 나오는 함수를 찾는 것입니다.",
          },
          {
            title: "적분 법칙 적용하기",
            content: "각 항을 개별적으로 적분한 후 더합니다. 다항함수의 적분 공식을 사용합니다.",
            hint: "∫x^n dx = x^(n+1)/(n+1) + C (단, n ≠ -1). 상수항 a의 적분은 ax + C입니다.",
          },
          {
            title: "2x 항 적분하기",
            content: "∫2x dx = 2∫x dx = 2(x²/2) = x²",
            hint: "∫x dx = x²/2 공식 적용",
          },
          {
            title: "3 항 적분하기",
            content: "∫3 dx = 3x",
            hint: "∫a dx = ax 공식 적용",
          },
          {
            title: "결과 정리하기",
            content: "따라서 ∫(2x + 3)dx = x² + 3x + C 입니다. (C는 적분상수)",
            hint: "각 항의 적분 결과를 모두 더하고, 적분상수 C를 추가합니다.",
          },
        ],
      },
    ],
    삼각함수: [
      {
        text: "sin²θ + cos²θ = 1임을 증명하시오.",
        difficulty: "medium",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 삼각함수의 기본 항등식 sin²θ + cos²θ = 1을 증명하는 문제입니다.",
            hint: "삼각함수의 기본 정의와 피타고라스 정리를 활용할 수 있습니다.",
          },
          {
            title: "접근 방법 선택하기",
            content: "단위원(반지름이 1인 원)에서 삼각함수의 정의를 활용하여 증명해 보겠습니다.",
            hint: "단위원에서 점 (cosθ, sinθ)는 원 위의 점입니다.",
          },
          {
            title: "단위원 적용하기",
            content: "단위원에서 점 (x, y) = (cosθ, sinθ)는 원 위의 점입니다. 단위원의 방정식은 x² + y² = 1입니다.",
            hint: "단위원은 원점을 중심으로 하고 반지름이 1인 원입니다.",
          },
          {
            title: "대입하기",
            content: "x = cosθ, y = sinθ를 단위원 방정식 x² + y² = 1에 대입하면, cos²θ + sin²θ = 1이 됩니다.",
            hint: "단위원 위의 모든 점은 x² + y² = 1을 만족합니다.",
          },
          {
            title: "결론 도출하기",
            content: "따라서 sin²θ + cos²θ = 1이 증명되었습니다.",
            hint: "이 항등식은 삼각함수의 가장 기본적인 성질 중 하나입니다.",
          },
        ],
      },
    ],
  }

  const handleProblemRecognized = (text: string) => {
    setProblemText(text)

    // 문제 유형 결정 (실제로는 AI 분석 등을 통해 결정)
    const detectedType = "이차방정식" // 예시로 고정
    setProblemType(detectedType)

    // 해당 유형의 예시 문제 중에서 선택
    const problemsOfType = exampleProblems[detectedType as keyof typeof exampleProblems] || []
    const selectedProblem = problemsOfType.find((p) => p.difficulty === difficulty) || problemsOfType[0]

    if (selectedProblem) {
      setSolutionSteps(selectedProblem.steps)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
    } else {
      // 예시 문제가 없는 경우 기본 단계 생성
      const defaultSteps: SolutionStep[] = [
        {
          title: "문제 이해하기",
          content: `이 문제는 ${detectedType} 유형의 문제입니다. 주어진 조건을 분석해 봅시다.`,
          hint: "문제에서 주어진 정보를 정리해보세요.",
        },
        {
          title: "해결 방법 선택하기",
          content: `${detectedType} 문제를 해결하기 위한 적절한 방법을 선택합니다.`,
          hint: "이 유형의 문제에 적용할 수 있는 공식이나 접근법을 생각해보세요.",
        },
        {
          title: "단계적 해결",
          content: "선택한 방법을 단계적으로 적용합니다.",
          hint: "한 단계씩 차근차근 계산해보세요.",
        },
        {
          title: "정답 도출하기",
          content: "계산 결과를 정리하여 최종 답을 구합니다.",
          hint: "구한 결과가 문제의 요구사항을 만족하는지 확인하세요.",
        },
        {
          title: "검산하기",
          content: "구한 답이 맞는지 검산해봅니다.",
          hint: "구한 답을 원래 문제에 대입하여 확인해보세요.",
        },
      ]
      setSolutionSteps(defaultSteps)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
    }
  }

  const handleNextStep = () => {
    if (isInputMode) {
      // 사용자 입력 모드인 경우, 답변 확인 후 다음 단계로
      const currentStepData = { ...solutionSteps[currentStep] }
      currentStepData.userInput = userAnswer

      // 간단한 정답 체크 (실제로는 더 복잡한 로직 필요)
      const isCorrect = userAnswer.trim().length > 0
      currentStepData.isCorrect = isCorrect

      const updatedSteps = [...solutionSteps]
      updatedSteps[currentStep] = currentStepData
      setSolutionSteps(updatedSteps)

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
  }

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade)
  }

  const handleTopicSelect = (topic: string) => {
    setProblemType(topic)

    // 선택한 주제에 맞는 예시 문제 가져오기
    const problemsOfType = exampleProblems[topic as keyof typeof exampleProblems]
    if (problemsOfType && problemsOfType.length > 0) {
      const selectedProblem = problemsOfType.find((p) => p.difficulty === difficulty) || problemsOfType[0]
      setProblemText(selectedProblem.text)
      setSolutionSteps(selectedProblem.steps)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
    } else {
      setProblemText("")
      setSolutionSteps([])
    }
  }

  const toggleInputMode = () => {
    setIsInputMode(!isInputMode)
  }

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as "easy" | "medium" | "hard")

    // 난이도 변경 시 현재 주제에 맞는 문제 다시 로드
    if (problemType) {
      const problemsOfType = exampleProblems[problemType as keyof typeof exampleProblems]
      if (problemsOfType && problemsOfType.length > 0) {
        const selectedProblem = problemsOfType.find((p) => p.difficulty === value) || problemsOfType[0]
        setProblemText(selectedProblem.text)
        setSolutionSteps(selectedProblem.steps)
        setCurrentStep(0)
        setShowAllSteps(false)
        setIsInputMode(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="난이도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">쉬움</SelectItem>
              <SelectItem value="medium">보통</SelectItem>
              <SelectItem value="hard">어려움</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAllGrades ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllGrades(true)}
            className="flex items-center gap-1"
          >
            <GraduationCap className="h-4 w-4" />
            <span>전체 학년</span>
          </Button>
          {!showAllGrades && (
            <Select value={selectedGrade} onValueChange={handleGradeChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="학년 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showAllGrades && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAllGrades(false)
                setSelectedGrade(grade)
              }}
            >
              내 학년으로
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>문제 업로드</span>
          </TabsTrigger>
          <TabsTrigger value="concepts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>개념 선택</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <ProblemUploader onProblemRecognized={handleProblemRecognized} />
        </TabsContent>

        <TabsContent value="concepts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>수학 개념 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={problemType === topic ? "default" : "outline"}
                    className="h-auto py-3"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {problemText && (
        <Card>
          <CardHeader>
            <CardTitle>문제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md">{problemText}</div>
            {problemType && (
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <div>
                  문제 유형: <span className="font-medium">{problemType}</span>
                </div>
                <Badge
                  variant={difficulty === "easy" ? "outline" : difficulty === "medium" ? "secondary" : "destructive"}
                >
                  {difficulty === "easy" ? "쉬움" : difficulty === "medium" ? "보통" : "어려움"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {solutionSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>단계별 풀이</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleInputMode} disabled={showAllSteps}>
                  {isInputMode ? "힌트 보기" : "직접 풀어보기"}
                </Button>
                {!showAllSteps && (
                  <Button variant="outline" size="sm" onClick={handleShowAllSteps} className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>모든 단계 보기</span>
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {showAllSteps
                ? solutionSteps.map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <div className="font-medium text-sm text-purple-700 mb-1">
                        {index + 1}단계: {step.title}
                      </div>
                      <div>{step.content}</div>
                      {step.hint && (
                        <div className="mt-2 text-sm text-gray-600 border-l-2 border-purple-300 pl-3">
                          <span className="font-medium">힌트:</span> {step.hint}
                        </div>
                      )}
                      {step.userInput && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                          <div className="text-sm font-medium">내 답변:</div>
                          <div className="flex items-center gap-2">
                            {step.userInput}
                            {step.isCorrect !== undefined &&
                              (step.isCorrect ? (
                                <ThumbsUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <ThumbsDown className="h-4 w-4 text-red-500" />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                : solutionSteps.slice(0, currentStep + 1).map((step, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <div className="font-medium text-sm text-purple-700 mb-1">
                        {index + 1}단계: {step.title}
                      </div>
                      {index < currentStep || !isInputMode ? (
                        <>
                          <div>{step.content}</div>
                          {!isInputMode && step.hint && (
                            <div className="mt-2 text-sm text-gray-600 border-l-2 border-purple-300 pl-3">
                              <span className="font-medium">힌트:</span> {step.hint}
                            </div>
                          )}
                          {step.userInput && (
                            <div className="mt-2 p-2 bg-gray-100 rounded">
                              <div className="text-sm font-medium">내 답변:</div>
                              <div className="flex items-center gap-2">
                                {step.userInput}
                                {step.isCorrect !== undefined &&
                                  (step.isCorrect ? (
                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <ThumbsDown className="h-4 w-4 text-red-500" />
                                  ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updatedSteps = [...solutionSteps]
                                updatedSteps[index].hint = step.hint
                                setSolutionSteps(updatedSteps)
                              }}
                              className="flex items-center gap-1"
                            >
                              <HelpCircle className="h-4 w-4" />
                              <span>힌트 보기</span>
                            </Button>
                          </div>

                          {step.hint && (
                            <div className="mt-2 text-sm text-gray-600 border-l-2 border-purple-300 pl-3">
                              <span className="font-medium">힌트:</span> {step.hint}
                            </div>
                          )}

                          <div>
                            <div className="text-sm font-medium mb-1">내 답변:</div>
                            <Textarea
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="이 단계의 해결 방법을 입력하세요..."
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {!showAllSteps && currentStep < solutionSteps.length - 1 && (
              <Button onClick={handleNextStep} className="flex items-center gap-2">
                {isInputMode ? "답변 제출하기" : "다음 단계"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {!showAllSteps && currentStep === solutionSteps.length - 1 && (
              <Button variant="default" onClick={handleShowAllSteps} className="flex items-center gap-2">
                풀이 완료
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
