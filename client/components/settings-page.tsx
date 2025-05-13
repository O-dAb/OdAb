"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import type { EducationLevel, Grade } from "@/components/user-profile"
// Dialog 컴포넌트 추가
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface SettingsPageProps {
  educationLevel: EducationLevel
  grade: Grade
  profileImageUrl?: string
  onProfileUpdate: (level: EducationLevel, grade: Grade) => void
  onProfileImageUpdate?: (imageUrl: string) => void
}

export function SettingsPage({ 
  educationLevel, 
  grade, 
  profileImageUrl = "", 
  onProfileUpdate,
  onProfileImageUpdate 
}: SettingsPageProps) {
  const [level, setLevel] = useState<EducationLevel>(educationLevel)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [darkMode, setDarkMode] = useState(false)
  const [imageUrl, setImageUrl] = useState(profileImageUrl)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // 추가된 useEffect: 컴포넌트 마운트 시 localStorage에서 이미지 URL 불러오기
  useEffect(() => {
    if (profileImageUrl) {
      setImageUrl(profileImageUrl);
      return;
    }
    
    const savedImageUrl = localStorage.getItem("profileImageUrl");
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
      
      // 부모 컴포넌트에도 알림 (선택적)
      if (onProfileImageUpdate) {
        onProfileImageUpdate(savedImageUrl);
      }
    }
  }, [profileImageUrl, onProfileImageUpdate]);

  const handleSaveProfile = async () => {
    try {
      // 백엔드 API 호출
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_grade`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰 추가
        },
        body: JSON.stringify({ grade: parseInt(selectedGrade) }) // 학년을 숫자로 변환
      });
  
      if (!response.ok) {
        throw new Error("학년 정보 업데이트에 실패했습니다");
      }
  
      // 로컬 상태 업데이트
      localStorage.setItem("userProfile", JSON.stringify({ level, grade: selectedGrade }));
      onProfileUpdate(level, selectedGrade);
  
      // 토스트 메시지 대신 모달 표시
      setShowSuccessModal(true);
    } catch (error) {
      console.error("학년 업데이트 에러:", error);
      toast({
        title: "저장 실패",
        description: "학년 정보 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };
  
  // 모달 닫기 핸들러 추가
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleSaveSettings = () => {
    // 설정 저장
    localStorage.setItem(
      "appSettings",
      JSON.stringify({
        darkMode,
      }),
    )

    toast({
      title: "설정이 저장되었습니다",
      description: "앱 설정이 성공적으로 저장되었습니다.",
    })
  }

  const handleResetData = () => {
    // 확인 메시지
    if (confirm("정말로 모든 학습 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 학습 데이터 초기화 (실제로는 더 많은 데이터를 처리해야 함)
      localStorage.removeItem("learningData")

      toast({
        title: "데이터 초기화 완료",
        description: "모든 학습 데이터가 초기화되었습니다.",
      })
    }
  }

  const handleImageClick = () => {
    // 파일 선택 다이얼로그 열기
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    // 이미지 업로드 처리
    setIsUploading(true)
    
    try {
      // FormData 생성
      const formData = new FormData()
      formData.append('file', file)
      
      // 하드코딩된 userId 사용
      const userId = 1
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_img`, {
        method: "PUT",
        body: formData,
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });
  
      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다")
      }
  
      const data = await response.json()
      
      // 디버깅: 서버 응답 구조 확인
      console.log("서버 응답:", data);
      
      // 서버 응답 구조에 따라 이미지 URL 찾기
      let imageUrlFromServer = null;
      
      // 가능한 속성 이름들 확인
      if (data.imageUrl) imageUrlFromServer = data.imageUrl;
      else if (data.profileUrl) imageUrlFromServer = data.profileUrl;
      else if (data.url) imageUrlFromServer = data.url;
      else if (data.image) imageUrlFromServer = data.image;
      else if (data.profileImageUrl) imageUrlFromServer = data.profileImageUrl;
      
      // 응답이 문자열이라면 그대로 사용
      else if (typeof data === 'string') imageUrlFromServer = data;
      
      // 이미지 URL을 찾지 못했다면, 응답 객체의 모든 속성 확인
      else {
        console.log("응답 객체 속성들:", Object.keys(data));
        // 모든 문자열 속성 중에서 URL 형태인 것 찾기
        for (const key in data) {
          if (typeof data[key] === 'string' && 
              (data[key].startsWith('http') || data[key].startsWith('/'))) {
            console.log(`URL로 보이는 속성 발견: ${key} = ${data[key]}`);
            imageUrlFromServer = data[key];
            break;
          }
        }
      }
      
      console.log("찾은 이미지 URL:", imageUrlFromServer);
      
      if (imageUrlFromServer) {
        setImageUrl(imageUrlFromServer);
        
        // localStorage에 저장
        localStorage.setItem("profileImageUrl", imageUrlFromServer);
        
        // 부모 컴포넌트에 알림
        if (onProfileImageUpdate) {
          onProfileImageUpdate(imageUrlFromServer);
        }
        
        toast({
          title: "프로필 이미지 업로드 완료",
          description: "프로필 이미지가 성공적으로 업데이트되었습니다.",
        });
      } else {
        throw new Error("이미지 URL을 찾을 수 없습니다");
      }
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      {/* 성공 확인 모달 */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로필 저장 완료</DialogTitle>
            <DialogDescription>
              프로필 정보가 성공적으로 변경되었습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleCloseSuccessModal}
              className={`${level === "middle" ? "bg-green-500" : "bg-blue-500"} hover:${level === "middle" ? "bg-green-600" : "bg-blue-600"}`}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로필 이미지 카드 */}
      <Card className="border-purple-100">
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <CardTitle>프로필 이미지</CardTitle>
          <CardDescription>프로필 이미지를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center">
          <div 
            className="relative cursor-pointer group" 
            onClick={handleImageClick}
          >
            <Avatar className="w-32 h-32 border-2 border-purple-200">
              <AvatarImage src={imageUrl} alt="프로필 이미지" />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-500">
                {level === "middle" ? "중" : "고"}
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={32} />
            </div>
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            프로필 이미지를 클릭하여 새 이미지를 업로드하세요<br />
            (900KB 이하의 JPG, PNG 파일)
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-100">
        <CardHeader
          className={`${level === "middle" ? "bg-green-50 border-b border-green-100" : "bg-blue-50 border-b border-blue-100"}`}
        >
          <CardTitle>프로필 설정</CardTitle>
          <CardDescription>학습 프로필 정보를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">학교 구분</h3>
            <RadioGroup
              defaultValue={level}
              value={level}
              onValueChange={(value) => setLevel(value as EducationLevel)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="middle" id="middle" className="text-green-500" />
                <Label htmlFor="middle">중학교</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" className="text-blue-500" />
                <Label htmlFor="high">고등학교</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-2">
              중학교 선택 시 녹색, 고등학교 선택 시 파란색 테마로 적용됩니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">학년</h3>
            <Select value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade)}>
              <SelectTrigger className="w-full border-blue-200">
                <SelectValue placeholder="학년 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveProfile} className="w-full bg-blue-400 hover:bg-blue-500">
            프로필 저장
          </Button>
        </CardContent>
      </Card>

      <Card className="border-yellow-100">
        <CardHeader className="bg-yellow-50 border-b border-yellow-100">
          <CardTitle>앱 설정</CardTitle>
          <CardDescription>앱 사용 환경을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">다크 모드</h3>
              <p className="text-sm text-gray-500">어두운 테마로 앱을 사용합니다</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-blue-400" />
          </div>

          <Button onClick={handleSaveSettings} className="w-full bg-yellow-400 hover:bg-yellow-500">
            설정 저장
          </Button>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardHeader className="bg-orange-50 border-b border-orange-100">
          <CardTitle>데이터 관리</CardTitle>
          <CardDescription>학습 데이터를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">데이터 초기화</h3>
            <p className="text-sm text-gray-500">모든 학습 데이터를 초기화합니다. 이 작업은 되돌릴 수 없습니다.</p>
          </div>

          <Button
            variant="outline"
            onClick={handleResetData}
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            데이터 초기화
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}