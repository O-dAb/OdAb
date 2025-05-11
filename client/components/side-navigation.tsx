"use client"
import { Button } from "@/components/ui/button"
import { Calculator, BookOpen, History, Home, Settings, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * 사이드 네비게이션 컴포넌트
 * 앱의 주요 기능으로 이동할 수 있는 사이드바 제공
 */
interface SideNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SideNavigation({ activeTab, onTabChange }: SideNavigationProps) {
  return (
    <div className="h-full bg-blue-50 border-r border-blue-100 w-20 flex flex-col items-center py-6">
      <div className="flex flex-col items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "home" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("home")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">홈</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "solve" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("solve")}
        >
          <Calculator className="h-6 w-6" />
          <span className="text-xs font-medium">문제 풀이</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "mistakes" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("mistakes")}
        >
          <History className="h-6 w-6" />
          <span className="text-xs font-medium">오답 노트</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "concepts" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("concepts")}
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-xs font-medium">개념 학습</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "review" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("review")}
        >
          <Clock className="h-6 w-6" />
          <span className="text-xs font-medium">복습하기</span>
        </Button>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-14 h-14 rounded-xl flex flex-col justify-center items-center gap-1 hover:bg-blue-100",
            activeTab === "settings" && "bg-blue-100 text-blue-500",
          )}
          onClick={() => onTabChange("settings")}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs font-medium">설정</span>
        </Button>
      </div>
    </div>
  )
}
