// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import type { EducationLevel, Grade } from "@/components/user-profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  // AuthContext에서 사용자 정보 가져오기
  const { userProfile, updateProfile } = useAuth();
  const { educationLevel, grade } = userProfile;

  const [level, setLevel] = useState<EducationLevel>(educationLevel);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade);
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [imageUrl, setImageUrl] = useState(userProfile.profileUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    // 프로필 이미지 로드
    if (userProfile.profileUrl) {
      setImageUrl(userProfile.profileUrl);
    }

    // 다크 모드 상태 설정
    setDarkMode(theme === 'dark');
  }, [theme, userProfile.profileUrl]);

  const handleSaveProfile = async () => {
    try {
      // API URL 설정 (환경 변수 또는 기본값)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("로그인이 필요합니다");
      }

      // 서버에 학년 정보 업데이트 요청
      const response = await fetch(`${apiUrl}/api/v1/profile_grade`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ grade: parseInt(selectedGrade) }),
      });

      if (!response.ok) {
        throw new Error("학년 정보 업데이트에 실패했습니다");
      }

      // 서버 응답 데이터 받기
      const data = await response.json();

      // Context를 통해 프로필 업데이트
      updateProfile(level, selectedGrade);

      // 모달 표시
      setShowSuccessModal(true);

      toast({
        title: "저장 성공",
        description: "학년 정보가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error("학년 업데이트 에러:", error);
      toast({
        title: "저장 실패",
        description: "학년 정보 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 모달 닫기 핸들러
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // 설정 모달 닫기 핸들러
  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const handleSaveSettings = () => {
    // 테마 설정
    setTheme(darkMode ? "dark" : "light");
    
    // 모달 표시
    setShowSettingsModal(true);
  };

  const handleResetData = () => {
    // 확인 메시지
    if (
      confirm(
        "정말로 모든 학습 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      // 학습 데이터 초기화 (실제로는 더 많은 데이터를 처리해야 함)
      localStorage.removeItem("learningData");

      toast({
        title: "데이터 초기화 완료",
        description: "모든 학습 데이터가 초기화되었습니다.",
      });
    }
  };

  const handleImageClick = () => {
    // 파일 선택 다이얼로그 열기
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 업로드 처리
    setIsUploading(true);

    try {
      // API URL 설정 (환경 변수 또는 기본값)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      // FormData 생성
      const formData = new FormData();
      formData.append("file", file);

      // 저장된 액세스 토큰 사용
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await fetch(`${apiUrl}/api/v1/profile_img`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,  // 이미 저장된 변수 사용
        },
      });

      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다");
      }

      const data = await response.json();

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
      else if (typeof data === "string") imageUrlFromServer = data;
      // 이미지 URL을 찾지 못했다면, 응답 객체의 모든 속성 확인
      else {
        console.log("응답 객체 속성들:", Object.keys(data));
        // 모든 문자열 속성 중에서 URL 형태인 것 찾기
        for (const key in data) {
          if (
            typeof data[key] === "string" &&
            (data[key].startsWith("http") || data[key].startsWith("/"))
          ) {
            console.log(`URL로 보이는 속성 발견: ${key} = ${data[key]}`);
            imageUrlFromServer = data[key];
            break;
          }
        }
      }

      console.log("찾은 이미지 URL:", imageUrlFromServer);

      if (imageUrlFromServer) {
        setImageUrl(imageUrlFromServer);
        // userProfile 업데이트
        updateProfile(level, selectedGrade, imageUrlFromServer);

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
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-pink-950 dark:via-blue-950 dark:to-purple-950 min-h-screen p-6">
      {/* 프로필 성공 확인 모달 */}
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
              className={`${
                level === "middle" ? "bg-green-500" : "bg-blue-500"
              } hover:${level === "middle" ? "bg-green-600" : "bg-blue-600"}`}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 설정 성공 확인 모달 */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>설정 저장 완료</DialogTitle>
            <DialogDescription>
              앱 설정이 성공적으로 변경되었습니다.
              <br />
              {darkMode
                ? " 다크 모드가 활성화되었습니다."
                : " 라이트 모드가 활성화되었습니다."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleCloseSettingsModal}
              className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로필 이미지 카드 */}
      <Card
        id="profile-image"
        className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900"
      >
        <CardHeader className="bg-purple-50/60 dark:bg-purple-950/60 border-b-0 rounded-t-2xl">
          <CardTitle className="dark:text-white">프로필 이미지</CardTitle>
          <CardDescription className="dark:text-gray-300">프로필 이미지를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center">
          <div
            className="relative cursor-pointer group"
            onClick={handleImageClick}
          >
            <Avatar className="w-32 h-32 border-2 border-purple-200 dark:border-purple-700">
              <AvatarImage src={imageUrl} alt="프로필 이미지" />
              <AvatarFallback className="text-2xl bg-purple-100 dark:bg-purple-800 text-purple-500 dark:text-purple-300">
                {level === "middle" ? "중" : "고"}
              </AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={32} />
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-purple-500 border-purple-200 dark:border-t-purple-400 dark:border-purple-700 rounded-full animate-spin"></div>
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

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            프로필 이미지를 클릭하여 새 이미지를 업로드하세요
            <br />
            (900KB 이하의 JPG, PNG 파일)
          </p>
        </CardContent>
      </Card>

      <Card
        id="profile"
        className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 dark:from-blue-900 dark:via-green-900 dark:to-yellow-900"
      >
        <CardHeader
          className={`${
            level === "middle"
              ? "bg-green-50/60 dark:bg-green-950/60 border-b-0 rounded-t-2xl"
              : "bg-blue-50/60 dark:bg-blue-950/60 border-b-0 rounded-t-2xl"
          }`}
        >
          <CardTitle className="dark:text-white">프로필 설정</CardTitle>
          <CardDescription className="dark:text-gray-300">학습 프로필 정보를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-white">학교 구분</h3>
            <RadioGroup
              defaultValue={level}
              value={level}
              onValueChange={(value) => setLevel(value as EducationLevel)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="middle"
                  id="middle"
                  className="text-green-500 dark:text-green-400"
                />
                <Label htmlFor="middle" className="dark:text-gray-300">중학교</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="high"
                  id="high"
                  className="text-blue-500 dark:text-blue-400"
                />
                <Label htmlFor="high" className="dark:text-gray-300">고등학교</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              중학교 선택 시 녹색, 고등학교 선택 시 파란색 테마로 적용됩니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium dark:text-white">학년</h3>
            <Select
              value={selectedGrade}
              onValueChange={(value) => setSelectedGrade(value as Grade)}
            >
              <SelectTrigger className="w-full border-blue-200 dark:border-blue-700">
                <SelectValue placeholder="학년 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl font-bold"
          >
            프로필 저장
          </Button>
        </CardContent>
      </Card>

      <Card
        id="app-settings"
        className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 dark:from-yellow-900 dark:via-pink-900 dark:to-purple-900"
      >
        <CardHeader className="bg-yellow-50/60 dark:bg-yellow-950/60 border-b-0 rounded-t-2xl">
          <CardTitle className="dark:text-white">앱 설정</CardTitle>
          <CardDescription className="dark:text-gray-300">앱 사용 환경을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium dark:text-white">다크 모드</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                어두운 테마로 앱을 사용합니다
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-blue-400 dark:data-[state=checked]:bg-blue-600"
            />
          </div>

          <Button
            onClick={handleSaveSettings}
            className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-xl font-bold"
          >
            설정 저장
          </Button>
        </CardContent>
      </Card>

      <Card
        id="data-management"
        className="border-0 shadow-xl rounded-2xl bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 dark:from-orange-900 dark:via-red-900 dark:to-pink-900"
      >
        <CardHeader className="bg-orange-50/60 dark:bg-orange-950/60 border-b-0 rounded-t-2xl">
          <CardTitle className="dark:text-white">데이터 관리</CardTitle>
          <CardDescription className="dark:text-gray-300">학습 데이터를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium dark:text-white">데이터 초기화</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              모든 학습 데이터를 초기화합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleResetData}
            className="w-full border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/50 rounded-xl font-bold"
          >
            데이터 초기화
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
