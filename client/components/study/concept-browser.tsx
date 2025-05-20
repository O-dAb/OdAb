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
import { authApi } from "@/lib/api";

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
];

export function ConceptBrowser({ educationLevel, grade }: ConceptBrowserProps) {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);
  const [filteredConcepts, setFilteredConcepts] = useState<any[]>([]);
  const [conceptData, setConceptData] = useState<any>(null);
  const [selectedSubConcept, setSelectedSubConcept] = useState<any | null>(
    null
  );
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [subConceptContent, setSubConceptContent] = useState<string>("");
  const [subConceptDetailContent, setSubConceptDetailContent] =
    useState<string>("");

  // 교육과정에 맞는 개념 데이터 가져오기
  const concepts = useMemo(() => {
    return showAllGrades
      ? getAllCurriculumConcepts(educationLevel)
      : getCurriculumConcepts(educationLevel, selectedGrade);
  }, [showAllGrades, educationLevel, selectedGrade]);

  // 중학교 개념 데이터 추가
  const allConcepts = useMemo(() => {
    // curriculum-data에서 해당 카드가 반환될 경우 필터로 제거
    return concepts.filter(
      (concept: any) =>
        ![
          "분수와 소수",
          "일차방정식",
          "정수와 유리수",
          "연립방정식",
          "이차방정식",
        ].includes(concept.title)
    );
  }, [concepts]);

  // API에서 개념 데이터 불러오기
  useEffect(() => {
    authApi
      .get("/api/v1/common/concept")
      .then((res) => {
        console.log(res.data);
        // grades가 없거나 객체가 아니면 null로 처리
        if (
          res.data &&
          typeof res.data === "object" &&
          Array.isArray(res.data.grades)
        ) {
          setConceptData(res.data);
        } else {
          setConceptData(null);
        }
      })
      .catch(() => setConceptData(null));
  }, []);

  // 선택한 학년의 대주제 리스트
  const majorConcepts =
    conceptData?.grades.find(
      (g: any) => String(g.grade) === String(selectedGrade)
    )?.majorConceptList || [];

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

  // 2개씩 묶어서 row로 나누는 함수
  function chunkArray(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  // majorRows는 showAllGrades, selectedGrade에 따라 filteredMajorConcepts로만 선언
  const filteredMajorConcepts = showAllGrades
    ? conceptData?.grades.flatMap((g: any) => g.majorConceptList) || []
    : majorConcepts;
  const majorRows = chunkArray(filteredMajorConcepts, 2);

  // 카드 클릭 시 개념 설명 API 호출 (axios 사용)
  useEffect(() => {
    if (selectedConcept && selectedConcept.id) {
      authApi
        .get(`/api/v1/common/${selectedConcept.id}/content`)
        .then((res) => {
          setSubConceptContent(
            res.data.data?.subConceptContent || "내용이 없습니다."
          );
          console.log(res.data.data?.subConceptContent);
        })
        .catch(() => setSubConceptContent(""));
    } else {
      setSubConceptContent("");
    }
  }, [selectedConcept]);

  return (
    <div className="space-y-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-6 flex flex-col items-center">
      {/* 검색창 */}
      <div className="w-full max-w-6xl flex justify-center mb-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
          <Input
            placeholder="개념 검색..."
            className="pl-10 border-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 학년 선택 버튼 */}
      <div className="flex justify-center mb-8 gap-2">
        <Button
          variant={showAllGrades ? "default" : "outline"}
          className={`rounded-xl font-bold px-6 py-2 text-lg ${
            showAllGrades
              ? "bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-200 dark:bg-gray-800 dark:text-blue-300 dark:border-gray-600"
          }`}
          onClick={() => setShowAllGrades(true)}
        >
          전체학년
        </Button>
        <Button
          variant={
            !showAllGrades && selectedGrade === "1" ? "default" : "outline"
          }
          className={`rounded-xl font-bold px-6 py-2 text-lg ${
            !showAllGrades && selectedGrade === "1"
              ? "bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-200 dark:bg-gray-800 dark:text-blue-300 dark:border-gray-600"
          }`}
          onClick={() => {
            setShowAllGrades(false);
            setSelectedGrade("1");
          }}
        >
          1학년
        </Button>
        <Button
          variant={
            !showAllGrades && selectedGrade === "2" ? "default" : "outline"
          }
          className={`rounded-xl font-bold px-6 py-2 text-lg ${
            !showAllGrades && selectedGrade === "2"
              ? "bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-200 dark:bg-gray-800 dark:text-blue-300 dark:border-gray-600"
          }`}
          onClick={() => {
            setShowAllGrades(false);
            setSelectedGrade("2");
          }}
        >
          2학년
        </Button>
        <Button
          variant={
            !showAllGrades && selectedGrade === "3" ? "default" : "outline"
          }
          className={`rounded-xl font-bold px-6 py-2 text-lg ${
            !showAllGrades && selectedGrade === "3"
              ? "bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-white text-blue-500 border-blue-200 dark:bg-gray-800 dark:text-blue-300 dark:border-gray-600"
          }`}
          onClick={() => {
            setShowAllGrades(false);
            setSelectedGrade("3");
          }}
        >
          3학년
        </Button>
      </div>

      {/* 개념 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {filteredConcepts.length > 0 ? (
          filteredConcepts.map((concept) => (
            <Card
              key={concept.id}
              className={`cursor-pointer border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 hover:scale-105 transition-transform duration-200 ${
                educationLevel === "middle"
                  ? "border-green-100 dark:border-green-700"
                  : "border-blue-100 dark:border-gray-600"
              } ${
                selectedConcept?.id === concept.id
                  ? educationLevel === "middle"
                    ? "ring-4 ring-green-200 dark:ring-green-700"
                    : "ring-4 ring-blue-200 dark:ring-blue-700"
                  : ""
              }`}
              onClick={() => setSelectedConcept(concept)}
            >
              <CardContent className="p-6">
                <h3 className="font-extrabold text-xl text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  {concept.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base mt-1 mb-2">
                  {concept.description}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 px-3 py-1 rounded-full font-bold text-base shadow ${
                    educationLevel === "middle"
                      ? "border-green-200 dark:border-gray-600 text-green-600 dark:text-green-400 bg-white/80 dark:bg-gray-800/80"
                      : "border-blue-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 bg-white/80 dark:bg-gray-800/80"
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
          <div className="col-span-2 text-center py-10 text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 선택한 개념 상세 정보 */}
      {selectedConcept && (
        <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 w-full max-w-4xl mt-8">
          <CardHeader className="bg-yellow-50/60 dark:bg-gray-800/60 border-b-0 rounded-t-2xl">
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 text-2xl font-extrabold">
              <span className="text-3xl">🦦</span>
              {selectedConcept.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">설명</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {selectedConcept.description}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">공식</h3>
              <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-xl font-mono text-lg shadow dark:text-gray-300">
                {selectedConcept.formula}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">예시</h3>
              <ul className="list-disc pl-5 space-y-1 text-lg dark:text-gray-300">
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
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500 rounded-xl font-bold text-lg mt-4">
                관련 문제 풀어보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 대주제/소주제 네모 박스 */}
      <div className="w-full max-w-6xl flex flex-col gap-8 mt-8">
        {majorRows.map((row, rowIdx) => {
          // row(2개) 안에 선택된 소주제가 있는지 확인
          const isSelectedInRow = row.some(
            (major: any) =>
              selectedSubConcept && selectedMajorId === major.majorConceptId
          );
          return (
            <div key={rowIdx} className="mb-2">
              <div className="flex flex-col md:flex-row gap-8">
                {row.map((major: any) => (
                  <Card
                    key={major.majorConceptId}
                    className="flex-1 rounded-2xl shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-0 p-0 min-w-[320px]"
                  >
                    <CardHeader className="bg-blue-100/60 dark:bg-gray-800/60 rounded-t-2xl p-5 border-b-0">
                      <CardTitle className="text-blue-700 dark:text-blue-300 text-xl font-extrabold flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        {major.majorConceptType}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-6 px-5">
                      <div className="flex flex-wrap gap-3">
                        {major.subConceptList.map((sub: any) => (
                          <button
                            key={sub.subConceptId}
                            type="button"
                            className="text-left"
                            onClick={() => {
                              if (
                                selectedSubConcept &&
                                selectedSubConcept.subConceptId ===
                                  sub.subConceptId
                              ) {
                                setSelectedSubConcept(null);
                                setSelectedMajorId(null);
                                setSubConceptDetailContent("");
                              } else {
                                setSelectedSubConcept(sub);
                                setSelectedMajorId(major.majorConceptId);
                                authApi
                                  .get(
                                    `/api/v1/common/${sub.subConceptId}/content`
                                  )
                                  .then((res) => {
                                    setSubConceptDetailContent(
                                      res.data.subConceptContent || ""
                                    );
                                    console.log(
                                      "소주제 설명:",
                                      res.data.subConceptContent
                                    );
                                  })
                                  .catch((err) => {
                                    setSubConceptDetailContent("");
                                  });
                              }
                            }}
                          >
                            <div
                              className={`bg-white/80 dark:bg-gray-800/80 border border-yellow-200 dark:border-gray-600 rounded-xl shadow px-5 py-3 font-bold text-base text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-gray-700 transition cursor-pointer min-w-[140px] text-center ${
                                selectedSubConcept &&
                                selectedSubConcept.subConceptId ===
                                  sub.subConceptId
                                  ? "ring-2 ring-yellow-300 dark:ring-yellow-600"
                                  : ""
                              }`}
                            >
                              {sub.subConceptType}
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* row 아래에 노란색 설명 카드 */}
              {isSelectedInRow && selectedSubConcept && (
                <div className="flex justify-center mt-3">
                  <div className="w-full max-w-3xl">
                    <div className="rounded-2xl shadow-2xl bg-gradient-to-r from-yellow-100 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-0 p-0">
                      <div className="bg-yellow-50/60 dark:bg-gray-800/60 rounded-t-2xl px-8 py-6 border-b-0">
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 text-2xl font-extrabold">
                          <span className="text-3xl">🦦</span>
                          {selectedSubConcept.subConceptType}
                        </div>
                      </div>
                      <div className="pt-6 space-y-6 px-8 pb-8">
                        <div>
                          <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">
                            설명
                          </h3>
                          <p className="text-2xl text-gray-700 dark:text-gray-300">
                            {subConceptDetailContent &&
                            subConceptDetailContent.trim() !== ""
                              ? subConceptDetailContent
                              : "데이터가 없습니다."}
                          </p>
                        </div>
                        {selectedSubConcept.formula && (
                          <div>
                            <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">
                              공식
                            </h3>
                            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-xl font-mono text-lg shadow dark:text-gray-300">
                              {selectedSubConcept.formula}
                            </div>
                          </div>
                        )}
                        {selectedSubConcept.examples &&
                          selectedSubConcept.examples.length > 0 && (
                            <div>
                              <h3 className="text-base font-bold mb-1 text-yellow-700 dark:text-yellow-300">
                                예시
                              </h3>
                              <ul className="list-disc pl-5 space-y-1 text-lg dark:text-gray-300">
                                {selectedSubConcept.examples.map(
                                  (example: string, idx: number) => (
                                    <li key={idx}>{example}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        <div className="pt-2">
                          <Link
                            href={`/study/related?subConceptId=${selectedSubConcept.subConceptId}`}
                            className="block"
                          >
                            <Button
                              className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500 rounded-xl font-bold text-lg mt-4"
                              variant="outline"
                            >
                              관련 문제 풀어보기
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}