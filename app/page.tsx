"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, LineChart, Bot, Compass, ArrowRight, Heart, Calculator, Trophy } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * page.tsx: 메인 페이지입니다.
 * 깔끔한 서비스 소개와 함께 각 기능 전용 페이지(/graph, /quiz, /chatbot)로 이동하는 
 * 접속 버튼들이 명확하게 배치되어 있습니다.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 py-6">
      {/* 
        ========================================
        1. 메인 히어로 섹션 & 주요 접속 버튼
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
          에서 무작위 다항함수 그래프 탐구, <strong>정적분 퀴즈 챌린지🧮</strong>, <strong>체리 AI 수학 챗봇🍒</strong>을 즐겨보세요!
        </p>

        {/* 
          메인 페이지 주요 접속 버튼 그룹
        */}
        <div className="flex flex-wrap items-center gap-4 w-full max-w-2xl justify-center">
          
          {/* 버튼 1: 함수의 그래프 알아보기 */}
          <Link
            href="/graph"
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-base shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <LineChart className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>📈 함수의 그래프 알아보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 버튼 2: 정적분 퀴즈 챌린지 */}
          <Link
            href="/quiz"
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold text-base shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Calculator className="w-5 h-5 text-yellow-100" />
            <span>🧮 정적분 퀴즈 챌린지</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 버튼 3: 체리 AI 수학 챗봇 */}
          <Link
            href="/chatbot"
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-white text-purple-700 border-2 border-purple-200 font-extrabold text-base shadow-md hover:bg-purple-50 hover:border-purple-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Bot className="w-5 h-5 text-purple-500" />
            <span>🍒 AI 수학 챗봇</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </section>

      {/* 
        ========================================
        2. 3개 프로그램 카드 안내 섹션
        ========================================
      */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 카드 1: 5개 순서쌍 다항함수 시각화 */}
        <Link
          href="/graph"
          className="group rounded-3xl p-7 bg-white/80 backdrop-blur-md border-2 border-pink-200/80 shadow-pastel-soft hover:scale-[1.02] hover:border-pink-400 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs">
                -7 ~ 7 정수 100% 관통
              </span>
              <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-jua text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
              5개 순서쌍 다항함수 탐구 🎯
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              좌표평면에 5개 점을 찍고, 100% 관통하는 4차 다항함수를 실시간으로 시각화하고 Supabase DB에 저장합니다.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-pink-600">
            <span>바로가기 클릭</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 카드 2: 정적분 퀴즈 챌린지 */}
        <Link
          href="/quiz"
          className="group rounded-3xl p-7 bg-white/80 backdrop-blur-md border-2 border-amber-200/80 shadow-pastel-soft hover:scale-[1.02] hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                OPEN_AI_KEY_17 연동
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-jua text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
              정적분 퀴즈 챌린지 🧮
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              2차/3차 다항함수, 지수, 로그, 삼각함수 정적분 퀴즈를 풀고 생명 5개로 맞힌 횟수×10점 랭킹에 도전하세요!
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-amber-600">
            <span>퀴즈 도전하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 카드 3: 체리 AI 수학 챗봇 */}
        <Link
          href="/chatbot"
          className="group rounded-3xl p-7 bg-white/80 backdrop-blur-md border-2 border-purple-200/80 shadow-pastel-soft hover:scale-[1.02] hover:border-purple-400 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                AI 1:1 Q&amp;A
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-jua text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
              체리 AI 수학 튜터 챗봇 🍒
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              이차함수 꼭짓점, 사차함수 극값 조건, 미적분, 확률 문제 등 무엇이든 질문하면 체리 선생님이 답변해 드립니다.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-purple-600">
            <span>질문하러 가기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </section>

      {/* 
        ========================================
        3. 하단 안내 카드
        ========================================
      */}
      <section className="bg-gradient-to-r from-pastel-yellow-light via-yellow-50 to-amber-50/50 rounded-3xl p-6 sm:p-8 border-2 border-yellow-200/60 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 text-2xl">
            👩‍🏫
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <span>Cherish Math Bar 세가지 전용 프로그램</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </h3>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              함수 그래프 탐구(<code className="bg-amber-200/50 px-2 py-0.5 rounded-md font-mono text-xs text-amber-950">/graph</code>), 정적분 퀴즈(<code className="bg-amber-200/50 px-2 py-0.5 rounded-md font-mono text-xs text-amber-950">/quiz</code>), AI 챗봇(<code className="bg-amber-200/50 px-2 py-0.5 rounded-md font-mono text-xs text-amber-950">/chatbot</code>) 독립 라우트로 언제든 자유롭게 학습하실 수 있습니다!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
