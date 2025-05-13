"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, FileText, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ProblemUploaderPage() {
  const [manualInput, setManualInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "지원하지 않는 파일 형식",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      toast({
        title: "문제 인식 결과",
        description: manualInput,
        variant: "default",
      });
    }
  };

  const handleImageSubmit = () => {
    if (selectedFile) {
      setIsUploading(true);
      toast({
        title: "이미지 업로드 완료",
        description: selectedFile.name,
        variant: "default",
      });
      setTimeout(() => {
        setIsUploading(false);
        setPreviewImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🦦</span>
        <span className="px-4 py-2 bg-white/80 rounded-full shadow text-brown-700 font-bold text-lg border border-brown-200 animate-bounce">
          수달이: 사진이나 텍스트로 문제를 올려보세요!
        </span>
      </div>
      <Card className="w-full max-w-7xl border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <CardHeader className="bg-blue-50/60 border-b-0 rounded-t-2xl">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-6 w-6 text-purple-500" />
            <span>문제 업로드</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
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
                className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-6 h-full cursor-pointer hover:bg-purple-50 transition-colors shadow"
              >
                <FileText className="h-10 w-10 text-purple-400 mb-2" />
                <span className="text-base font-semibold">이미지 업로드</span>
                <span className="text-xs text-gray-500 mt-1">
                  클릭하여 파일 선택
                </span>
              </label>
            </div>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center py-6 rounded-xl bg-blue-100 hover:bg-blue-200 border-blue-200 shadow"
              onClick={handleCameraCapture}
            >
              <Camera className="h-10 w-10 text-blue-400 mb-2" />
              <span className="text-base font-semibold">카메라로 촬영</span>
              <span className="text-xs text-gray-500 mt-1">
                클릭하여 촬영 시작
              </span>
            </Button>
          </div>

          {previewImage && (
            <div className="space-y-2">
              <div className="text-sm font-medium">선택한 이미지</div>
              <div className="relative">
                <img
                  src={previewImage}
                  alt="문제 이미지"
                  className="w-full h-auto max-h-[300px] object-contain border rounded-xl shadow"
                />
                <Button
                  className="mt-2 bg-purple-500 hover:bg-purple-600 w-full rounded-xl font-bold"
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
    </div>
  );
}
