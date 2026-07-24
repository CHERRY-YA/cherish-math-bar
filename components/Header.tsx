"use client";

import React from "react";
import { Sparkles, Heart, Compass, Bot } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * Header 컴포넌트: 앱 상단의 로고 및 네비게이션 메뉴 영역입니다.
 * 솜사탕 파스텔 컨셉에 맞추어 완전 둥근 버블 알약(rounded-full) 모양으로 디자인되었습니다.
 */
export const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-4 z-50 px-4 max-w-6xl mx-auto w-full">
      <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-pastel-soft border-2 border-pastel-pink/40 flex items-center justify-between transition-all duration-300">
        
        {/* 서비스 로고 영역 */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
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
        </div>

        {/* 네비게이션 메뉴 바 */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-pastel-pink text-pink-700 shadow-sm transition-all hover:scale-105"
          >
            <Heart className="w-4 h-4" />
            <span>홈</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("graph-explorer")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-pastel-pink-light hover:text-pink-600 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>그래프 탐색</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("math-chatbot")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-purple-100 hover:text-purple-700 transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4 text-purple-500" />
            <span>AI 수학 챗봇 🍒</span>
          </button>
        </nav>

        {/* 우측 상단 솜사탕 포인트 버튼 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection("math-chatbot")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pastel-mint-deep to-pastel-sky-deep text-slate-800 font-bold text-xs shadow-jelly-mint hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-bounce" />
            <span>AI 챗봇 질문</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
