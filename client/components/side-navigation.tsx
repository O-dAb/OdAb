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
} from "lucide-react";

export function SideNavigation() {
  const pathname = usePathname();

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

  return (
    <nav className="w-56 border-r bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 dark:border-gray-700 p-6 min-h-screen shadow-md">
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li key={item.value}>
            <Link
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all text-base shadow-sm
                ${
                  pathname === item.path
                    ? "bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 text-purple-700 dark:text-purple-200 scale-105 shadow-lg border-2 border-purple-300 dark:border-purple-700"
                    : "hover:bg-blue-100 dark:hover:bg-blue-900 hover:scale-105 text-blue-700 dark:text-blue-300"
                }
              `}
            >
              <span className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-sm flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
