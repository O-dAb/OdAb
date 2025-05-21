"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import type { EducationLevel, Grade } from "@/components/user-profile";

// API 응답 타입 정의
interface SubConceptDto {
  subConceptId: number;
  subConceptType: string;
}

interface Question {
  questionId: number;
  questionImg: string;
  questionText: string;
  registedAt: string;
  userId: number;
  userName: string;
  subConceptDtos: SubConceptDto[];
}

interface Pageable {
  offset: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
}

interface ApiResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Question[];
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  pageable: Pageable;
  empty: boolean;
}

export default function RelatedProblemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subConceptId = searchParams.get("subConceptId");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubConceptType, setSelectedSubConceptType] = useState<
    string | null
  >(null);
  const [problems, setProblems] = useState<Question[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 관련 문제 데이터 가져오기
  useEffect(() => {
    const fetchRelatedProblems = async () => {
      if (!subConceptId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/question/${subConceptId}/related`
        );
        if (!response.ok) {
          throw new Error("문제를 불러오는데 실패했습니다.");
        }
        const data: ApiResponse = await response.json();
        setProblems(data.content);
        setFilteredProblems(data.content);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProblems();
  }, [subConceptId]);

  // 검색어와 필터에 따라 문제 필터링
  useEffect(() => {
    let filtered = [...problems];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter((problem) =>
        problem.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // subConceptType 필터링
    if (selectedSubConceptType) {
      filtered = filtered.filter((problem) =>
        problem.subConceptDtos.some(
          (subConcept) => subConcept.subConceptType === selectedSubConceptType
        )
      );
    }

    setFilteredProblems(filtered);
  }, [searchTerm, selectedSubConceptType, problems]);

  // 문제 풀기 버튼 클릭 시
  const handleSolveProblem = (problemId: number) => {
    router.push(`/question/retry/${problemId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2 dark:text-white">
              오류 발생
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              이전 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subConceptId) {
    return (
      <div className="container mx-auto py-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 dark:text-white">
              잘못된 접근
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              올바른 개념 ID가 필요합니다.
            </p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              이전 페이지로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700/50 rounded-xl font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            관련 문제
          </h1>
        </div>
      </div>

      {/* 문제 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <Card
              key={problem.questionId}
              className="border-l-4 border-l-purple-500 dark:border-l-purple-400 hover:shadow-md transition-shadow rounded-xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 dark:border-gray-700"
            >
              <CardHeader className="bg-purple-50 dark:bg-gray-800/60 border-b border-purple-100 dark:border-gray-700 py-3 rounded-t-xl">
                <CardTitle className="flex justify-between items-center text-base">
                  <span className="dark:text-gray-200">
                    문제 {problem.questionId}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-300 text-xs"
                  >
                    {problem.userName}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {problem.subConceptDtos.map((subConcept, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-blue-200 dark:border-gray-600 text-blue-600 dark:text-blue-300 text-xs"
                    >
                      {subConcept.subConceptType}
                    </Badge>
                  ))}
                </div>
                <div className="mb-3 max-h-[100px] overflow-hidden">
                  {problem.questionText ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {problem.questionText}
                    </p>
                  ) : problem.questionImg ? (
                    <img
                      src={problem.questionImg}
                      alt="문제 이미지"
                      className="w-full h-[100px] object-contain rounded-lg"
                    />
                  ) : null}
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSolveProblem(problem.questionId)}
                    className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-sm h-8 rounded-xl font-bold"
                  >
                    문제 풀기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-3 border-yellow-100 dark:border-gray-700 dark:bg-gray-800 rounded-xl">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                검색 결과가 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
