// app/layout.tsx
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ClientHeader } from "@/components/client-header";
import { ClientSideNav } from "@/components/client-sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "수학 학습 도우미",
  description: "수학 학습을 위한 종합 학습 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col h-screen">
            <ClientHeader />
            <div className="flex flex-1 overflow-hidden">
              <ClientSideNav />
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
