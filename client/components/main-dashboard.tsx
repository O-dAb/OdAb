"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MainHeader } from "@/components/main-header"
import { ProblemSolver } from "@/components/problem-solver"
import { MistakeTracker } from "@/components/mistake-tracker"
import { ConceptBrowser } from "@/components/concept-browser"
import { ReviewSchedule } from "@/components/review-schedule"
import { UserProfile, type EducationLevel, type Grade } from "@/components/user-profile"
import { useToast } from "@/hooks/use-toast"
import { SideNavigation } from "@/components/side-navigation"
import { HomePage } from "@/components/home-page"
import { SettingsPage } from "@/components/settings-page"
import { HelpPage } from "@/components/help-page"

export function MainDashboard() {
  // Simplify the navigation options to include only the four main features
  // Update the activeTab initial state if needed
  const [activeTab, setActiveTab] = useState("home")
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("middle")
  const [grade, setGrade] = useState<Grade>("1")
  const [isProfileSet, setIsProfileSet] = useState(false)
  const [userName] = useState("김수학") // Add user name state (removed setUserName as it's not used)
  const { toast } = useToast()

  useEffect(() => {
    // 로컬 스토리지에서 사용자 프로필 확인
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const { level, grade } = JSON.parse(savedProfile)
      setEducationLevel(level)
      setGrade(grade)
      setIsProfileSet(true)
    }
  }, [])

  const handleProfileUpdate = (level: EducationLevel, grade: Grade) => {
    setEducationLevel(level)
    setGrade(grade)
    setIsProfileSet(true)
  }

  return (
    <div className="flex flex-col h-screen">
      <MainHeader
        activeTab={activeTab}
        educationLevel={educationLevel}
        grade={grade}
        userName={userName} // Pass user name to header
      />

      <div className="flex flex-1 overflow-hidden">
        {isProfileSet && <SideNavigation activeTab={activeTab} onTabChange={setActiveTab} />}

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!isProfileSet ? (
            <div className="max-w-md mx-auto">
              <UserProfile onProfileUpdate={handleProfileUpdate} />
            </div>
          ) : (
            // The MainDashboard component will keep only the necessary tabs:
            <Tabs value={activeTab} className="w-full max-w-5xl mx-auto">
              <TabsContent value="home" className="mt-0">
                <HomePage educationLevel={educationLevel} grade={grade} onTabChange={setActiveTab} />
              </TabsContent>

              <TabsContent value="solve" className="mt-0">
                <ProblemSolver educationLevel={educationLevel} grade={grade} />
              </TabsContent>

              <TabsContent value="mistakes" className="mt-0">
                <MistakeTracker educationLevel={educationLevel} grade={grade} />
              </TabsContent>

              <TabsContent value="concepts" className="mt-0">
                <ConceptBrowser educationLevel={educationLevel} grade={grade} />
              </TabsContent>

              <TabsContent value="review" className="mt-0">
                <ReviewSchedule educationLevel={educationLevel} grade={grade} />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsPage educationLevel={educationLevel} grade={grade} onProfileUpdate={handleProfileUpdate} />
              </TabsContent>

              <TabsContent value="help" className="mt-0">
                <HelpPage />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
