"use client"
import { useState, useMemo } from "react"
import type { EducationLevel, Grade } from "@/components/profile/user-profile"
import { getCurriculumConcepts, getAllCurriculumConcepts } from "@/lib/curriculum-data"

/**
 * 개념 학습 컴포넌트
 * 학생이 수학 개념을 학년별로 탐색하고 학습할 수 있는 기능 제공
 */
interface ConceptBrowserProps {
  educationLevel: EducationLevel
  grade: Grade
}

// 중학교 개념 데이터 추가
const MIDDLE_SCHOOL_CONCEPTS = [
  {
    id: 101,
    title: "정수와 유리수",
    description: "정수와 유리수의 개념과 연산 방법을 배웁니다.",
    formula: "a/b (단, a는 정수, b는 0이 아닌 정수)",
    examples: ["3/4", "-5/2", "7"],
    grade: "1",
  },
  {
    id: 102,
    title: "일차방정식",
    description: "미지수가 1제곱으로 표현된 방정식을 해결하는 방법을 배웁니다.",
    formula: "ax + b = c",
    examples: ["2x + 3 = 7", "x - 5 = 10"],
    grade: "1",
  },
  {
    id: 103,
    title: "좌표평면과 그래프",
    description: "좌표평면에서 점의 위치와 그래프를 표현하는 방법을 배웁니다.",
    formula: "(x, y)",
    examples: ["점 (3, 4)", "원점 (0, 0)"],
    grade: "2",
  },
  {
    id: 104,
    title: "도형의 합동",
    description: "두 도형이 합동인 조건과 성질을 배웁니다.",
    formula: "SSS, SAS, ASA, AAS 합동 조건",
    examples: ["삼각형의 합동", "합동인 도형의 성질"],
    grade: "2",
  },
  {
    id: 105,
    title: "확률",
    description: "사건이 일어날 가능성을 수치로 표현하는 방법을 배웁니다.",
    formula: "P(사건) = 사건이 일어나는 경우의 수 / 전체 경우의 수",
    examples: ["동전 던지기", "주사위 던지기"],
    grade: "3",
  },
  {
    id: 106,
    title: "이차방정식",
    description: "미지수가 2제곱으로 표현된 방정식을 해결하는 방법을 배웁니다.",
    formula: "ax² + bx + c = 0",
    examples: ["x² - 5x + 6 = 0", "2x² - 3x - 5 = 0"],
    grade: "3",
  },
]

export function ConceptBrowser({ educationLevel, grade }: ConceptBrowserProps) {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null)
  const [showAllGrades, setShowAllGrades] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [filteredConcepts, setFilteredConcepts] = useState<any[]>([])

  // 교육과정에 맞는 개념 데이터 가져오기
  const concepts = useMemo(() => {
    return showAllGrades
      ? getAllCurriculumConcepts(educationLevel)
      : getCurriculumConcepts(educationLevel, selectedGrade)
  }, [showAllGrades, educationLevel, selectedGrade])

  // 중학교 개념 데이터 추가
  const allConcepts = useMemo(() => {
    return educationLevel === "middle" ? [...concepts, ...MIDDLE_SCHOOL_CONCEPTS] : concepts
  }, [educationLevel, concepts])

  // 학년에 맞는 개념만 필터링하는 함수
  const filterConceptsByGrade = (concepts: any[], grade: Grade): any[] => {
    return concepts.filter((concept) => {
      // 중학교 개념의 경우
      if (concept.id >= 101 && concept.id <= 106) {
        return concept.grade === grade
      }

      // 고등학교 개념의 경우
      if (concept.id <= 4) return grade === "1"
      if (concept.id <= 8) return grade === "2"
