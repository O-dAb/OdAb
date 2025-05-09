"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { EducationLevel, Grade } from "@/components/user-profile"

interface SettingsPageProps {
  educationLevel: EducationLevel
  grade: Grade
  onProfileUpdate: (level: EducationLevel, grade: Grade) => void
}

export function SettingsPage({ educationLevel, grade, onProfileUpdate }: SettingsPageProps) {
  const [level, setLevel] = useState<EducationLevel>(educationLevel)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(grade)
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

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
