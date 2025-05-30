"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import type { EducationLevel, Grade } from "@/components/user-profile"
import { useAuth } from "@/contexts/auth-context"
import axios from "axios"

export function ProfilePage() {
  const { userProfile, updateProfile } = useAuth();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(userProfile.educationLevel)
  const [grade, setGrade] = useState<Grade>(userProfile.grade)
  const [profileImage, setProfileImage] = useState<string | null>(userProfile.profileUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // 사용자 이름과 이메일은 필요하다면 로컬 스토리지나 서버에서 가져옴
    const savedName = localStorage.getItem("nickname")
    if (savedName) setName(savedName)
    
    // AuthContext에서 프로필 정보 업데이트 시 로컬 상태도 업데이트
    setEducationLevel(userProfile.educationLevel)
    setGrade(userProfile.grade)
    setProfileImage(userProfile.profileUrl || null)
  }, [userProfile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 백엔드에 프로필 정보 저장
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_grade`,
        {
          grade: parseInt(grade),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      // 성공적으로 저장되면 AuthContext 업데이트
      updateProfile(educationLevel, grade, profileImage || undefined);

      toast({
        title: "프로필 업데이트 성공",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "프로필 업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 크기 제한 체크 (예: 900KB)
    if (file.size > 900 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "이미지 크기는 900KB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    // 서버에 업로드
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile_img`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      
      // 서버에서 받은 이미지 URL로 상태 업데이트
      const imageUrl = response.data.imageUrl || response.data.profileUrl || response.data.url;
      
      if (imageUrl) {
        // 로컬 상태 업데이트
        setProfileImage(imageUrl);
        
        // AuthContext 업데이트
        updateProfile(educationLevel, grade, imageUrl);
        
        toast({
          title: "프로필 이미지 업로드 성공",
          description: "프로필 이미지가 변경되었습니다.",
        });
      } else {
        throw new Error("이미지 URL을 찾을 수 없습니다");
      }
    } catch (err) {
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-blue-200">
        <CardHeader
          className={`${educationLevel === "middle" ? "bg-green-50 border-b border-green-100" : "bg-blue-50 border-b border-blue-100"}`}
        >
          <CardTitle>내 프로필</CardTitle>
          <CardDescription>프로필 정보를 관리합니다</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-blue-200">
                  <AvatarImage src={profileImage || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-500 text-xl">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-sm text-gray-500">프로필 사진을 변경하려면 클릭하세요</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border-blue-100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={email} readOnly className="border-blue-100 bg-gray-50" />
              <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>학교 구분</Label>
                <RadioGroup
                  value={educationLevel}
                  onValueChange={(value) => setEducationLevel(value as EducationLevel)}
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
              </div>

              <div className="space-y-2">
                <Label>학년</Label>
                <Select value={grade} onValueChange={(value) => setGrade(value as Grade)}>
                  <SelectTrigger className="w-full border-blue-100">
                    <SelectValue placeholder="학년 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1학년</SelectItem>
                    <SelectItem value="2">2학년</SelectItem>
                    <SelectItem value="3">3학년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className={`w-full ${educationLevel === "middle" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={isLoading}
            >
              {isLoading ? "저장 중..." : "프로필 저장"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}