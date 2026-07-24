import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 귀엽고 동글동글한 한국어 구글 폰트 'Jua' 설정
const juaFont = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHERRY - Cherish Math Bar 🍬",
  description: "달콤하고 쉬운 고등학생을 위한 파스텔 솜사탕 수학 학습 코딩 플랫폼",
};

/**
 * [선생님을 위한 가이드]
 * RootLayout: 모든 페이지에 공통으로 적용되는 최상위 레이아웃입니다.
 * - juaFont를 불러와 전체 페이지의 기본 폰트로 설정합니다.
 * - 파스텔 솜사탕 그라데이션 배경과 상단 Header, 하단 Footer를 포함합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={juaFont.variable}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-pastel-pink-light via-pastel-purple-light to-pastel-mint-light antialiased selection:bg-pink-200 selection:text-pink-800">
        {/* 상단 네비게이션 헤더 */}
        <Header />
        
        {/* 각 페이지의 주요 콘텐츠가 들어오는 공간 */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        
        {/* 하단 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
