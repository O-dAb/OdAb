// components/mistake-tracker.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, RotateCcw, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Next.js의 Link 컴포넌트 추가
import { authApi } from "@/lib/api";
import axios from "axios";
import { useAuth } from "@/contexts/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/**
 * 오답 노트 컴포넌트
 * 학생이 틀린 문제들을 확인하고 다시 풀어볼 수 있는 기능 제공
 */
interface MistakeTrackerProps {
  educationLevel: EducationLevel;
  grade: Grade;
}

// API 응답 타입 정의
interface WrongQuestionSolution {
  questionSolutionId: number;
  step: number; // Byte -> number
  solutionContent: string;
}

interface WrongQuestionDto {
  questionId: number;
  questionImg: string;
  questionText: string;
  answer?: string;
  registDate?: any; // 배열 형태로 들어올 수 있으므로 any로 변경
  registedAt?: string;
  wrongQuestionSolutions?: WrongQuestionSolution[];
  solvedOnRetry?: boolean;
  wrongQuestionSubconceptList?: WrongQuestionSubconcept[];
  formattedDate?: string; // 추가
}

interface WrongQuestionSubconcept {
  subConceptId: number;
  subConceptType: string;
}

interface WrongQuestionMajorConcept {
  majorConceptId: number;
  majorConceptType: string;
  subconcepts: WrongQuestionSubconcept[];
}

interface WrongQuestionResponseDto {
  gradeWrongQuestionDtos: WrongQuestionDto[];
  majorConcepts: WrongQuestionMajorConcept[];
}

interface SubConceptResponseDto {
  wrongQuestionDtos: WrongQuestionDto[];
  subConceptId: number;
  subConceptType: string;
}

export function MistakeTracker({ educationLevel, grade }: MistakeTrackerProps) {
  // 상태 관리
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);

  // 각 탭별로 독립적인 상태 관리
  const [allTabQuestions, setAllTabQuestions] = useState<WrongQuestionDto[]>(
    []
  );
  const [recentTabQuestions, setRecentTabQuestions] = useState<
    WrongQuestionDto[]
  >([]);

  // 개념 관련 상태
  const [majorConcepts, setMajorConcepts] = useState<
    WrongQuestionMajorConcept[]
  >([]);
  const [selectedMajorConcept, setSelectedMajorConcept] = useState<
    number | null
  >(null);
  const [subconcepts, setSubconcepts] = useState<WrongQuestionSubconcept[]>([]);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { userProfile } = useAuth();

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    if (userProfile?.grade) {
      setSelectedGrade(userProfile.grade as Grade);
    }
  }, [userProfile?.grade]);

  // 탭, 학년, 토픽 변경 시 데이터 로드
  useEffect(() => {
    if (selectedGrade) {
      if (activeTab === "all") {
        fetchAllWrongQuestions();
      } else if (activeTab === "recent") {
        fetchRecentWrongQuestions();
      }
    }
  }, [activeTab, selectedGrade, selectedTopic]);

  // majorConcept 선택 시 해당 subconcepts 로드
  useEffect(() => {
    if (selectedMajorConcept !== null) {
      // 선택된 majorConcept에 해당하는 subconcepts 찾기
      const selectedMajor = majorConcepts.find(
        (mc) => mc.majorConceptId === selectedMajorConcept
      );
      if (selectedMajor) {
        setSubconcepts(selectedMajor.subconcepts);
        setSelectedTopic(null); // 토픽 선택 초기화
      }
    } else {
      // 선택된 majorConcept가 없으면 subconcepts 초기화
      setSubconcepts([]);
    }
  }, [selectedMajorConcept, majorConcepts]);

  // 전체 오답 목록 가져오기 (all 탭)
  const fetchAllWrongQuestions = async () => {
    try {
      setLoading(true);

      let apiUrl = "";
      if (selectedTopic) {
        apiUrl = `/api/v1/question-result/${selectedTopic}/subconcept`; // 주제별 오답
      } else {
        apiUrl = `/api/v1/question-result/${selectedGrade}/grade`; // 특정 학년 오답
      }

      console.log("전체 오답 API 요청 URL:", apiUrl);

      if (selectedTopic) {
        // 주제별 오답 API 응답 처리
        const response = (await authApi.get<SubConceptResponseDto>(
          apiUrl
        )) as unknown as SubConceptResponseDto;
        console.log("주제별 오답 응답:", response);

        // 응답 데이터를 WrongQuestionDto 형식으로 변환
        const formattedQuestions = response.wrongQuestionDtos.map((q) => {
          // 소주제 API에서 배열 형태로 날짜가 오면 처리
          const formattedDate = Array.isArray(q.registedAt)
            ? formatArrayDate(q.registedAt)
            : q.registedAt;

          return {
            ...q,
            // 원본 배열은 보존하고 새로운 속성 추가
            formattedDate: formattedDate,
            wrongQuestionSubconceptList: [
              {
                subConceptId: response.subConceptId,
                subConceptType: response.subConceptType,
              },
            ],
          };
        });

        setAllTabQuestions(formattedQuestions);
      } else {
        // 일반 오답 API 응답 처리
        const response = (await authApi.get<WrongQuestionResponseDto>(
          apiUrl
        )) as unknown as WrongQuestionResponseDto;
        console.log("일반 오답 응답:", response);

        const questions = response?.gradeWrongQuestionDtos || [];
        const majors = response?.majorConcepts || [];

        setAllTabQuestions(questions);
        setMajorConcepts(majors);

        // 만약 선택된 majorConcept가 있다면 해당 subconcepts 로드
        if (selectedMajorConcept !== null) {
          const selectedMajor = majors.find(
            (mc) => mc.majorConceptId === selectedMajorConcept
          );
          if (selectedMajor) {
            setSubconcepts(selectedMajor.subconcepts);
          }
        }
      }
    } catch (error) {
      console.error("전체 오답 목록 로드 실패:", error);
      console.error("에러 세부 정보:", error);
      toast({
        title: "오류",
        description: "오답 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      setAllTabQuestions([]);
      setMajorConcepts([]);
      setSubconcepts([]);
    } finally {
      setLoading(false);
    }
  };

  // 최근 학습 오답 가져오기 (recent 탭)
  const fetchRecentWrongQuestions = async () => {
    try {
      setLoading(true);

      const apiUrl = `/api/v1/question-result/${selectedGrade}/recent/grade`; // 특정 학년 최근 오답

      console.log("최근 학습 API 요청 URL:", apiUrl);

      const response = (await authApi.get<WrongQuestionResponseDto>(
        apiUrl
      )) as unknown as WrongQuestionResponseDto;
      console.log("최근 학습 응답:", response);

      const questions = response?.gradeWrongQuestionDtos || [];
      const majors = response?.majorConcepts || [];

      setRecentTabQuestions(questions);
      setMajorConcepts(majors);
    } catch (error) {
      console.error("최근 오답 목록 로드 실패:", error);
      console.error("에러 세부 정보:", error);
      toast({
        title: "오류",
        description: "최근 오답 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      setRecentTabQuestions([]);
      setMajorConcepts([]);
    } finally {
      setLoading(false);
    }
  };

  // "다시 풀기" 버튼 클릭 핸들러 - App Router 방식으로 수정
  const handleRetry = (questionId: number) => {
    // 로딩 상태 시작
    setLoading(true);

    try {
      // 다시 풀기 화면으로 라우팅
      console.log(`${questionId}`);
      router.push(`/question/retry/${questionId}`);

      toast({
        title: "문제 다시 풀기",
        description: "문제 풀이 화면으로 이동합니다.",
      });
    } catch (error) {
      console.error("화면 전환 실패:", error);
      toast({
        title: "오류",
        description: "문제 풀이 화면으로 이동하는데 실패했습니다.",
        variant: "destructive",
      });
      // 로딩 상태 종료 (에러 시에만 필요)
      setLoading(false);
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 탭 변경 시 선택된 주제 초기화
    setSelectedMajorConcept(null);
    setSelectedTopic(null);
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade);
    // 학년 변경 시 선택된 주제 초기화
    setSelectedMajorConcept(null);
    setSelectedTopic(null);
  };

  // 대주제 선택 핸들러
  const handleMajorConceptSelect = (majorConceptId: number | null) => {
    // 이미 선택된 대주제를 다시 클릭하면 선택 해제
    if (majorConceptId === selectedMajorConcept) {
      setSelectedMajorConcept(null);
      setSubconcepts([]);
      setSelectedTopic(null); // 소주제 선택도 함께 초기화
    } else {
      setSelectedMajorConcept(majorConceptId);
      setSelectedTopic(null); // 소주제 선택 초기화
    }
  };

  // 소주제 필터링
  const handleTopicSelect = (topic: number | null) => {
    setSelectedTopic(topic);
  };

  // 현재 탭에 따라 표시할 문제 목록 결정 및 필터링
  const getFilteredQuestions = () => {
    const baseQuestions =
      activeTab === "all" ? allTabQuestions : recentTabQuestions;

    if (selectedTopic) {
      // 소주제가 선택된 경우 API에서 이미 필터링된 결과를 사용
      return baseQuestions;
    } else if (selectedMajorConcept !== null) {
      // 대주제만 선택된 경우, 클라이언트 측에서 필터링
      return baseQuestions.filter((question) => {
        // 문제의 소주제 리스트를 확인
        return question.wrongQuestionSubconceptList?.some((subConcept) => {
          // 현재 선택된 대주제에 속한 소주제 ID 목록
          const subConceptIds = subconcepts.map((sc) => sc.subConceptId);
          // 문제의 소주제가 현재 선택된 대주제에 속하는지 확인
          return subConceptIds.includes(subConcept.subConceptId);
        });
      });
    } else {
      // 필터가 없는 경우 모든 문제 반환
      return baseQuestions;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  // 배열 형식 날짜를 문자열로 변환하는 함수
  const formatArrayDate = (dateArray: any[]): string => {
    if (dateArray && Array.isArray(dateArray) && dateArray.length >= 5) {
      try {
        const [year, month, day, hour, minute] = dateArray;
        // 월은 0부터 시작하므로 month-1 사용
        const date = new Date(year, month - 1, day, hour, minute);
        return date.toISOString();
      } catch (error) {
        console.error("배열 날짜 변환 오류:", error, dateArray);
      }
    }
    return "";
  };

  // 날짜 형식 처리 함수
  const formatDate = (registDate: any, registedAt?: string): string => {
    try {
      // formattedDate 속성이 있으면 우선 사용
      if (registDate && registDate.formattedDate) {
        return new Date(registDate.formattedDate).toLocaleDateString();
      }

      // 배열 형태인 경우
      if (Array.isArray(registDate) && registDate.length >= 5) {
        const [year, month, day, hour, minute] = registDate;
        // JavaScript에서는 월이 0부터 시작하므로 month-1 사용
        const date = new Date(year, month - 1, day, hour, minute);
        return date.toLocaleDateString();
      }
      // 문자열 형태인 경우
      else if (registDate && typeof registDate === "string") {
        return new Date(registDate).toLocaleDateString();
      }
      // registedAt 사용
      else if (registedAt) {
        return new Date(registedAt).toLocaleDateString();
      }

      return "날짜 정보 없음";
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return "날짜 처리 오류";
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-pink-950 dark:via-blue-950 dark:to-purple-950 min-h-screen p-6">
      <div className="flex items-center gap-3 mb-2"></div>
      {/* 상단 필터 영역 */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <CardHeader className="bg-blue-50/60 dark:bg-blue-950/60 border-b-0 rounded-t-2xl">
          <CardTitle className="flex justify-between items-center text-blue-700 dark:text-blue-300">
            <span>오답 노트</span>
            <div className="flex items-center gap-2">
              <Select
                value={selectedGrade}
                onValueChange={handleGradeChange}
                disabled={loading}
              >
                <SelectTrigger className="w-[100px] bg-blue-50 dark:bg-gray-800 border-blue-100 dark:border-blue-700 rounded-xl dark:text-gray-200">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="dark:text-gray-200">1학년</SelectItem>
                  <SelectItem value="2" className="dark:text-gray-200">2학년</SelectItem>
                  <SelectItem value="3" className="dark:text-gray-200">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}
      >
          <TabsList className="grid grid-cols-2 mb-6 bg-blue-100 dark:bg-blue-900 rounded-xl shadow">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-blue-400 dark:data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-xl font-bold dark:text-gray-300"
            >
            <BookOpen className="h-4 w-4" />
            <span>전체 오답</span>
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-700 data-[state=active]:text-white rounded-xl font-bold dark:text-gray-300"
            >
            <Clock className="h-4 w-4" />
            <span>최근 학습</span>
          </TabsTrigger>
        </TabsList>

        {/* 주제 필터 - 대분류 */}
        {activeTab === "all" && (
          <div className="space-y-4">
            {/* 대주제 필터 */}
            <div>
              <div className="text-sm font-medium mb-2">대주제 필터</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={
                    selectedMajorConcept === null ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleMajorConceptSelect(null)}
                  className={
                    selectedMajorConcept === null
                      ? "bg-purple-400 hover:bg-purple-500 rounded-xl font-bold"
                      : "border-purple-100 text-purple-500 hover:bg-purple-50 rounded-xl font-bold"
                  }
                  disabled={loading}
                >
                  전체
                </Button>
                {majorConcepts.map((major) => (
                  <Button
                    key={major.majorConceptId}
                    variant={
                      selectedMajorConcept === major.majorConceptId
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleMajorConceptSelect(major.majorConceptId)
                    }
                    className={
                      selectedMajorConcept === major.majorConceptId
                        ? "bg-purple-400 hover:bg-purple-500 rounded-xl font-bold"
                        : "border-purple-100 text-purple-500 hover:bg-purple-50 rounded-xl font-bold"
                    }
                    disabled={loading}
                  >
                    {major.majorConceptType}
                  </Button>
                ))}
              </div>
            </div>

            {/* 소주제 필터 - 대주제 선택시에만 표시 */}
            {selectedMajorConcept !== null && subconcepts.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">소주제 필터</div>
                <div className="flex flex-wrap gap-2">
                  {subconcepts.map((subconcept) => (
                    <Button
                      key={subconcept.subConceptId}
                      variant={
                        selectedTopic === subconcept.subConceptId
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleTopicSelect(subconcept.subConceptId)}
                      className={
                        selectedTopic === subconcept.subConceptId
                          ? "bg-blue-400 hover:bg-blue-500 rounded-xl font-bold"
                          : "border-blue-100 text-blue-500 hover:bg-blue-50 rounded-xl font-bold"
                      }
                      disabled={loading}
                    >
                      {subconcept.subConceptType}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 전체 오답 탭 */}
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {loading ? (
              <Card className="border-blue-100 dark:border-blue-900">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
                </CardContent>
              </Card>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <Card
                  key={question.questionId}
                  className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {/* 해당 문제의 주제 찾기 */}
                          <Badge className="bg-blue-400 dark:bg-blue-700 rounded-full px-3 py-1 text-white font-bold">
                            {question.wrongQuestionSubconceptList?.[0]
                              ?.subConceptType || "주제 없음"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {question.formattedDate
                              ? new Date(
                                  question.formattedDate
                                ).toLocaleDateString()
                              : formatDate(
                                  question.registDate,
                                  question.registedAt
                                )}
                          </span>
                        </div>
                        <p className="font-semibold text-blue-700 dark:text-blue-300">
                          {question.questionText}
                        </p>
                        {question.questionImg && (
                          <img
                            src={question.questionImg}
                            alt="문제 이미지"
                            className="mt-2 max-h-40 object-contain rounded-xl border border-blue-100 dark:border-blue-800"
                          />
                        )}
                      </div>
                      {/* 라우팅 방식으로 변경 - Link 컴포넌트 사용 (선택적) */}
                      {question.solvedOnRetry ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 border-blue-100 dark:border-blue-700 text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-xl font-bold"
                          disabled={true}
                        >
                          <RotateCcw className="h-3 w-3" />
                          정답 처리됨
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 border-blue-100 dark:border-blue-700 text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-xl font-bold"
                          onClick={() => handleRetry(question.questionId)}
                          disabled={loading}
                        >
                          <RotateCcw className="h-3 w-3" />
                          다시 풀기
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-blue-100 dark:border-blue-900">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    아직 오답 기록이 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 최근 학습 탭 */}
        <TabsContent value="recent" className="mt-0">
          <div className="space-y-4">
            {loading ? (
              <Card className="border-yellow-100 dark:border-yellow-900">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
                </CardContent>
              </Card>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <Card
                  key={question.questionId}
                  className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50 dark:from-yellow-900 dark:via-pink-950 dark:to-purple-950"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {/* 해당 문제의 주제 찾기 */}
                          <Badge className="bg-yellow-400 dark:bg-yellow-700 rounded-full px-3 py-1 text-white font-bold">
                            {question.wrongQuestionSubconceptList?.[0]
                              ?.subConceptType || "주제 없음"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {question.formattedDate
                              ? new Date(
                                  question.formattedDate
                                ).toLocaleDateString()
                              : formatDate(
                                  question.registDate,
                                  question.registedAt
                                )}
                          </span>
                        </div>
                        <p className="font-semibold text-yellow-700 dark:text-yellow-300">
                          {question.questionText}
                        </p>
                        {question.questionImg && (
                          <img
                            src={question.questionImg}
                            alt="문제 이미지"
                            className="mt-2 max-h-40 object-contain rounded-xl border border-yellow-100 dark:border-yellow-800"
                          />
                        )}
                      </div>
                      {/* 라우팅 방식으로 변경 - 최근 학습 탭도 동일하게 수정 */}
                      {question.solvedOnRetry ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 border-yellow-100 dark:border-yellow-800 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 rounded-xl font-bold"
                          disabled={true}
                        >
                          <RotateCcw className="h-3 w-3" />
                          정답 처리됨
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 border-yellow-100 dark:border-yellow-800 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 rounded-xl font-bold"
                          onClick={() => handleRetry(question.questionId)}
                          disabled={loading}
                        >
                          <RotateCcw className="h-3 w-3" />
                          다시 풀기
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-yellow-100 dark:border-yellow-900">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    최근 학습한 오답이 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
