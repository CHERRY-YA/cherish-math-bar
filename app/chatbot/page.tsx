"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";
import MathChatbot from "@/components/MathChatbot";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      {/* 상단 메인으로 돌아가기 헤더 */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-purple-500" />
          <span>메인으로 돌아가기</span>
        </Link>

        <span className="text-xs text-slate-400 font-mono">CHERRY Math Bar - AI Tutor Chatbot</span>
      </div>

      {/* 챗봇 타이틀 배너 */}
      <div className="flex flex-col items-center text-center gap-2 bg-white/70 backdrop-blur-md rounded-4xl p-6 shadow-pastel-soft border-2 border-purple-100">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shadow-sm">
          <Bot className="w-4 h-4 text-purple-600 animate-bounce" />
          <span>OPEN_AI_KEY_17 연동 실시간 수학 Q&amp;A</span>
        </div>
        <h1 className="font-jua text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-sky-600 bg-clip-text text-transparent">
          🍒 체리 AI 수학 튜터 챗봇
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          수학 공식, 사차함수 극값 조건, 미적분, 확률 문제 등 궁금한 점을 물어보세요! 체리 선생님이 알기 쉽게 단계별로 가르쳐 드릴게요.
        </p>
      </div>

      {/* 챗봇 컴포넌트 */}
      <MathChatbot />
    </div>
  );
}
