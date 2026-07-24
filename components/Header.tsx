"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Compass, Bot, Sparkles } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * Header 컴포넌트: 앱 상단의 로고 및 네비게이션 메뉴 영역입니다.
 * next/link의 Link 컴포넌트를 사용하여 페이지 간 전환이 빠르게 이루어집니다.
 */
export const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 px-4 max-w-6xl mx-auto w-full">
      <div className="bg-white/85 backdrop-blur-md rounded-full px-6 py-3 shadow-pastel-soft border-2 border-pastel-pink/40 flex items-center justify-between transition-all duration-300">
        
        {/* 서비스 로고 영역 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pastel-pink-deep to-pastel-pink flex items-center justify-center shadow-jelly group-hover:scale-110 transition-transform duration-200">
            <span className="text-xl">🍒</span>
          </div>
          <div className="flex flex-col">
            <span className="font-jua text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 bg-clip-text text-transparent group-hover:opacity-90">
              CHERRY
            </span>
            <span className="text-[10px] tracking-wider text-pink-400 font-semibold uppercase -mt-1">
              Math Bar
            </span>
          </div>
        </Link>

        {/* 네비게이션 메뉴 바 */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 ${
              pathname === "/"
                ? "bg-pastel-pink text-pink-700 shadow-sm"
                : "text-slate-600 hover:bg-pastel-pink-light hover:text-pink-600"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>홈</span>
          </Link>

          <Link
            href="/graph"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 ${
              pathname === "/graph"
                ? "bg-pink-100 text-pink-700 shadow-sm"
                : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
            }`}
          >
            <Compass className="w-4 h-4 text-pink-500" />
            <span>함수 그래프</span>
          </Link>

          <Link
            href="/chatbot"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 ${
              pathname === "/chatbot"
                ? "bg-purple-100 text-purple-700 shadow-sm"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <Bot className="w-4 h-4 text-purple-500" />
            <span>AI 수학 챗봇</span>
          </Link>
        </nav>

        {/* 우측 상단 솜사탕 포인트 버튼 */}
        <div className="flex items-center gap-2">
          <Link
            href="/chatbot"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pastel-mint-deep to-pastel-sky-deep text-slate-800 font-bold text-xs shadow-jelly-mint hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-bounce" />
            <span>AI 질문하기</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
