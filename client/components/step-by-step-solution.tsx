"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Eye } from "lucide-react"

interface StepByStepSolutionProps {
  steps: string[]
  currentStep: number
  showAllSteps: boolean
  onNextStep: () => void
  onShowAllSteps: () => void
}

export function StepByStepSolution({
  steps,
  currentStep,
  showAllSteps,
  onNextStep,
  onShowAllSteps,
}: StepByStepSolutionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>단계별 풀이</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showAllSteps
            ? steps.map((step, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium text-sm text-purple-700 mb-1">{index + 1}단계</div>
                  <div>{step}</div>
                </div>
              ))
            : steps.slice(0, currentStep + 1).map((step, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium text-sm text-purple-700 mb-1">{index + 1}단계</div>
                  <div>{step}</div>
                </div>
              ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showAllSteps && currentStep < steps.length - 1 && (
          <>
            <Button onClick={onNextStep} className="flex items-center gap-2">
              다음 단계 <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onShowAllSteps} className="flex items-center gap-2">
              모든 단계 보기 <Eye className="h-4 w-4" />
            </Button>
          </>
        )}
        {!showAllSteps && currentStep === steps.length - 1 && (
          <Button variant="outline" onClick={onShowAllSteps} className="flex items-center gap-2">
            모든 단계 보기 <Eye className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
