"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, RotateCcw, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EducationLevel, Grade } from "@/components/user-profile";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  step: string;
  solutionContent: string;
}

interface WrongQuestionDto {
  questionId: number;
  questionImg: string;
  questionText: string;
  answer?: string;
  registDate?: string;
  registedAt?: string;
  wrongQuestionSolutions?: WrongQuestionSolution[];
  solvedOnRetry?: boolean;
  wrongQuestionSubconceptList?: WrongQuestionSubconcept[];
}

interface WrongQuestionSubconcept {
  subConceptId: number;
  subConceptType: string;
}

interface WrongQuestionResponseDto {
  gradeWrongQuestionDtos: WrongQuestionDto[];
  wrongQuestionSubconcepts: WrongQuestionSubconcept[];
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
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestionDto[]>([]);
  const [subconcepts, setSubconcepts] = useState<WrongQuestionSubconcept[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<WrongQuestionDto[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchWrongQuestions();
  }, []);

  // 필터 변경 시 데이터 다시 로드
  useEffect(() => {
    fetchWrongQuestions();
  }, [activeTab, selectedGrade, selectedTopic, showAllGrades]);

  // 오답 목록 가져오기
  const fetchWrongQuestions = async () => {
    try {
      setLoading(true);

      let apiUrl = "";

      if (activeTab === "recent") {
        // 최근 학습 오답 API - 학년에 따라 엔드포인트 변경
        if (showAllGrades) {
          apiUrl = "http://localhost:8080/api/v1/question-result/middle/recent"; // 중학교 전체 최근 오답
        } else {
          apiUrl = `http://localhost:8080/api/v1/question-result/${selectedGrade}/recent/grade`; // 특정 학년 최근 오답
        }
      } else {
        // 전체 오답 API
        if (selectedTopic) {
          apiUrl = `http://localhost:8080/api/v1/question-result/${selectedTopic}/subconcept`; // 주제별 오답
        } else if (showAllGrades) {
          apiUrl = "http://localhost:8080/api/v1/question-result/middle"; // 중학교 전체 학년 기준
        } else {
          apiUrl = `http://localhost:8080/api/v1/question-result/${selectedGrade}/grade`; // 특정 학년 오답
        }
      }

      console.log("API 요청 URL:", apiUrl); // 디버깅용 로그

      if (selectedTopic) {
        // 주제별 오답 API 응답 처리
        const response = await axios.get<SubConceptResponseDto>(apiUrl);
        console.log("주제별 오답 응답:", response.data);

        // 응답 데이터를 WrongQuestionDto 형식으로 변환
        const formattedQuestions = response.data.wrongQuestionDtos.map((q) => ({
          ...q,
          wrongQuestionSubconceptList: [
            {
              subConceptId: response.data.subConceptId,
              subConceptType: response.data.subConceptType,
            },
          ],
        }));

        setWrongQuestions(formattedQuestions);
        setSubconcepts([
          {
            subConceptId: response.data.subConceptId,
            subConceptType: response.data.subConceptType,
          },
        ]);
      } else {
        // 일반 오답 API 응답 처리
        const response = await axios.get<WrongQuestionResponseDto>(apiUrl);
        console.log("일반 오답 응답:", response.data);
        const questions = response.data?.gradeWrongQuestionDtos || [];
        const concepts = response.data?.wrongQuestionSubconcepts || [];

        setWrongQuestions(questions);
        setSubconcepts(concepts);
      }

      // 최근 학습 오답도 별도로 설정 (최근 오답 탭용)
      if (activeTab === "recent") {
        setRecentQuestions(wrongQuestions);
      } else if (wrongQuestions.length > 0) {
        // 최근 학습 주제 오답은 등록일 기준으로 최신 3개만 가져오기
        const sortedByDate = [...wrongQuestions]
          .sort(
            (a, b) =>
              new Date(b.registDate || b.registedAt || "").getTime() -
              new Date(a.registDate || a.registedAt || "").getTime()
          )
          .slice(0, 3);
        setRecentQuestions(sortedByDate);
      } else {
        setRecentQuestions([]);
      }
    } catch (error) {
      console.error("오답 목록 로드 실패:", error);
      console.error("에러 세부 정보:", error);
      toast({
        title: "오류",
        description: "오답 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

    // 성공적인 라우팅 시에는 로딩 상태를 해제하지 않음
    // 페이지 전환이 완료되면 새 페이지가 로드되므로 현재 컴포넌트는 언마운트됨
  };

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade);
  };

  // 주제 필터링
  const handleTopicSelect = (topic: number | null) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="space-y-6">
      {/* 상단 필터 영역 */}
      <Card className="border-blue-100">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="flex justify-between items-center">
            <span>오답 노트</span>
            <div className="flex items-center gap-2">
              <Button
                variant={showAllGrades ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllGrades(true)}
                className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500"
                disabled={loading}
              >
                <GraduationCap className="h-4 w-4" />
                <span>전체 학년</span>
              </Button>
              {!showAllGrades && (
                <Select
                  value={selectedGrade}
                  onValueChange={handleGradeChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[100px] bg-blue-50 border-blue-100">
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
                  className="border-blue-100 text-blue-500 hover:bg-blue-50"
                  disabled={loading}
                >
                  내 학년으로
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6 bg-blue-100">
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 data-[state=active]:bg-blue-400 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span>전체 오답</span>
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="flex items-center gap-2 data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4" />
            <span>최근 학습</span>
          </TabsTrigger>
        </TabsList>

        {/* 주제 필터 */}
        {activeTab === "all" && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">주제 필터</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleTopicSelect(null)}
                className={
                  selectedTopic === null
                    ? "bg-blue-400 hover:bg-blue-500"
                    : "border-blue-100 text-blue-500 hover:bg-blue-50"
                }
                disabled={loading}
              >
                전체
              </Button>
              {subconcepts.map((subconcept) => (
                <Button
                  key={subconcept.subConceptId}
                  variant={
                    selectedTopic === subconcept.subConceptType
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleTopicSelect(subconcept.subConceptId)}
                  className={
                    selectedTopic === subconcept.subConceptType
                      ? "bg-blue-400 hover:bg-blue-500"
                      : "border-blue-100 text-blue-500 hover:bg-blue-50"
                  }
                  disabled={loading}
                >
                  {subconcept.subConceptType}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 전체 오답 탭 */}
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {loading ? (
              <Card className="border-blue-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">로딩 중...</p>
                </CardContent>
              </Card>
            ) : wrongQuestions.length > 0 ? (
              wrongQuestions.map((question) => (
                <Card key={question.questionId} className="border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {/* 해당 문제의 주제 찾기 */}
                          <Badge className="bg-blue-400">
                            {question.wrongQuestionSubconceptList?.length > 0
                              ? question.wrongQuestionSubconceptList[0]
                                  .subConceptType
                              : "주제 없음"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              question.registDate || question.registedAt || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{question.questionText}</p>
                        {question.questionImg && (
                          <img
                            src={question.questionImg}
                            alt="문제 이미지"
                            className="mt-2 max-h-40 object-contain"
                          />
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-blue-100 text-blue-500 hover:bg-blue-50"
                        onClick={() => handleRetry(question.questionId)}
                        disabled={loading || question.solvedOnRetry}
                      >
                        <RotateCcw className="h-3 w-3" />
                        {question.solvedOnRetry ? "정답 처리됨" : "다시 풀기"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-blue-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">아직 오답 기록이 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 최근 학습 탭 */}
        <TabsContent value="recent" className="mt-0">
          <div className="space-y-4">
            {loading ? (
              <Card className="border-yellow-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">로딩 중...</p>
                </CardContent>
              </Card>
            ) : recentQuestions.length > 0 ? (
              recentQuestions.map((question) => (
                <Card key={question.questionId} className="border-yellow-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {/* 해당 문제의 주제 찾기 */}
                          <Badge className="bg-yellow-400">
                            {question.wrongQuestionSubconceptList?.length > 0
                              ? question.wrongQuestionSubconceptList[0]
                                  .subConceptType
                              : "주제 없음"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              question.registDate || question.registedAt || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{question.questionText}</p>
                        {question.questionImg && (
                          <img
                            src={question.questionImg}
                            alt="문제 이미지"
                            className="mt-2 max-h-40 object-contain"
                          />
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-yellow-100 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleRetry(question.questionId)}
                        disabled={loading || question.solvedOnRetry}
                      >
                        <RotateCcw className="h-3 w-3" />
                        {question.solvedOnRetry ? "정답 처리됨" : "다시 풀기"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-yellow-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">최근 학습한 오답이 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
