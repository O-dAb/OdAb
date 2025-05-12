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

  const handleSaveProfile = () => {
    // 프로필 저장
    localStorage.setItem("userProfile", JSON.stringify({ level, grade: selectedGrade }))
    onProfileUpdate(level, selectedGrade)

    toast({
      title: "프로필이 저장되었습니다",
      description: `${level === "middle" ? "중학교" : "고등학교"} ${selectedGrade}학년으로 설정되었습니다.`,
    })
  }

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
  
    // 파일 유효성 검사 (기존 코드 유지)
    
    // 이미지 업로드 처리
    setIsUploading(true)
    
    try {
      // 기존 코드 유지 (파일 압축 및 formData 생성)
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_img`, {
        method: "PUT",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
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
        // 이미지 URL을 찾지 못한 경우
        console.error("이미지 URL을 찾을 수 없습니다");
        
        // 임시 방편: 로컬에서 이미지 처리
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          setImageUrl(base64Image);
          localStorage.setItem("profileImageUrl", base64Image);
          
          if (onProfileImageUpdate) {
            onProfileImageUpdate(base64Image);
          }
          
          toast({
            title: "프로필 이미지 설정 (로컬)",
            description: "서버에서 URL을 받지 못해 로컬에 임시 저장했습니다.",
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      
      // 오류 발생 시 로컬에서 이미지 처리 (옵션)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImageUrl(base64Image);
        localStorage.setItem("profileImageUrl", base64Image);
        
        toast({
          title: "프로필 이미지 설정 (로컬)",
          description: "서버 연결에 문제가 있어 로컬에 임시 저장했습니다.",
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }

  // 이미지 압축 함수 추가
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          }, file.type, 0.7); // 0.7은 압축 품질 (70%)
        };
        img.onerror = reject;
        img.src = event.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

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