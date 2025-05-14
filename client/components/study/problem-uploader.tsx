"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, FileText, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ProblemUploaderProps {
  onProblemRecognized: (text: string, imageData?: File) => void
}

export function ProblemUploader({ onProblemRecognized }: ProblemUploaderProps) {
  const [manualInput, setManualInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        toast({
          title: "지원하지 않는 파일 형식",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      
      // 이미지 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // 카메라 기능은 파일 선택 다이얼로그를 통해 처리
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onProblemRecognized(manualInput)
    }
  }

  const handleImageSubmit = () => {
    if (selectedFile) {
      setIsUploading(true)
      
      // 이미지와 함께 API 호출
      onProblemRecognized("", selectedFile)
      
      // 업로드 후 상태 초기화 (비동기 처리를 위해 setTimeout 사용)
      setTimeout(() => {
        setIsUploading(false)
        setPreviewImage(null)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 1000)
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
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-full cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">이미지 업로드</span>
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

        {previewImage && (
          <div className="space-y-2">
            <div className="text-sm font-medium">선택한 이미지</div>
            <div className="relative">
              <img 
                src={previewImage} 
                alt="문제 이미지" 
                className="w-full h-auto max-h-[300px] object-contain border rounded-md"
              />
              <Button 
                className="mt-2 bg-blue-500 hover:bg-blue-600 w-full"
                onClick={handleImageSubmit}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                이미지 분석하기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {isUploading && (
        <CardFooter>
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-sm text-center mt-2">문제 인식 중...</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
