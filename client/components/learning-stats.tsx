"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  GraduationCap,
} from "lucide-react";
import type { EducationLevel, Grade } from "@/components/user-profile";
import {
  getCurriculumTopics,
  getAllCurriculumTopics,
  getTopicErrorRate,
  getAllTopicErrorRate,
  getTopicLastStudyDate,
  getAllTopicLastStudyDate,
  getTopicStudyCount,
  getAllTopicStudyCount,
} from "@/lib/curriculum-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LearningStatsProps {
  educationLevel: EducationLevel;
  grade: Grade;
}

export function LearningStats({ educationLevel, grade }: LearningStatsProps) {
  const [showAllGrades, setShowAllGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);

  const topics = showAllGrades
    ? getAllCurriculumTopics(educationLevel)
    : getCurriculumTopics(educationLevel, selectedGrade);

  // 약점 주제 (오답률 30% 이상)
  const weakTopics = topics.filter((topic) =>
    showAllGrades
      ? getAllTopicErrorRate(topic, educationLevel) >= 30
      : getTopicErrorRate(topic, educationLevel, selectedGrade) >= 30
  );

  // 강점 주제 (오답률 10% 이하이면서 학습 횟수 5회 이상)
  const strongTopics = topics.filter((topic) =>
    showAllGrades
      ? getAllTopicErrorRate(topic, educationLevel) <= 10 &&
        getAllTopicStudyCount(topic, educationLevel) >= 5
      : getTopicErrorRate(topic, educationLevel, selectedGrade) <= 10 &&
        getTopicStudyCount(topic, educationLevel, selectedGrade) >= 5
  );

  // 최근 학습한 주제 (최근 7일 이내)
  const recentTopics = topics.filter((topic) => {
    const lastStudyDate = showAllGrades
      ? getAllTopicLastStudyDate(topic, educationLevel)
      : getTopicLastStudyDate(topic, educationLevel, selectedGrade);
    if (!lastStudyDate) return false;

    const lastStudy = new Date(lastStudyDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastStudy.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7;
  });

  // 오랫동안 학습하지 않은 주제 (30일 이상)
  const neglectedTopics = topics.filter((topic) => {
    const lastStudyDate = showAllGrades
      ? getAllTopicLastStudyDate(topic, educationLevel)
      : getTopicLastStudyDate(topic, educationLevel, selectedGrade);
    if (!lastStudyDate) return true; // 한 번도 학습하지 않은 주제

    const lastStudy = new Date(lastStudyDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastStudy.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 30;
  });

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value as Grade);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
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
                setShowAllGrades(false);
                setSelectedGrade(grade);
              }}
            >
              내 학년으로
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              약점 주제
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((topic) => (
                  <Badge key={topic} variant="destructive">
                    {topic} (
                    {showAllGrades
                      ? getAllTopicErrorRate(topic, educationLevel)
                      : getTopicErrorRate(topic, educationLevel, selectedGrade)}
                    %)
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">약점 주제가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              강점 주제
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {strongTopics.map((topic) => (
                  <Badge key={topic} variant="default" className="bg-green-500">
                    {topic} (
                    {showAllGrades
                      ? getAllTopicErrorRate(topic, educationLevel)
                      : getTopicErrorRate(topic, educationLevel, selectedGrade)}
                    %)
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">아직 강점 주제가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              최근 학습 주제
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="border-purple-300"
                  >
                    {topic} (
                    {showAllGrades
                      ? getAllTopicLastStudyDate(topic, educationLevel)
                      : getTopicLastStudyDate(
                          topic,
                          educationLevel,
                          selectedGrade
                        )}
                    )
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">최근 학습한 주제가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-orange-500" />
              오랫동안 학습하지 않은 주제
            </CardTitle>
          </CardHeader>
          <CardContent>
            {neglectedTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {neglectedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="outline"
                    className="border-orange-300"
                  >
                    {topic}{" "}
                    {(
                      showAllGrades
                        ? getAllTopicLastStudyDate(topic, educationLevel)
                        : getTopicLastStudyDate(
                            topic,
                            educationLevel,
                            selectedGrade
                          )
                    )
                      ? `(${
                          showAllGrades
                            ? getAllTopicLastStudyDate(topic, educationLevel)
                            : getTopicLastStudyDate(
                                topic,
                                educationLevel,
                                selectedGrade
                              )
                        })`
                      : "(미학습)"}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">모든 주제를 최근에 학습했습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            주제별 오답률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-end gap-2 overflow-x-auto pb-2">
            {topics.map((topic) => {
              const errorRate = showAllGrades
                ? getAllTopicErrorRate(topic, educationLevel)
                : getTopicErrorRate(topic, educationLevel, selectedGrade);
              const height = errorRate ? `${errorRate}%` : "10%";
              return (
                <div
                  key={topic}
                  className="flex flex-col items-center min-w-[60px]"
                >
                  <div
                    className={`w-full rounded-t-sm ${
                      errorRate >= 30
                        ? "bg-red-500"
                        : errorRate <= 10
                        ? "bg-green-500"
                        : "bg-purple-600"
                    }`}
                    style={{ height }}
                  ></div>
                  <div className="text-xs mt-1 text-center truncate w-full">
                    {topic}
                  </div>
                  <div className="text-xs font-medium">{errorRate}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
