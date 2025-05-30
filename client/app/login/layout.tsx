"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className + " min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"}>
      {children}
    </div>
  );
}
