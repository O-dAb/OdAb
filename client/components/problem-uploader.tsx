"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/**
 * 문제 업로더 컴포넌트
 * 사용자가 이미지 파일을 업로드하여 문제를 인식할 수 있도록 함
 */
interface ProblemUploaderProps {
  onProblemRecognized: (text: string, file?: File) => void
}

export function ProblemUploader({ onProblemRecognized }: ProblemUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    
    // 이미지 파일 유효성 검사
    if (!file.type.startsWith("image/")) {
      toast({
        title: "이미지 파일만 업로드할 수 있습니다",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "파일을 선택해주세요",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // 이미지 파일과 인식된 텍스트를 함께 전달
      onProblemRecognized("", selectedFile)
    } catch (error) {
      console.error("Error during file upload:", error)
      toast({
        title: "파일 업로드 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-300 rounded-lg p-6 bg-yellow-50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />
            {previewImage ? (
              <div className="w-full">
                <div className="relative aspect-video mx-auto max-w-lg">
                  <img src={previewImage} alt="미리보기" className="object-contain w-full h-full rounded-md" />
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    className="bg-yellow-400 hover:bg-yellow-500 mr-2"
                    onClick={handleButtonClick}
                    disabled={isLoading}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    새 파일 선택
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleUpload}
                    disabled={isLoading}
                  >
                    {isLoading ? "인식 중..." : "문제 인식"}
                    <FileUp className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="h-12 w-12 text-yellow-500 mb-4" />
                <div className="text-center space-y-2">
                  <p className="text-gray-700 font-medium">수학 문제가 포함된 이미지를 업로드하세요</p>
                  <p className="text-sm text-gray-500">PNG, JPG 파일을 지원합니다</p>
                </div>
                <Button className="mt-4 bg-yellow-400 hover:bg-yellow-500" onClick={handleButtonClick}>
                  파일 선택
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
