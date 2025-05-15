"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

export type EducationLevel = "middle" | "high";
export type Grade = "1" | "2" | "3";

interface UserProfileProps {
  onProfileUpdate: (level: EducationLevel, grade: Grade) => void;
}

export function UserProfile({ onProfileUpdate }: UserProfileProps) {
  const [educationLevel, setEducationLevel] =
    useState<EducationLevel>("middle");
  const [grade, setGrade] = useState<Grade>("1");
  const [isProfileSet, setIsProfileSet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 로컬 스토리지에서 사용자 프로필 불러오기
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const { level, grade } = JSON.parse(savedProfile);
      setEducationLevel(level);
      setGrade(grade);
      setIsProfileSet(true);
      onProfileUpdate(level, grade);
    }
  }, [onProfileUpdate]);

  const handleSaveProfile = () => {
    // 프로필 저장
    localStorage.setItem(
      "userProfile",
      JSON.stringify({ level: educationLevel, grade })
    );
    setIsProfileSet(true);
    onProfileUpdate(educationLevel, grade);

    toast({
      title: "프로필이 저장되었습니다",
      description: `${
        educationLevel === "middle" ? "중학교" : "고등학교"
      } ${grade}학년으로 설정되었습니다.`,
    });
  };

  return (
    <Card className="border-blue-200">
      <CardHeader
        className={`${
          educationLevel === "middle" ? "bg-green-400" : "bg-blue-500"
        } text-white`}
      >
        <CardTitle>내 학습 프로필</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">학교 구분</h3>
            <RadioGroup
              defaultValue={educationLevel}
              value={educationLevel}
              onValueChange={(value) => {
                setEducationLevel(value as EducationLevel);
                // Update the card header color when changing education level
                const header = document.querySelector(".user-profile-header");
                if (header) {
                  header.className =
                    value === "middle" ? "bg-green-500" : "bg-blue-500";
                }
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="middle"
                  id="middle"
                  className="text-green-500"
                />
                <Label htmlFor="middle">중학교</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="high"
                  id="high"
                  className="text-blue-500"
                />
                <Label htmlFor="high">고등학교</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-2">
              중학교 선택 시 녹색, 고등학교 선택 시 파란색 테마로 적용됩니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">학년</h3>
            <Select
              value={grade}
              onValueChange={(value) => setGrade(value as Grade)}
            >
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

          <Button
            onClick={handleSaveProfile}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {isProfileSet ? "프로필 업데이트" : "프로필 저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
