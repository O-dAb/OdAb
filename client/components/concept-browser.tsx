"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap } from "lucide-react";
import type { EducationLevel, Grade } from "@/components/user-profile";
import {
  getCurriculumConcepts,
  getAllCurriculumConcepts,
} from "@/lib/curriculum-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link"; // useRouter 대신 Link 사용

/**
 * 개념 학습 컴포넌트
 * 학생이 수학 개념을 학년별로 탐색하고 학습할 수 있는 기능 제공
 */
interface ConceptBrowserProps {
  educationLevel: EducationLevel;
  grade: Grade;
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
    title: "이차방정식1231231",
    description: "미지수가 2제곱으로 표현된 방정식을 해결하는 방법을 배웁니다.",
    formula: "ax² + bx + c = 0",
    examples: ["x² - 5x + 6 = 0", "2x² - 3x - 5 = 0"],
    grade: "3",
  },
];

export function ConceptBrowser({ educationLevel, grade }: ConceptBrowserProps) {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);
  const [filteredConcepts, setFilteredConcepts] = useState<any[]>([]);

  // 교육과정에 맞는 개념 데이터 가져오기
  const concepts = useMemo(() => {
    return showAllGrades
      ? getAllCurriculumConcepts(educationLevel)
      : getCurriculumConcepts(educationLevel, selectedGrade);
  }, [showAllGrades, educationLevel, selectedGrade]);

  // 중학교 개념 데이터 추가
  const allConcepts = useMemo(() => {
    return educationLevel === "middle"
      ? [...concepts, ...MIDDLE_SCHOOL_CONCEPTS]
      : concepts;
  }, [educationLevel, concepts]);

  // 학년에 맞는 개념만 필터링하는 함수
  const filterConceptsByGrade = (concepts: any[], grade: Grade): any[] => {
    return concepts.filter((concept) => {
      // 중학교 개념의 경우
      if (concept.id >= 101 && concept.id <= 106) {
        return concept.grade === grade;
      }

      // 고등학교 개념의 경우
      if (concept.id <= 4) return grade === "1";
      if (concept.id <= 8) return grade === "2";
      return grade === "3";
    });
  };

  // 검색어와 학년에 따라 개념 필터링
  useEffect(() => {
    let filtered = allConcepts;

    // 학년 필터링
    if (!showAllGrades) {
      filtered = filterConceptsByGrade(filtered, selectedGrade);
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (concept) =>
          concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          concept.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredConcepts(filtered);
  }, [searchTerm, showAllGrades, selectedGrade, allConcepts]);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade);
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 min-h-screen p-6 flex flex-col items-center">
      {/* 검색 및 필터 영역 */}
      <div className="flex justify-between items-center w-full max-w-6xl">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="개념 검색..."
            className="pl-10 border-blue-100 rounded-xl shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showAllGrades ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllGrades(true)}
            className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500 rounded-xl font-bold"
          >
            <GraduationCap className="h-4 w-4" />
            <span>전체 학년</span>
          </Button>
          {!showAllGrades && (
            <Select value={selectedGrade} onValueChange={handleGradeChange}>
              <SelectTrigger className="w-[100px] bg-blue-50 border-blue-100 rounded-xl">
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
                setShowAllGrades(false);
                setSelectedGrade(grade);
              }}
              className="border-blue-100 text-blue-500 hover:bg-blue-50 rounded-xl font-bold"
            >
              내 학년으로
            </Button>
          )}
        </div>
      </div>

      {/* 개념 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {filteredConcepts.length > 0 ? (
          filteredConcepts.map((concept) => (
            <Card
              key={concept.id}
              className={`cursor-pointer border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:scale-105 transition-transform duration-200 ${
                educationLevel === "middle"
                  ? "border-green-100"
                  : "border-blue-100"
              } ${
                selectedConcept?.id === concept.id
                  ? educationLevel === "middle"
                    ? "ring-4 ring-green-200"
                    : "ring-4 ring-blue-200"
                  : ""
              }`}
              onClick={() => setSelectedConcept(concept)}
            >
              <CardContent className="p-6">
                <h3 className="font-extrabold text-xl text-blue-700 mb-1 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  {concept.title}
                </h3>
                <p className="text-gray-600 text-base mt-1 mb-2">
                  {concept.description}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 px-3 py-1 rounded-full font-bold text-base shadow ${
                    educationLevel === "middle"
                      ? "border-green-200 text-green-600 bg-white/80"
                      : "border-blue-200 text-blue-600 bg-white/80"
                  }`}
                >
                  {educationLevel === "middle" ? "중" : "고"}
                  {concept.grade ||
                    (concept.id <= 4 ? "1" : concept.id <= 8 ? "2" : "3")}
                  학년
                </Badge>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 선택한 개념 상세 정보 */}
      {selectedConcept && (
        <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-50 to-purple-50 w-full max-w-4xl mt-8">
          <CardHeader className="bg-yellow-50/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-yellow-700 text-2xl font-extrabold">
              <span className="text-3xl">🦦</span>
              {selectedConcept.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700">설명</h3>
              <p className="text-lg text-gray-700">
                {selectedConcept.description}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700">공식</h3>
              <div className="bg-yellow-50 p-4 rounded-xl font-mono text-lg shadow">
                {selectedConcept.formula}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700">예시</h3>
              <ul className="list-disc pl-5 space-y-1 text-lg">
                {selectedConcept.examples.map(
                  (example: string, index: number) => (
                    <li key={index}>{example}</li>
                  )
                )}
              </ul>
            </div>

            {/* 라우팅 방식으로 변경: useRouter.push() → Link 컴포넌트 */}
            <Link
              href={`/study/related?subConceptId=${selectedConcept.id}`}
              className="w-full block"
            >
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 rounded-xl font-bold text-lg mt-4">
                관련 문제 풀어보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
