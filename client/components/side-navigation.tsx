// components/side-navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calculator,
  Notebook,
  Star,
  Settings,
  Home,
  Calendar,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SideNavigation() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    {
      name: "홈",
      path: "/",
      value: "home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "문제 업로드",
      path: "/problem-uploader",
      value: "problem-uploader",
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      name: "오답 노트",
      path: "/mistake-tracker",
      value: "mistake-tracker",
      icon: <Notebook className="h-5 w-5" />,
    },
    {
      name: "개념 모음",
      path: "/concept-browser",
      value: "concept-browser",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "복습 일정",
      path: "/review-schedule",
      value: "review-schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "설정",
      path: "/settings-page",
      value: "settings-page",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const NavigationContent = () => (
    <ul className="space-y-3">
      {navItems.map((item) => (
        <li key={item.value}>
          <Link
            href={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all text-base shadow-sm
              ${
                pathname === item.path
                  ? "bg-gradient-to-r from-purple-200 to-pink-200 dark:from-blue-800/40 dark:to-purple-800/40 text-purple-700 dark:text-gray-200 scale-105 shadow-lg border-2 border-purple-300 dark:border-gray-600"
                  : "hover:bg-blue-100 dark:hover:bg-gray-800/50 hover:scale-105 text-blue-700 dark:text-blue-300"
              }
            `}
          >
            <span className={`rounded-full p-1 shadow-sm flex items-center justify-center ${
              pathname === item.path
                ? "bg-white/80 dark:bg-gray-800/60" 
                : "bg-white/80 dark:bg-gray-800/40"
            }`}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <nav className="w-full h-full bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700 p-6">
              <NavigationContent />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <nav className="w-56 border-r bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700 p-6 min-h-screen shadow-md">
      <NavigationContent />
    </nav>
  );
}