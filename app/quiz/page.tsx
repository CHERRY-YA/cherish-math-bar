"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Heart,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Database,
  Code,
  Flame,
} from "lucide-react";
import {
  IntegralProblem,
  generateRandomIntegralProblem,
} from "@/utils/integralGenerator";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import SqlEditorModal from "@/components/SqlEditorModal";

interface QuizRank {
  id: string;
  nickname: string;
  score: number;
  correct_count: number;
  created_at: string;
}

export default function QuizPage() {
  // 게임 스테이지: 'entry' (닉네임 입력) -> 'playing' (퀴즈 진행) -> 'gameover' (결과 및 랭킹)
  const [stage, setStage] = useState<"entry" | "playing" | "gameover">("entry");
  const [nickname, setNickname] = useState("");

  // 게임 진행 상태
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<IntegralProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // 채점 피드백 상태
  const [evalResult, setEvalResult] = useState<{
    isCorrect: boolean;
    exactValue: string;
    explanation: string;
  } | null>(null);

  // Supabase 랭킹 목록 및 SQL 모달
  const [rankings, setRankings] = useState<QuizRank[]>([]);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // 1. Supabase 랭킹 불러오기 (Top 10)
  const fetchRankings = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from("integral_quiz_ranks")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data) {
        setRankings(data as QuizRank[]);
      }
    } catch {
      // Supabase 랭킹 조회 예외 무시
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  // 2. 게임 시작
  const handleStartGame = () => {
    if (!nickname.trim()) return;
    setStage("playing");
    setCorrectCount(0);
    setWrongCount(0);
    setUserAnswer("");
    setEvalResult(null);
    setCurrentProblem(generateRandomIntegralProblem());
  };

  // 3. 정답 제출 & AI 평가 (OPEN_AI_KEY_17)
  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || isEvaluating || !currentProblem) return;

    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const response = await fetch("/api/integral-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: currentProblem,
          userAnswer: userAnswer.trim(),
        }),
      });

      const data = await response.json();
      setEvalResult(data);

      if (data.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        const newWrong = wrongCount + 1;
        setWrongCount(newWrong);

        // 5번 이상 답을 틀리면 게임 종료!
        if (newWrong >= 5) {
          setTimeout(() => {
            handleGameOver(correctCount * 10, correctCount);
          }, 2500);
          return;
        }
      }
    } catch {
      setEvalResult({
        isCorrect: false,
        exactValue: "오류",
        explanation: "채점 중 네트워크 오류가 발생했습니다.",
      });
      setWrongCount((prev) => prev + 1);
    } finally {
      setIsEvaluating(false);
    }
  };

  // 다음 문제로 넘어가기
  const handleNextProblem = () => {
    setUserAnswer("");
    setEvalResult(null);
    setCurrentProblem(generateRandomIntegralProblem());
  };

  // 4. 게임 종료 및 Supabase 점수 저장
  const handleGameOver = async (finalScore: number, finalCorrect: number) => {
    setStage("gameover");

    if (isSupabaseConfigured() && nickname.trim()) {
      try {
        await supabase.from("integral_quiz_ranks").insert([
          {
            nickname: nickname.trim(),
            score: finalScore,
            correct_count: finalCorrect,
          },
        ]);
        fetchRankings();
      } catch {
        // 저장 오류 무시
      }
    }
  };

  // 게임 재시작
  const handleRestart = () => {
    setStage("entry");
    setNickname("");
  };

  return (
    <div className="flex flex-col gap-8 py-4 max-w-4xl mx-auto w-full">
      {/* 상단 메인으로 돌아가기 헤더 */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-500" />
          <span>메인으로 돌아가기</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsSqlModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-pink-200 font-bold text-xs shadow-sm hover:scale-105 transition-all"
        >
          <Code className="w-3.5 h-3.5 text-emerald-400" />
          <span>SQL 쿼리문</span>
        </button>
      </div>

      {/* 
        ========================================
        STAGE 1: 닉네임 입력 & 게임 시작 화면
        ========================================
      */}
      {stage === "entry" && (
        <div className="flex flex-col gap-8">
          <section className="bg-white/80 backdrop-blur-md rounded-4xl p-8 sm:p-12 shadow-pastel-soft border-2 border-pink-100 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-sky-400 flex items-center justify-center text-white shadow-jelly text-3xl">
              🧮
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>OPEN_AI_KEY_17 연동 AI 정적분 채점</span>
              </div>
              <h1 className="font-jua text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                정적분 퀴즈 챌린지 🏆
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
                2차/3차 다항함수, 지수, 로그, 삼각함수의 정적분 문제를 풀고 <strong>최고 랭킹</strong>에 도전해보세요! <br />
                <strong>기회 5번 (오답 5회 시 종료) | 점수 = 맞힌 횟수 × 10점</strong>
              </p>
            </div>

            {/* 닉네임 입력 및 시작 폼 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartGame();
              }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
            >
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="도전할 닉네임을 입력하세요 (예: 수학왕체리)"
                className="w-full px-5 py-4 rounded-full bg-white border-2 border-pink-200 text-slate-800 font-bold text-sm focus:outline-none focus:border-pink-500 shadow-sm text-center"
                maxLength={12}
                required
              />
              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white font-extrabold text-base shadow-jelly hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shrink-0"
              >
                🎮 퀴즈 시작!
              </button>
            </form>
          </section>

          {/* 리더보드 랭킹표 미리보기 */}
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-pastel-soft border-2 border-pastel-sky/60 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-800">
                  명예의 전당 Top 10 🏆
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {isSupabaseConfigured() ? "Supabase 연동 완료 🟢" : "준비 🟡"}
              </span>
            </div>

            {rankings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rankings.map((rank, idx) => (
                  <div
                    key={rank.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-pastel-pink-light/60 to-purple-50 border border-pink-100 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-white"
                            : idx === 1
                            ? "bg-slate-300 text-slate-800"
                            : idx === 2
                            ? "bg-amber-600 text-white"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 font-jua text-sm">
                        {rank.nickname}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-semibold">{rank.correct_count}문제</span>
                      <span className="font-extrabold text-pink-600 text-sm font-mono">
                        {rank.score}점
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                아직 등록된 랭킹 기록이 없습니다. 첫 번째 랭커에 도전해보세요! 🚀
              </p>
            )}
          </section>
        </div>
      )}

      {/* 
        ========================================
        STAGE 2: 정적분 퀴즈 진행 화면
        ========================================
      */}
      {stage === "playing" && currentProblem && (
        <div className="flex flex-col gap-6">
          
          {/* 상단 닉네임, 생명, 점수 바 */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-pastel-soft border-2 border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                👤
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{nickname}</span>
                <span className="text-[10px] text-pink-500 font-semibold">도전 중!</span>
              </div>
            </div>

            {/* 생명 (남은 기회 5개 하트) */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">남은 기회:</span>
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={`heart-${i}`}
                  className={`w-5 h-5 transition-all ${
                    i < 5 - wrongCount
                      ? "text-pink-500 fill-pink-500 animate-pulse"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* 현재 점수 (맞힌 횟수 * 10점) */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full shadow-sm font-mono text-sm font-extrabold">
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>{correctCount * 10} 점</span>
            </div>
          </div>

          {/* 정적분 문제 카드 */}
          <div className="bg-white/90 backdrop-blur-md rounded-4xl p-8 shadow-pastel-soft border-2 border-pastel-pink flex flex-col items-center text-center gap-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              <span>{currentProblem.categoryLabel}</span>
            </div>

            {/* 문제 수식 디스플레이 */}
            <div className="bg-gradient-to-r from-pastel-pink-light via-purple-50 to-pastel-sky-light rounded-3xl p-8 border-2 border-pink-200 w-full max-w-lg shadow-inner">
              <span className="text-xs text-slate-400 block mb-2 font-mono">구하려는 정적분 값 I:</span>
              <p className="font-jua text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-wide">
                ∫_{currentProblem.lowerBound}^{currentProblem.upperBound} ({currentProblem.expression}) dx
              </p>
            </div>

            {/* 정답 입력 폼 */}
            <form onSubmit={handleSubmitAnswer} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="답 입력 (예: 4, 1/2, 2.5, e-1, pi/2)"
                disabled={isEvaluating || Boolean(evalResult)}
                className="w-full px-5 py-4 rounded-full bg-slate-50 border-2 border-pink-200 text-slate-800 font-bold text-center text-base focus:outline-none focus:border-pink-500 shadow-sm"
                required
              />
              {!evalResult && (
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-sm shadow-jelly hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shrink-0 flex items-center justify-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI 채점 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>제출하기</span>
                    </>
                  )}
                </button>
              )}
            </form>

            {/* AI 채점 결과 카드리프 */}
            {evalResult && (
              <div
                className={`w-full max-w-lg p-6 rounded-3xl text-left border-2 flex flex-col gap-3 animate-fade-in ${
                  evalResult.isCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {evalResult.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                    <span className="font-bold text-base">
                      {evalResult.isCorrect ? "정답입니다! 🎉 (+10점)" : "아쉽네요! 오답입니다 ❌"}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                    정적분 값 = {evalResult.exactValue}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed bg-white/70 p-3 rounded-2xl border border-slate-200/60 font-mono">
                  💡 {evalResult.explanation}
                </p>

                {/* 다음 문제 진행 버튼 */}
                {wrongCount < 5 && (
                  <button
                    type="button"
                    onClick={handleNextProblem}
                    className="mt-2 w-full py-3 rounded-full bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all text-center"
                  >
                    다음 문제 풀기 ➔
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* 
        ========================================
        STAGE 3: 게임 종료 & 리더보드 결과 화면
        ========================================
      */}
      {stage === "gameover" && (
        <div className="flex flex-col gap-8">
          
          <section className="bg-white/90 backdrop-blur-md rounded-4xl p-8 sm:p-12 shadow-pastel-soft border-2 border-pink-200 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-jelly animate-bounce">
              🏆
            </div>

            <div>
              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3.5 py-1 rounded-full">
                GAME OVER
              </span>
              <h2 className="font-jua text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
                {nickname} 님의 퀴즈 결과!
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                기회 5번을 모두 소진하여 게임이 종료되었습니다.
              </p>
            </div>

            {/* 최종 점수 카드 */}
            <div className="bg-gradient-to-r from-pastel-pink-light via-purple-50 to-pastel-sky-light rounded-3xl p-6 border-2 border-pink-200 w-full max-w-sm flex items-center justify-around shadow-sm">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 font-semibold">맞힌 횟수</span>
                <span className="font-jua text-2xl font-bold text-slate-700">{correctCount} 개</span>
              </div>
              <div className="w-px h-10 bg-pink-200" />
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 font-semibold">최종 점수</span>
                <span className="font-jua text-3xl font-extrabold text-pink-600">{correctCount * 10} 점</span>
              </div>
            </div>

            {/* 다시 시도하기 버튼 */}
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-base shadow-jelly hover:scale-105 active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>🔄 다시 도전하기</span>
            </button>
          </section>

          {/* 갱신된 리더보드 랭킹표 */}
          <section className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-pastel-soft border-2 border-pastel-sky/60 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-800">
                  전체 Top 10 순위 랭킹표 🏆
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {isSupabaseConfigured() ? "Supabase 연동 완료 🟢" : "준비 🟡"}
              </span>
            </div>

            {rankings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rankings.map((rank, idx) => (
                  <div
                    key={rank.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-pastel-pink-light/60 to-purple-50 border border-pink-100 text-xs shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-white"
                            : idx === 1
                            ? "bg-slate-300 text-slate-800"
                            : idx === 2
                            ? "bg-amber-600 text-white"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 font-jua text-sm">
                        {rank.nickname}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-semibold">{rank.correct_count}문제</span>
                      <span className="font-extrabold text-pink-600 text-sm font-mono">
                        {rank.score}점
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                랭킹을 로딩 중이거나 아직 등록된 랭킹 기록이 없습니다.
              </p>
            )}
          </section>

        </div>
      )}

      {/* Supabase SQL Editor 모달 */}
      <SqlEditorModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
