// app/layout.tsx
"use client";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ClientHeader } from "@/components/client-header";
import { ClientSideNav } from "@/components/client-sidenav";
import { usePathname } from "next/navigation";
import { AuthCheck } from "@/components/auth/auth-check";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // (auth) 그룹 경로 분기 (필요시 /signup 등 추가)
  const isAuthPage = pathname.startsWith("/login");

  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          {isAuthPage ? (
            children
          ) : (
            <AuthCheck>
              <div className="flex flex-col h-screen">
                <ClientHeader />
                <div className="flex flex-1 overflow-hidden">
                  <ClientSideNav />
                  <div className="flex-1 overflow-y-auto">
                    {children}
                  </div>
                </div>
              </div>
            </AuthCheck>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
