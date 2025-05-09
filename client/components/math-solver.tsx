"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, BookOpen, History, PenLine } from "lucide-react"

export function MathSolver() {
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState("")

  const handleSolve = () => {
    // 실제 구현에서는 여기에 수학 문제 해결 로직이 들어갑니다
    setSolution(`문제: ${problem}\n\n해결 과정:\n1. 문제 분석\n2. 공식 적용\n3. 계산 수행\n\n답: 계산된 결과`)
  }

  return (
    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>계산기</span>
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>공식집</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>기록</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            <span>노트</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>문제 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="여기에 수학 문제를 입력하세요..."
                className="min-h-[120px] mb-4"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleSolve}>문제 해결하기</Button>
              </div>
            </CardContent>
          </Card>

          {solution && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>해결 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line bg-gray-50 p-4 rounded-md">
                  {solution}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>수학 공식집</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">대수학</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>이차방정식: $ax^2 + bx + c = 0$</li>
                      <li>근의 공식: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">기하학</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>원의 넓이: $A = \pi r^2$</li>
                      <li>삼각형 넓이: $A = \frac{1}{2} \times b \times h$</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>문제 해결 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">아직 해결한 문제가 없습니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>학습 노트</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="여기에 학습 노트를 작성하세요..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2">초기화</Button>
                <Button>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
