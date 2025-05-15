"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, History, Clock, BarChart2 } from "lucide-react";

export function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">도움말</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-blue-100">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
          >
            프로그램 소개
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
          >
            기능 안내
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
          >
            자주 묻는 질문
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card className="border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle>수학 도우미 소개</CardTitle>
              <CardDescription>
                수학 학습을 도와주는 맞춤형 학습 도우미입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">수학 도우미란?</h3>
                <p>
                  수학 도우미는 중학생과 고등학생을 위한 맞춤형 수학 학습 도우미
                  프로그램입니다. 문제 풀이, 개념 학습, 오답 노트, 복습 일정
                  관리 등 다양한 기능을 제공하여 효율적인 수학 학습을
                  도와줍니다.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">주요 특징</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>단계별 문제 풀이 가이드</li>
                  <li>개인 맞춤형 학습 추천</li>
                  <li>오답 분석 및 약점 주제 파악</li>
                  <li>효과적인 복습 일정 관리</li>
                  <li>학습 통계 및 진도 관리</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">대상 학년</h3>
                <p>
                  중학교 1-3학년과 고등학교 1-3학년 학생들을 위한 교육과정에
                  맞춘 수학 학습 콘텐츠를 제공합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-0">
          <div className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle>문제 풀이</CardTitle>
                  <CardDescription>단계별 문제 풀이 가이드</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  문제 풀이 기능은 수학 문제를 단계별로 해결하는 과정을
                  안내합니다. 문제를 업로드하거나 개념을 선택하여 관련 문제를
                  풀어볼 수 있습니다.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>문제 업로드 (사진, 텍스트)</li>
                    <li>단계별 풀이 가이드</li>
                    <li>힌트 제공</li>
                    <li>직접 풀어보기 모드</li>
                    <li>난이도별 문제 선택</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-100">
              <CardHeader className="bg-yellow-50 border-b border-yellow-100 flex flex-row items-center gap-2">
                <BookOpen className="h-5 w-5 text-yellow-500" />
                <div>
                  <CardTitle>개념 학습</CardTitle>
                  <CardDescription>수학 개념 및 공식 학습</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  개념 학습 기능은 수학 교육과정에 맞는 개념과 공식을
                  제공합니다. 중학교와 고등학교 교육과정에 맞춘 다양한 개념을
                  학습할 수 있습니다.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>교육과정별 개념 분류</li>
                    <li>개념 설명 및 공식 제공</li>
                    <li>예시 문제 제공</li>
                    <li>개념 검색 기능</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader className="bg-orange-50 border-b border-orange-100 flex flex-row items-center gap-2">
                <History className="h-5 w-5 text-orange-500" />
                <div>
                  <CardTitle>오답 노트</CardTitle>
                  <CardDescription>오답 분석 및 약점 주제 파악</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  오답 노트 기능은 틀린 문제를 분석하고 약점 주제를 파악하여
                  효과적인 학습 방향을 제시합니다.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>오답 기록 및 분석</li>
                    <li>약점 주제 파악</li>
                    <li>주제별 오답률 통계</li>
                    <li>오답 문제 다시 풀기</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="bg-green-50 border-b border-green-100 flex flex-row items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <CardTitle>복습하기</CardTitle>
                  <CardDescription>효과적인 복습 일정 관리</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  복습하기 기능은 에빙하우스의 망각 곡선을 기반으로 효과적인
                  복습 일정을 관리해줍니다.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>복습 일정 자동 생성</li>
                    <li>단계별 복습 관리 (1일차, 3일차, 6일차, 14일차)</li>
                    <li>주제별 마지막 학습일 확인</li>
                    <li>복습 문제 제공</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle>학습 통계</CardTitle>
                  <CardDescription>학습 진도 및 성취도 분석</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  학습 통계 기능은 학습 진도와 성취도를 분석하여 효과적인 학습
                  계획을 세울 수 있도록 도와줍니다.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>주제별 학습 현황</li>
                    <li>강점 및 약점 주제 분석</li>
                    <li>학습 시간 및 문제 풀이 통계</li>
                    <li>학습 추천</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-0">
          <Card className="border-blue-100">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle>자주 묻는 질문</CardTitle>
              <CardDescription>
                수학 도우미 사용 중 자주 묻는 질문과 답변입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">
                  Q: 학년과 학교 구분은 어떻게 변경하나요?
                </h3>
                <p className="text-sm">
                  A: 설정 메뉴에서 프로필 설정을 통해 학년과 학교 구분을 변경할
                  수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Q: 문제 업로드는 어떻게 하나요?</h3>
                <p className="text-sm">
                  A: 문제 풀이 탭에서 '문제 업로드' 버튼을 클릭하여 사진
                  촬영이나 파일 업로드, 또는 직접 입력을 통해 문제를 업로드할 수
                  있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">
                  Q: 오답 노트는 어떻게 활용하나요?
                </h3>
                <p className="text-sm">
                  A: 오답 노트에서는 틀린 문제들을 주제별, 최근 학습순, 약점
                  주제별로 확인하고 다시 풀어볼 수 있습니다. 약점 주제를
                  중점적으로 학습하면 효과적인 학습이 가능합니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">
                  Q: 복습 일정은 어떻게 생성되나요?
                </h3>
                <p className="text-sm">
                  A: 에빙하우스의 망각 곡선을 기반으로 학습한 내용을 1일차,
                  3일차, 6일차, 14일차에 복습할 수 있도록 자동으로 일정이
                  생성됩니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">
                  Q: 데이터 초기화는 어떤 정보를 삭제하나요?
                </h3>
                <p className="text-sm">
                  A: 데이터 초기화는 학습 기록, 오답 노트, 복습 일정 등 모든
                  학습 관련 데이터를 삭제합니다. 프로필 정보는 유지됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
