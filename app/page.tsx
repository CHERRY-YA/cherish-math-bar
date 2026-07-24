"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, LineChart, Bot, Compass, ArrowRight, Heart } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * page.tsx: 메인 페이지입니다.
 * 깔끔한 서비스 소개와 함께 클릭 시 각각의 전용 페이지(/graph, /chatbot)로 이동하는 
 * 2개의 주요 접속 버튼만 명확하게 배치되어 있습니다.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 py-6">
      {/* 
        ========================================
        1. 메인 히어로 섹션 & 2개 핵심 접속 버튼
        ========================================
      */}
      <section className="relative overflow-hidden bg-white/75 backdrop-blur-md rounded-4xl p-8 sm:p-14 shadow-pastel-soft border-2 border-white/80 flex flex-col items-center text-center">
        
        {/* 상단 파스텔 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 border border-pink-200/50 shadow-sm text-xs font-bold text-pink-700 mb-6 hover:scale-105 transition-transform cursor-default">
          <Sparkles className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>Cherish Math Bar - 파스텔 AI 수학 코딩 플랫폼</span>
        </div>

        {/* 메인 헤드라인 타이틀 */}
        <h1 className="font-jua text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 bg-clip-text text-transparent mb-4 leading-tight">
          Cherish Math Bar 🍬
        </h1>

        {/* 서브 설명 문구 */}
        <p className="max-w-2xl text-base sm:text-xl text-slate-600 font-medium leading-relaxed mb-10">
          수학 공식이 어렵고 딱딱하다고 느꼈나요? <br className="hidden sm:block" />
          <span className="text-pink-600 font-bold underline decoration-pink-300 decoration-wavy">
            CHERRY Math Bar
          </span>
          에서 무작위 5개 순서쌍 다항함수를 탐구하고, <strong>체리 AI 수학 챗봇🍒</strong>에게 언제든 질문해보세요!
        </p>

        {/* 
          [핵심 요구사항] 메인 페이지 2개 핵심 접속 버튼
          1. '함수의 그래프 알아보기' (/graph 이동)
          2. '체리 AI 수학 챗봇' (/chatbot 이동)
        */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full max-w-xl justify-center">
          
          {/* 버튼 1: 함수의 그래프 알아보기 */}
          <Link
            href="/graph"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-extrabold text-lg shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <LineChart className="w-6 h-6 text-yellow-300 animate-pulse" />
            <span>📈 함수의 그래프 알아보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 버튼 2: 체리 AI 수학 챗봇 */}
          <Link
            href="/chatbot"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-white text-purple-700 border-2 border-purple-200 font-extrabold text-lg shadow-md hover:bg-purple-50 hover:border-purple-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Bot className="w-6 h-6 text-purple-500 animate-bounce" />
            <span>🍒 체리 AI 수학 챗봇</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </section>

      {/* 
        ========================================
        2. 2개 프로그램 카드 안내 섹션
        ========================================
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 카드 1: 5개 순서쌍 다항함수 시각화 */}
        <Link
          href="/graph"
          className="group rounded-3xl p-8 bg-white/80 backdrop-blur-md border-2 border-pink-200/80 shadow-pastel-soft hover:scale-[1.02] hover:border-pink-400 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                -7 ~ 7 정수 100% 관통
              </span>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-jua text-2xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
              5개 순서쌍 다항함수 탐구 🎯
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              좌표평면에 -7부터 7까지의 정수 순서쌍 5개를 찍고, 해당 점들을 100% 지나는 삼차/사차함수를 실시간으로 시각화하고 Supabase DB에 저장합니다.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-pink-600">
            <span>바로가기 클릭</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 카드 2: 체리 AI 수학 챗봇 */}
        <Link
          href="/chatbot"
          className="group rounded-3xl p-8 bg-white/80 backdrop-blur-md border-2 border-purple-200/80 shadow-pastel-soft hover:scale-[1.02] hover:border-purple-400 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                OPEN_AI_KEY_17 연동
              </span>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-jua text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
              체리 AI 수학 튜터 챗봇 🍒
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              이차함수 꼭짓점, 사차함수 극값 조건, 미적분, 확률 문제 등 무엇이든 질문하면 체리 선생님이 실시간으로 다정하게 답변해 드립니다.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-purple-600">
            <span>질문하러 가기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </section>

      {/* 
        ========================================
        3. 하단 파스텔 안내 카드
        ========================================
      */}
      <section className="bg-gradient-to-r from-pastel-yellow-light via-yellow-50 to-amber-50/50 rounded-3xl p-6 sm:p-8 border-2 border-yellow-200/60 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 text-2xl">
            👩‍🏫
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <span>독립 페이지 구조 안내</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </h3>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              각 기능이 독립된 페이지(<code className="bg-amber-200/50 px-2 py-0.5 rounded-md font-mono text-xs text-amber-950">/graph</code>, <code className="bg-amber-200/50 px-2 py-0.5 rounded-md font-mono text-xs text-amber-950">/chatbot</code>)로 분리되어 더욱 쾌적하고 깔끔하게 이용하실 수 있습니다!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
