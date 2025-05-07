"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, RotateCcw, Clock, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { EducationLevel, Grade } from "@/components/profile/user-profile"
import {
  getCurriculumTopics,
  getAllCurriculumTopics,
  getRecentlyStudiedTopics,
  getAllRecentlyStudiedTopics,
  getMistakesByTopic,
  getAllMistakesByTopic,
} from "@/lib/curriculum-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

/**
 * 오답 노트 컴포넌트
 * 학생이 틀린 문제들을 확인하고 다시 풀어볼 수 있는 기능 제공
 */
interface MistakeTrackerProps {
  educationLevel: EducationLevel
  grade: Grade
}

export function MistakeTracker({ educationLevel, grade }: MistakeTrackerProps) {
  // 상태 관리
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [recentTopics, setRecentTopics] = useState<string[]>([])
  const [showAllGrades, setShowAllGrades] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [filteredMistakes, setFilteredMistakes] = useState<any[]>([])
  const [recentMistakes, setRecentMistakes] = useState<any[]>([])
  const { toast } = useToast()

  // 교육과정에 맞는 주제 가져오기
  const topics = showAllGrades
    ? getAllCurriculumTopics(educationLevel)
    : getCurriculumTopics(educationLevel, selectedGrade)

  // 최근 학습한 주제 가져오기
  useEffect(() => {
    if (showAllGrades) {
      setRecentTopics(getAllRecentlyStudiedTopics(educationLevel))
    } else {
      setRecentTopics(getRecentlyStudiedTopics(educationLevel, selectedGrade))
    }
  }, [educationLevel, selectedGrade, showAllGrades])

  // 선택된 주제에 따라 문제 필터링
  useEffect(() => {
    if (showAllGrades) {
      setFilteredMistakes(getAllMistakesByTopic(selectedTopic, educationLevel))
    } else {
      setFilteredMistakes(getMistakesByTopic(selectedTopic, educationLevel, selectedGrade))
    }
  }, [selectedTopic, educationLevel, selectedGrade, showAllGrades])

  // 최근 학습한 주제의 오답 가져오기
  useEffect(() => {
    if (showAllGrades) {
      // 모든 학년에서 최근 학습한 주제의 오답 가져오기
      const mistakes = recentTopics.flatMap((topic) => getAllMistakesByTopic(topic, educationLevel))
      setRecentMistakes(mistakes)
    } else {
      // 현재 학년에서 최근 학습한 주제의 오답 가져오기
      const mistakes = recentTopics.flatMap((topic) => getMistakesByTopic(topic, educationLevel, selectedGrade))
      setRecentMistakes(mistakes)
    }
  }, [recentTopics, educationLevel, selectedGrade, showAllGrades])

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade)
  }

  // 다시 풀기 기능
  const handleRetry = (problemId: number) => {
    toast({
      title: "문제 해결 완료!",
      description: "정답 처리되었습니다. 오답률이 갱신됩니다.",
    })

    // 문제를 정답 처리로 표시
    const updatedMistakes = [...filteredMistakes].map((mistake) => {
      if (mistake.id === problemId) {
        return { ...mistake, solvedOnRetry: true }
      }
      return mistake
    })

    setFilteredMistakes(updatedMistakes)

    // 최근 학습 탭의 오답도 업데이트
    const updatedRecentMistakes = [...recentMistakes].map((mistake) => {
      if (mistake.id === problemId) {
        return { ...mistake, solvedOnRetry: true }
      }
      return mistake
    })

    setRecentMistakes(updatedRecentMistakes)
  }

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
              >
                <GraduationCap className="h-4 w-4" />
                <span>전체 학년</span>
              </Button>
              {!showAllGrades && (
                <Select value={selectedGrade} onValueChange={handleGradeChange}>
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
                    setShowAllGrades(false)
                    setSelectedGrade(grade)
                  }}
                  className="border-blue-100 text-blue-500 hover:bg-blue-50"
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

        {/* 주제 필터 - 전체 오답 탭에만 표시 */}
        {activeTab === "all" && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">주제 필터</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className={
                  selectedTopic === null
                    ? "bg-blue-400 hover:bg-blue-500"
                    : "border-blue-100 text-blue-500 hover:bg-blue-50"
                }
              >
                전체
              </Button>
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className={
                    selectedTopic === topic
                      ? "bg-blue-400 hover:bg-blue-500"
                      : "border-blue-100 text-blue-500 hover:bg-blue-50"
                  }
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 전체 오답 탭 */}
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {filteredMistakes.length > 0 ? (
              filteredMistakes.map((mistake) => (
                <Card key={mistake.id} className="border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-400">{mistake.topic}</Badge>
                          <span className="text-sm text-gray-500">{mistake.date}</span>
                        </div>
                        <p>{mistake.problem}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-blue-100 text-blue-500 hover:bg-blue-50"
                        onClick={() => handleRetry(mistake.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        다시 풀기
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
            {recentMistakes.length > 0 ? (
              recentMistakes.map((mistake) => (
                <Card key={mistake.id} className="border-yellow-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-400">{mistake.topic}</Badge>
                          <span className="text-sm text-gray-500">{mistake.date}</span>
                        </div>
                        <p>{mistake.problem}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 border-yellow-100 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleRetry(mistake.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        다시 풀기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-yellow-100">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">최근 학습한 주제가 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
