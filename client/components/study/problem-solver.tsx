"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, BookOpen, GraduationCap, ArrowRight, Eye, ThumbsUp, ThumbsDown, HelpCircle, CheckCircle, AlertCircle } from "lucide-react"
import { ProblemUploader } from "@/components/study/problem-uploader"
import type { EducationLevel, Grade } from "@/components/profile/user-profile"
import { getCurriculumTopics, getAllCurriculumTopics } from "@/lib/curriculum-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { InlineMath, BlockMath } from "react-katex"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// MathRenderer 컴포넌트 - 수학 표현식을 적절하게 렌더링
function MathRenderer({ math, isBlock = false }: { math: string; isBlock?: boolean }) {
  // LaTeX 형식이 맞는지 확인 (기본적인 검사)
  const isLatex = math.includes('\\') || math.includes('{') || math.includes('^') || math.includes('_')
  
  try {
    if (isLatex) {
      return isBlock ? <BlockMath math={math} /> : <InlineMath math={math} />
    } else {
      // LaTeX 형식이 아니면 일반 텍스트로 표시
      return <span>{math}</span>
    }
  } catch (error) {
    // 렌더링 오류 시 원본 텍스트 표시
    console.error("Math rendering error:", error)
    return <span className="text-red-500">{math}</span>
  }
}

// 수학 내용이 포함된 텍스트를 파싱하여 렌더링하는 컴포넌트
function MathText({ text }: { text: string }) {
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
        return <span key={index}>{part}</span>
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

// 문제 해결 단계 타입 정의
interface SolutionStep {
  title: string
  content: string
  hint?: string
  userInput?: string
  isCorrect?: boolean
  formulas?: string[] // 수식 배열
  keyPoints?: string[] // 핵심 개념
}

export function ProblemSolver({ educationLevel, grade }: ProblemSolverProps) {
  // 상태 관리
  const [problemText, setProblemText] = useState("")
  const [problemType, setProblemType] = useState("")
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [showAllGrades, setShowAllGrades] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [userAnswer, setUserAnswer] = useState("")
  const [isInputMode, setIsInputMode] = useState(false)
  const [viewMode, setViewMode] = useState<"step" | "all">("step")
  const [userSolution, setUserSolution] = useState("")
  const { toast } = useToast()
  const [topics, setTopics] = useState<string[]>([])

  // 교육과정에 맞는 주제 가져오기
  useEffect(() => {
    const fetchTopics = showAllGrades
      ? getAllCurriculumTopics(educationLevel)
      : getCurriculumTopics(educationLevel, selectedGrade)
    setTopics(fetchTopics)
  }, [showAllGrades, educationLevel, selectedGrade])

  // 예시 문제 데이터 - 실제로는 백엔드에서 받아올 것
  const exampleProblems = {
    이차방정식: [
      {
        text: "다음 이차방정식을 풀어라: $x^2 - 5x + 6 = 0$",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 이차방정식 $x^2 - 5x + 6 = 0$을 풀어 $x$의 값을 구하는 문제입니다.",
            hint: "이차방정식의 표준형은 $ax^2 + bx + c = 0$ 입니다. 여기서 $a = 1$, $b = -5$, $c = 6$ 입니다.",
            keyPoints: ["이차방정식", "인수분해", "근 구하기"],
            formulas: ["$ax^2 + bx + c = 0$", "$(x-p)(x-q) = 0$"]
          },
          {
            title: "해결 방법 선택하기",
            content: "이차방정식을 풀기 위한 여러 방법 중 인수분해를 사용해 보겠습니다.",
            hint: "인수분해는 $(x-p)(x-q) = 0$ 형태로 만들어 $x = p$ 또는 $x = q$ 라는 해를 구하는 방법입니다.",
            keyPoints: ["인수분해", "이차식 분해"],
            formulas: ["$(x-p)(x-q) = x^2 - (p+q)x + pq$"]
          },
          {
            title: "인수분해 적용하기",
            content: "$x^2 - 5x + 6$을 인수분해하면 $(x-2)(x-3) = 0$ 입니다.",
            hint: "두 수 $p$, $q$가 있을 때, $p + q = -b/a = 5$, $p × q = c/a = 6$이 되어야 합니다. $p = 2$, $q = 3$이 조건을 만족합니다.",
            keyPoints: ["곱이 6이고 합이 5인 두 수 찾기"],
            formulas: ["$x^2 - 5x + 6 = (x-2)(x-3)$"]
          },
          {
            title: "해 구하기",
            content: "$(x-2)(x-3) = 0$이므로, $x-2 = 0$ 또는 $x-3 = 0$입니다. 따라서 $x = 2$ 또는 $x = 3$입니다.",
            hint: "인수가 0이 되는 경우를 각각 계산하면 됩니다.",
            keyPoints: ["영인수의 정리"],
            formulas: ["$(x-2)(x-3) = 0$ ⟹ $x-2 = 0$ 또는 $x-3 = 0$"]
          },
          {
            title: "검산하기",
            content: "구한 해가 원래 방정식을 만족하는지 확인합니다:\n$x = 2$ 대입: $2^2 - 5×2 + 6 = 4 - 10 + 6 = 0$ ✓\n$x = 3$ 대입: $3^2 - 5×3 + 6 = 9 - 15 + 6 = 0$ ✓",
            hint: "구한 해를 원래 방정식에 대입하여 좌변이 0이 되는지 확인합니다.",
            keyPoints: ["검산", "대입 검증"],
            formulas: ["$f(2) = 2^2 - 5×2 + 6 = 0$", "$f(3) = 3^2 - 5×3 + 6 = 0$"]
          },
        ],
      },
      {
        text: "다음 이차방정식을 풀어라: $2x^2 - 7x + 3 = 0$",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 이차방정식 $2x^2 - 7x + 3 = 0$을 풀어 $x$의 값을 구하는 문제입니다.",
            hint: "이차방정식의 표준형은 $ax^2 + bx + c = 0$ 입니다. 여기서 $a = 2$, $b = -7$, $c = 3$ 입니다.",
            keyPoints: ["이차방정식", "근의 공식"],
            formulas: ["$ax^2 + bx + c = 0$"]
          },
          {
            title: "해결 방법 선택하기",
            content: "이 방정식은 인수분해가 쉽지 않아 보입니다. 근의 공식을 사용해 보겠습니다.",
            hint: "근의 공식은 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ 입니다.",
            keyPoints: ["근의 공식", "판별식"],
            formulas: ["$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$"]
          },
          {
            title: "판별식 계산하기",
            content: "판별식 $D = b^2 - 4ac = (-7)^2 - 4×2×3 = 49 - 24 = 25$",
            hint: "판별식이 양수이므로 서로 다른 두 실근을 가집니다.",
            keyPoints: ["판별식", "실근의 개수"],
            formulas: ["$D = b^2 - 4ac$", "$D > 0$ ⟹ 서로 다른 두 실근"]
          },
          {
            title: "근의 공식 적용하기",
            content: "$x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{7 \\pm \\sqrt{25}}{4} = \\frac{7 \\pm 5}{4}$",
            hint: "$\\sqrt{25} = 5$ 입니다.",
            keyPoints: ["근의 공식 계산"],
            formulas: ["$x = \\frac{7 \\pm 5}{4}$"]
          },
          {
            title: "해 구하기",
            content: "$x = \\frac{7 + 5}{4} = \\frac{12}{4} = 3$ 또는 $x = \\frac{7 - 5}{4} = \\frac{2}{4} = \\frac{1}{2}$",
            hint: "분수 형태의 답도 정확히 계산해야 합니다.",
            keyPoints: ["분수 약분"],
            formulas: ["$x_1 = 3$", "$x_2 = \\frac{1}{2}$"]
          },
          {
            title: "검산하기",
            content: "$x = 3$ 대입: $2×3^2 - 7×3 + 3 = 2×9 - 21 + 3 = 18 - 21 + 3 = 0$ ✓\n$x = \\frac{1}{2}$ 대입: $2×(\\frac{1}{2})^2 - 7×(\\frac{1}{2}) + 3 = 2×\\frac{1}{4} - \\frac{7}{2} + 3 = \\frac{1}{2} - \\frac{7}{2} + 3 = 0$ ✓",
            hint: "구한 해를 원래 방정식에 대입하여 좌변이 0이 되는지 확인합니다.",
            keyPoints: ["검산", "대입 검증"],
            formulas: ["$f(3) = 2×3^2 - 7×3 + 3 = 0$", "$f(\\frac{1}{2}) = 2×(\\frac{1}{2})^2 - 7×(\\frac{1}{2}) + 3 = 0$"]
          },
        ],
      },
    ],
    미분법: [
      {
        text: "함수 $f(x) = x^3 - 3x^2 + 2$의 도함수를 구하시오.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 함수 $f(x) = x^3 - 3x^2 + 2$의 도함수 $f'(x)$를 구하는 문제입니다.",
            hint: "도함수는 함수의 순간 변화율을 나타내며, 미분을 통해 구할 수 있습니다.",
            keyPoints: ["도함수", "순간변화율"],
            formulas: ["$f(x) = x^3 - 3x^2 + 2$"]
          },
          {
            title: "미분 법칙 적용하기",
            content: "각 항을 개별적으로 미분한 후 더합니다. 다항함수의 미분 공식을 사용합니다.",
            hint: "$x^n$의 미분은 $nx^{n-1}$입니다. 상수항의 미분은 0입니다.",
            keyPoints: ["다항함수의 미분", "항별 미분"],
            formulas: ["$\\frac{d}{dx}[x^n] = nx^{n-1}$", "$\\frac{d}{dx}[상수] = 0$"]
          },
          {
            title: "$x^3$ 항 미분하기",
            content: "$x^3$의 미분은 $3x^2$입니다.",
            hint: "$x^n → nx^{n-1}$ 공식 적용: $x^3 → 3x^2$",
            keyPoints: ["거듭제곱 미분 공식"],
            formulas: ["$\\frac{d}{dx}[x^3] = 3x^2$"]
          },
          {
            title: "$-3x^2$ 항 미분하기",
            content: "$-3x^2$의 미분은 $-3 × 2x = -6x$입니다.",
            hint: "$-3x^2 → -3 × 2x^1 = -6x$",
            keyPoints: ["계수를 포함한 미분"],
            formulas: ["$\\frac{d}{dx}[-3x^2] = -6x$"]
          },
          {
            title: "상수항 미분하기",
            content: "상수항 2의 미분은 0입니다.",
            hint: "상수의 미분은 항상 0입니다.",
            keyPoints: ["상수항 미분"],
            formulas: ["$\\frac{d}{dx}[2] = 0$"]
          },
          {
            title: "결과 정리하기",
            content: "따라서 $f'(x) = 3x^2 - 6x + 0 = 3x^2 - 6x$ 입니다.",
            hint: "각 항의 미분 결과를 모두 더합니다.",
            keyPoints: ["도함수 유도 완료"],
            formulas: ["$f'(x) = 3x^2 - 6x$"]
          },
        ],
      },
    ],
    적분법: [
      {
        text: "$\\int(2x + 3)dx$를 계산하시오.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 함수 $2x + 3$의 부정적분 $\\int(2x + 3)dx$를 구하는 문제입니다.",
            hint: "부정적분은 미분의 역과정으로, 주어진 함수를 미분하면 원래 함수가 나오는 함수를 찾는 것입니다.",
            keyPoints: ["부정적분", "원시함수"],
            formulas: ["$\\int f(x)dx = F(x) + C$ 이면 $F'(x) = f(x)$"]
          },
          {
            title: "적분 법칙 적용하기",
            content: "각 항을 개별적으로 적분한 후 더합니다. 다항함수의 적분 공식을 사용합니다.",
            hint: "$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ (단, $n ≠ -1$). 상수항 $a$의 적분은 $ax + C$입니다.",
            keyPoints: ["항별 적분", "다항함수 적분 공식"],
            formulas: ["$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$", "$\\int a dx = ax + C$"]
          },
          {
            title: "$2x$ 항 적분하기",
            content: "$\\int 2x dx = 2\\int x dx = 2(\\frac{x^2}{2}) = x^2$",
            hint: "$\\int x dx = \\frac{x^2}{2}$ 공식 적용",
            keyPoints: ["거듭제곱 적분 공식"],
            formulas: ["$\\int 2x dx = x^2$"]
          },
          {
            title: "$3$ 항 적분하기",
            content: "$\\int 3 dx = 3x$",
            hint: "$\\int a dx = ax$ 공식 적용",
            keyPoints: ["상수항 적분"],
            formulas: ["$\\int 3 dx = 3x$"]
          },
          {
            title: "결과 정리하기",
            content: "따라서 $\\int(2x + 3)dx = x^2 + 3x + C$ 입니다. (C는 적분상수)",
            hint: "각 항의 적분 결과를 모두 더하고, 적분상수 C를 추가합니다.",
            keyPoints: ["부정적분", "적분상수"],
            formulas: ["$\\int(2x + 3)dx = x^2 + 3x + C$"]
          },
        ],
      },
    ],
    삼각함수: [
      {
        text: "$\\sin^2\\theta + \\cos^2\\theta = 1$임을 증명하시오.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 삼각함수의 기본 항등식 $\\sin^2\\theta + \\cos^2\\theta = 1$을 증명하는 문제입니다.",
            hint: "삼각함수의 기본 정의와 피타고라스 정리를 활용할 수 있습니다.",
            keyPoints: ["삼각함수 항등식", "피타고라스 정리"],
            formulas: ["$\\sin^2\\theta + \\cos^2\\theta = 1$"]
          },
          {
            title: "접근 방법 선택하기",
            content: "단위원(반지름이 1인 원)에서 삼각함수의 정의를 활용하여 증명해 보겠습니다.",
            hint: "단위원에서 점 $(\\cos\\theta, \\sin\\theta)$는 원 위의 점입니다.",
            keyPoints: ["단위원", "삼각함수의 기하학적 정의"],
            formulas: ["$x = \\cos\\theta$", "$y = \\sin\\theta$"]
          },
          {
            title: "단위원 적용하기",
            content: "단위원에서 점 $(x, y) = (\\cos\\theta, \\sin\\theta)$는 원 위의 점입니다. 단위원의 방정식은 $x^2 + y^2 = 1$입니다.",
            hint: "단위원은 원점을 중심으로 하고 반지름이 1인 원입니다.",
            keyPoints: ["단위원 방정식"],
            formulas: ["$(x - 0)^2 + (y - 0)^2 = 1^2$", "$x^2 + y^2 = 1$"]
          },
          {
            title: "대입하기",
            content: "$x = \\cos\\theta$, $y = \\sin\\theta$를 단위원 방정식 $x^2 + y^2 = 1$에 대입하면, $\\cos^2\\theta + \\sin^2\\theta = 1$이 됩니다.",
            hint: "단위원 위의 모든 점은 $x^2 + y^2 = 1$을 만족합니다.",
            keyPoints: ["좌표 대입"],
            formulas: ["$(\\cos\\theta)^2 + (\\sin\\theta)^2 = 1$", "$\\cos^2\\theta + \\sin^2\\theta = 1$"]
          },
          {
            title: "결론 도출하기",
            content: "따라서 $\\sin^2\\theta + \\cos^2\\theta = 1$이 증명되었습니다.",
            hint: "이 항등식은 삼각함수의 가장 기본적인 성질 중 하나입니다.",
            keyPoints: ["삼각함수 기본 항등식"],
            formulas: ["$\\sin^2\\theta + \\cos^2\\theta = 1$"]
          },
        ],
      },
    ],
    "수와 연산": [
      {
        text: "다음 분수를 소수로 바꾸시오: 3/8",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 분수 3/8을 소수로 변환하는 문제입니다.",
            hint: "분수를 소수로 변환하려면 분자를 분모로 나누면 됩니다.",
          },
          {
            title: "나눗셈 수행하기",
            content: "3 ÷ 8 = 0.375",
            hint: "나눗셈을 수행할 때 자리 올림에 주의하세요.",
          },
          {
            title: "결과 확인하기",
            content: "따라서 3/8 = 0.375 입니다.",
            hint: "소수로 표현했을 때 0.375는 유한소수입니다.",
          },
        ],
      },
    ],
    "변화와 관계": [
      {
        text: "일차방정식 2x + 5 = 11을 풀어라.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 일차방정식 2x + 5 = 11을 풀어 x의 값을 구하는 문제입니다.",
            hint: "일차방정식을 풀기 위해서는 x를 한쪽으로 이항하여 값을 구합니다.",
          },
          {
            title: "방정식 정리하기",
            content: "2x + 5 = 11\n2x = 11 - 5\n2x = 6",
            hint: "등식의 양변에서 같은 수를 빼면 등식이 유지됩니다.",
          },
          {
            title: "x의 값 구하기",
            content: "2x = 6\nx = 6 ÷ 2\nx = 3",
            hint: "등식의 양변을 같은 수로 나누면 등식이 유지됩니다.",
          },
          {
            title: "검산하기",
            content: "x = 3을 원래 방정식에 대입하면,\n2(3) + 5 = 6 + 5 = 11 ✓",
            hint: "구한 해를 원래 방정식에 대입하여 좌변이 우변과 같은지 확인합니다.",
          },
        ],
      },
    ],
    "도형과 측정": [
      {
        text: "삼각형의 넓이를 구하는 공식을 이용하여 밑변이 6cm, 높이가 4cm인 삼각형의 넓이를 구하시오.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 밑변이 6cm, 높이가 4cm인 삼각형의 넓이를 구하는 문제입니다.",
            hint: "삼각형의 넓이 공식은 (밑변 × 높이) ÷ 2 입니다.",
          },
          {
            title: "공식 적용하기",
            content: "삼각형의 넓이 = (밑변 × 높이) ÷ 2\n= (6cm × 4cm) ÷ 2\n= 24cm² ÷ 2\n= 12cm²",
            hint: "단위에 주의하세요. 넓이의 단위는 cm²입니다.",
          },
          {
            title: "결과 확인하기",
            content: "따라서 삼각형의 넓이는 12cm²입니다.",
            hint: "삼각형의 넓이는 항상 양수입니다.",
          },
        ],
      },
    ],
    "자료와 가능성": [
      {
        text: "주사위를 한 번 던질 때, 짝수가 나올 확률을 구하시오.",
        steps: [
          {
            title: "문제 이해하기",
            content: "이 문제는 주사위를 한 번 던질 때 짝수가 나올 확률을 구하는 문제입니다.",
            hint: "확률은 (사건이 일어나는 경우의 수) ÷ (전체 경우의 수)로 구합니다.",
          },
          {
            title: "전체 경우의 수 구하기",
            content: "주사위를 한 번 던질 때 나올 수 있는 숫자는 1, 2, 3, 4, 5, 6으로 총 6가지입니다.",
            hint: "주사위는 1부터 6까지의 숫자가 하나씩 적혀 있습니다.",
          },
          {
            title: "사건이 일어나는 경우의 수 구하기",
            content: "짝수는 2, 4, 6으로 총 3가지입니다.",
            hint: "짝수는 2로 나누어 떨어지는 수입니다.",
          },
          {
            title: "확률 계산하기",
            content: "짝수가 나올 확률 = 사건이 일어나는 경우의 수 ÷ 전체 경우의 수\n= 3 ÷ 6\n= 1/2",
            hint: "분수는 가능한 약분하여 표현합니다.",
          },
          {
            title: "결과 확인하기",
            content: "따라서 주사위를 한 번 던질 때 짝수가 나올 확률은 1/2입니다.",
            hint: "확률은 0에서 1 사이의 값을 가집니다.",
          },
        ],
      },
    ],
  }

  const handleProblemRecognized = (text: string) => {
    setProblemText(text)

    // 실제로는 백엔드에서 문제 유형을 분석하고 단계별 풀이를 받아올 것입니다
    // 여기서는 예시로 이차방정식 유형으로 가정합니다
    const detectedType = "이차방정식"
    setProblemType(detectedType)

    // 백엔드에서 받아온 단계별 풀이 데이터를 설정합니다
    // 문제마다 단계 수가 다를 수 있습니다
    const problemsOfType = exampleProblems[detectedType as keyof typeof exampleProblems] || []
    const selectedProblem = problemsOfType[0]

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
    setViewMode("all")
  }

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade)
  }

  const handleTopicSelect = (topic: string) => {
    setProblemType(topic)

    // 선택한 주제에 맞는 예시 문제 가져오기
    const problemsOfType = exampleProblems[topic as keyof typeof exampleProblems]
    if (problemsOfType && problemsOfType.length > 0) {
      const selectedProblem = problemsOfType[0]
      setProblemText(selectedProblem.text)
      setSolutionSteps(selectedProblem.steps)
      setCurrentStep(0)
      setShowAllSteps(false)
      setIsInputMode(false)
      setViewMode("step")
    } else {
      setProblemText("")
      setSolutionSteps([])
    }
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

  return (
    <div className="space-y-6">
      {/* 상단 필터 영역 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={showAllGrades ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllGrades(true)}
            className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500"
          >
            <GraduationCap className="h-4 w-4" />
            <span>전체 학년</span>
          </Button>
          {!showAllGrades && (
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
          )}
          {showAllGrades && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAllGrades(false)
                setSelectedGrade(grade)
              }}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              내 학년으로
            </Button>
          )}
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
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={problemType === topic ? "default" : "outline"}
                    className={`h-auto py-3 ${
                      problemType === topic
                        ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                        : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    }`}
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

      {/* 문제 표시 영역 */}
      {problemText && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle>문제</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100 text-lg font-medium">
              <MathText text={problemText} />
            </div>
            {problemType && (
              <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                <div>
                  문제 유형: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-1">{problemType}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 문제 풀이 공간 */}
      {problemText && (
        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle>문제 풀이</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              placeholder="여기에 풀이 과정을 작성하세요..."
              className="min-h-[150px] bg-white border-gray-200"
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">정답:</span>
              <Input
                className="w-[150px] bg-white border-gray-200"
                placeholder="정답 입력"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              <Button className="bg-blue-400 hover:bg-blue-500">제출</Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* 해설 영역 */}
      {solutionSteps.length > 0 && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex justify-between items-center">
              <span>해설</span>
              <div className="flex items-center gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => handleViewModeChange(v as "step" | "all")}
                  className="w-[200px]"
                >
                  <TabsList className="bg-green-100">
                    <TabsTrigger
                      value="step"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      단계별로 보기
                    </TabsTrigger>
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      한번에 보기
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {viewMode === "all"
                ? solutionSteps.map((step, index) => (
                    <div key={index} className="bg-green-50/50 p-5 rounded-md border border-green-100 shadow-sm">
                      <div className="flex items-center gap-2 font-medium text-green-700 text-lg mb-3 border-b border-green-200 pb-2">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <h3>{step.title}</h3>
                      </div>
                      
                      {/* 핵심 개념 표시 */}
                      {step.keyPoints && step.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {step.keyPoints.map((point, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* 주요 내용 */}
                      <div className="mb-4 text-gray-800 leading-relaxed">
                        <MathText text={step.content} />
                      </div>
                      
                      {/* 수식 영역 */}
                      {step.formulas && step.formulas.length > 0 && (
                        <div className="bg-gray-50 p-3 my-3 rounded-md border border-gray-200">
                          <p className="text-sm text-gray-500 mb-2">주요 공식:</p>
                          <div className="space-y-2">
                            {step.formulas.map((formula, i) => (
                              <div key={i} className="flex items-center">
                                <div className="mr-2 text-gray-400">•</div>
                                <MathText text={formula} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 힌트 영역 */}
                      {step.hint && (
                        <div className="mt-3 text-sm text-gray-600 border-l-3 border-yellow-400 pl-3 bg-yellow-50/50 p-2 rounded-r-md">
                          <div className="flex items-center gap-2 font-medium text-yellow-700 mb-1">
                            <HelpCircle className="h-4 w-4" />
                            <span>힌트</span>
                          </div>
                          <div>
                            <MathText text={step.hint} />
                          </div>
                        </div>
                      )}
                      
                      {/* 사용자 답변 영역 */}
                      {step.userInput && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-sm font-medium text-blue-700 mb-1">내 답변:</div>
                          <div className="flex items-center gap-2">
                            <MathText text={step.userInput} />
                            {step.isCorrect !== undefined && (
                              step.isCorrect ? (
                                <div className="flex items-center text-green-500">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">정답</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-500">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  <span className="text-sm">오답</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                : solutionSteps.slice(0, currentStep + 1).map((step, index) => (
                    <div key={index} className="bg-green-50/50 p-5 rounded-md border border-green-100 shadow-sm">
                      <div className="flex items-center gap-2 font-medium text-green-700 text-lg mb-3 border-b border-green-200 pb-2">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <h3>{step.title}</h3>
                      </div>
                      
                      {/* 핵심 개념 표시 */}
                      {step.keyPoints && step.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {step.keyPoints.map((point, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {index < currentStep || !isInputMode ? (
                        <>
                          {/* 주요 내용 */}
                          <div className="mb-4 text-gray-800 leading-relaxed">
                            <MathText text={step.content} />
                          </div>
                          
                          {/* 수식 영역 */}
                          {step.formulas && step.formulas.length > 0 && (
                            <div className="bg-gray-50 p-3 my-3 rounded-md border border-gray-200">
                              <p className="text-sm text-gray-500 mb-2">주요 공식:</p>
                              <div className="space-y-2">
                                {step.formulas.map((formula, i) => (
                                  <div key={i} className="flex items-center">
                                    <div className="mr-2 text-gray-400">•</div>
                                    <MathText text={formula} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 힌트 영역 */}
                          {!isInputMode && step.hint && (
                            <div className="mt-3 text-sm text-gray-600 border-l-3 border-yellow-400 pl-3 bg-yellow-50/50 p-2 rounded-r-md">
                              <div className="flex items-center gap-2 font-medium text-yellow-700 mb-1">
                                <HelpCircle className="h-4 w-4" />
                                <span>힌트</span>
                              </div>
                              <div>
                                <MathText text={step.hint} />
                              </div>
                            </div>
                          )}
                          
                          {/* 사용자 답변 영역 */}
                          {step.userInput && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                              <div className="text-sm font-medium text-blue-700 mb-1">내 답변:</div>
                              <div className="flex items-center gap-2">
                                <MathText text={step.userInput} />
                                {step.isCorrect !== undefined && (
                                  step.isCorrect ? (
                                    <div className="flex items-center text-green-500">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      <span className="text-sm">정답</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-red-500">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      <span className="text-sm">오답</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updatedSteps = [...solutionSteps]
                                updatedSteps[index].hint = step.hint
                                setSolutionSteps(updatedSteps)
                              }}
                              className="flex items-center gap-1 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                            >
                              <HelpCircle className="h-4 w-4" />
                              <span>힌트 보기</span>
                            </Button>
                          </div>

                          {/* 힌트 표시 */}
                          {step.hint && (
                            <div className="mt-3 text-sm text-gray-600 border-l-3 border-yellow-400 pl-3 bg-yellow-50/50 p-2 rounded-r-md">
                              <div className="flex items-center gap-2 font-medium text-yellow-700 mb-1">
                                <HelpCircle className="h-4 w-4" />
                                <span>힌트</span>
                              </div>
                              <div>
                                <MathText text={step.hint} />
                              </div>
                            </div>
                          )}

                          {/* 사용자 입력 영역 */}
                          <div>
                            <div className="text-sm font-medium mb-1">내 답변:</div>
                            <Textarea
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="이 단계의 해결 방법을 입력하세요..."
                              className="min-h-[100px] border-green-200 focus-visible:ring-green-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {viewMode === "step" && currentStep < solutionSteps.length - 1 && (
              <Button onClick={handleNextStep} className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500">
                {isInputMode ? "답변 제출하기" : "다음 단계"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {viewMode === "step" && currentStep === solutionSteps.length - 1 && (
              <Button
                variant="default"
                onClick={() => handleViewModeChange("all")}
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500"
              >
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
