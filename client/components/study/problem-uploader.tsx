"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ProblemUploaderProps {
  onProblemRecognized: (text: string) => void
}

export function ProblemUploader({ onProblemRecognized }: ProblemUploaderProps) {
  const [manualInput, setManualInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // 실제 구현에서는 여기서 PDF 파일을 처리하고 텍스트를 추출하는 로직이 필요합니다
      setTimeout(() => {
        setIsUploading(false)
        onProblemRecognized("다음 이차방정식을 풀어라: x² - x - 6 = 0")
      }, 1500)
    }
  }

  const handleCameraCapture = () => {
    setIsUploading(true)
    // 실제 구현에서는 여기서 카메라로 캡처한 이미지를 처리하는 로직이 필요합니다
    setTimeout(() => {
      setIsUploading(false)
      onProblemRecognized("다음 이차방정식을 풀어라: x² - x - 6 = 0")
    }, 1500)
  }

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onProblemRecognized(manualInput)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>문제 업로드</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="application/pdf,image/*"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-full cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">PDF/이미지 업로드</span>
              <span className="text-xs text-gray-500 mt-1">클릭하여 파일 선택</span>
            </label>
          </div>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center py-6"
            onClick={handleCameraCapture}
          >
            <Camera className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium">카메라로 촬영</span>
            <span className="text-xs text-gray-500 mt-1">클릭하여 촬영 시작</span>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">직접 입력</div>
          <Textarea
            placeholder="여기에 문제를 직접 입력하세요..."
            className="min-h-[100px]"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          <Button className="w-full" onClick={handleManualSubmit} disabled={!manualInput.trim()}>
            문제 제출
          </Button>
        </div>
      </CardContent>
      <CardFooter className={isUploading ? "block" : "hidden"}>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-purple-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
        <p className="text-sm text-center mt-2">문제 인식 중...</p>
      </CardFooter>
    </Card>
  )
}
