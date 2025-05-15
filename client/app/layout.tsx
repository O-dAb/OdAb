// app/layout.tsx
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import AppShell from "@/components/Appshell";

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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`=
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('다크 모드 초기화 오류:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
