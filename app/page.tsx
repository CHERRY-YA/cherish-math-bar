"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shuffle,
  Save,
  Database,
  Code,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Point,
  FuncType,
  FitResult,
  fitMonicQuartic,
  fitMonicCubic,
  fitExactQuartic,
  generateRandomPoints,
} from "@/utils/mathFitting";
import CoordinateCanvas from "@/components/CoordinateCanvas";
import SqlEditorModal from "@/components/SqlEditorModal";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface GraphRecord {
  id: string;
  title: string;
  func_type: string;
  formula: string;
  points: Point[];
  created_at: string;
}

export default function HomePage() {
  // 1. 초기 무작위 5개 순서쌍 점 생성
  const [points, setPoints] = useState<Point[]>(() => generateRandomPoints(5, -5, 5));
  const [funcType, setFuncType] = useState<FuncType>("monic_quartic");

  // 모달 및 알림 Toast 상태
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Supabase 실시간 저장 데이터 목록
  const [recentRecords, setRecentRecords] = useState<GraphRecord[]>([]);

  // 2. 다항함수 피팅 결과 계산
  const fitResult: FitResult = React.useMemo(() => {
    switch (funcType) {
      case "monic_quartic":
        return fitMonicQuartic(points);
      case "monic_cubic":
        return fitMonicCubic(points);
      case "exact_quartic":
        return fitExactQuartic(points);
      default:
        return fitMonicQuartic(points);
    }
  }, [points, funcType]);

  // 3. Supabase 최근 저장 기록 불러오기
  const fetchRecentRecords = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from("graph_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentRecords(data as GraphRecord[]);
      }
    } catch {
      // Supabase 불러오기 예외 무시
    }
  }, []);

  useEffect(() => {
    fetchRecentRecords();
  }, [fetchRecentRecords]);

  // 무작위 5개 순서쌍 갱신 이벤트
  const handleRandomize = () => {
    setPoints(generateRandomPoints(5, -5, 5));
    setSaveStatus({ type: null, message: "" });
  };

  // 수동 입력 좌표 변경 함수
  const handlePointChange = (index: number, axis: "x" | "y", val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [axis]: num };
    setPoints(newPoints);
  };

  // 4. Supabase DB에 그래프 저장 실행
  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: "" });

    if (!isSupabaseConfigured()) {
      setSaveStatus({
        type: "info",
        message:
          "💡 Supabase 환경 변수가 아직 Vercel/환경 설정에 등록되지 않았습니다. [SQL 쿼리문 보기]에서 테이블을 생성한 후 환경변수를 세팅해 보세요!",
      });
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("graph_records").insert([
        {
          title: `순서쌍 5개 ${fitResult.title}`,
          func_type: fitResult.funcType,
          formula: fitResult.formula,
          points: points,
          coefficients: fitResult.coefficients,
        },
      ]);

      if (error) {
        setSaveStatus({
          type: "error",
          message: `저장 실패: ${error.message} (Supabase SQL Editor에서 쿼리를 먼저 실행했는지 확인해 주세요)`,
        });
      } else {
        setSaveStatus({
          type: "success",
          message: "🎉 Supabase 데이터베이스에 그래프 데이터가 성공적으로 저장되었습니다!",
        });
        fetchRecentRecords();
      }
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: `오류 발생: ${err instanceof Error ? err.message : "알 수 없는 오류"}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* 
        ========================================
        1. 히어로 메인 타이틀 & 상단 조작 버튼
        ========================================
      */}
      <section className="bg-white/70 backdrop-blur-md rounded-4xl p-6 sm:p-10 shadow-pastel-soft border-2 border-white/80 flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Cherish Math Bar - 좌표평면 삼차/사차함수</span>
            </div>
            <h1 className="font-jua text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              무작위 5개 순서쌍 좌표평면 곡선 피팅 📈
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              좌표평면에 5개의 점을 표시하고, 그 점들을 지나는 <strong>최고차항 계수가 1인 삼차/사차함수</strong> 그래프를 실시간으로 그리고 Supabase에 저장해 보세요!
            </p>
          </div>

          {/* 주요 컨트롤 액션 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 무작위 5개 순서쌍 생성 버튼 */}
            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pastel-pink-deep to-pink-500 text-white font-bold text-sm shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Shuffle className="w-4 h-4 animate-spin-slow" />
              <span>🎲 무작위 5개 순서쌍 생성</span>
            </button>

            {/* Supabase SQL 쿼리 보기 버튼 */}
            <button
              type="button"
              onClick={() => setIsSqlModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800 text-pink-200 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>SQL 쿼리문 보기 &amp; 복사</span>
            </button>
          </div>
        </div>

        {/* 
          ========================================
          2. 함수 모드 탭 및 순서쌍 수동 수정 폼
          ========================================
        */}
        <div className="flex flex-col gap-4 bg-pastel-pink-light/60 p-4 sm:p-6 rounded-3xl border border-pink-200/60">
          
          {/* 함수 피팅 모드 선택 버튼 탭 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-pink-500" />
              <span>함수 모드 선택:</span>
            </span>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFuncType("monic_quartic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "monic_quartic"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-pink-100"
                }`}
              >
                ✨ 최고차항 계수 1 (사차함수)
              </button>

              <button
                type="button"
                onClick={() => setFuncType("monic_cubic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "monic_cubic"
                    ? "bg-gradient-to-r from-purple-500 to-sky-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-purple-100"
                }`}
              >
                🔮 최고차항 계수 1 (삼차함수)
              </button>

              <button
                type="button"
                onClick={() => setFuncType("exact_quartic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "exact_quartic"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-sky-100"
                }`}
              >
                🎯 5개 점 전용 (일반 4차 다항식)
              </button>
            </div>
          </div>

          {/* 5개 순서쌍 점 좌표 수동 편집기 */}
          <div className="flex flex-col gap-2 pt-2 border-t border-pink-200/50">
            <span className="text-xs font-semibold text-slate-500">
              ✏️ 순서쌍 좌표 수동 변경 (-8 ~ +8 권장):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {points.map((p, idx) => (
                <div
                  key={`point-input-${idx}`}
                  className="bg-white rounded-2xl p-2.5 shadow-sm border border-pink-100 flex items-center justify-between gap-1 text-xs"
                >
                  <span className="font-bold text-pink-600 font-mono">P{idx + 1}</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>(</span>
                    <input
                      type="number"
                      value={p.x}
                      onChange={(e) => handlePointChange(idx, "x", e.target.value)}
                      className="w-8 text-center bg-slate-100 rounded-md font-bold text-slate-700 p-0.5"
                    />
                    <span>,</span>
                    <input
                      type="number"
                      value={p.y}
                      onChange={(e) => handlePointChange(idx, "y", e.target.value)}
                      className="w-8 text-center bg-pink-50 rounded-md font-bold text-pink-700 p-0.5"
                    />
                    <span>)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 
        ========================================
        3. 좌표평면 시각화 & 결과 카드 섹션
        ========================================
      */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 좌측: SVG 기반 좌표평면 그래프 캔버스 (7열) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <CoordinateCanvas points={points} fitResult={fitResult} />
        </div>

        {/* 우측: 도출 수식 카드 & Supabase DB 저장 버튼 (5열) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 수식 해석 결과 카드 */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-pastel-soft border-2 border-pastel-mint/60 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pastel-mint flex items-center justify-center text-emerald-700">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">
                도출된 함수 방정식 📐
              </h3>
            </div>

            {/* 수식 표시 카드 */}
            <div className="bg-gradient-to-r from-pastel-pink-light via-purple-50 to-pastel-sky-light rounded-2xl p-4 border border-pink-200 text-center">
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                [{fitResult.title}]
              </span>
              <p className="font-jua text-xl sm:text-2xl font-extrabold text-slate-800 tracking-wide break-words">
                {fitResult.formula}
              </p>
            </div>

            {/* Supabase DB 저장 버튼 */}
            <button
              type="button"
              onClick={handleSaveToSupabase}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 text-white font-bold text-sm shadow-jelly-mint hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Supabase에 저장 중..." : "💾 Supabase DB에 그래프 저장하기"}</span>
            </button>

            {/* 저장 상태 피드백 Toast */}
            {saveStatus.message && (
              <div
                className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2 ${
                  saveStatus.type === "success"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : saveStatus.type === "error"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {saveStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>{saveStatus.message}</span>
              </div>
            )}
          </div>

          {/* 최근 Supabase 저장 기록 리스트 */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-pastel-soft border-2 border-pastel-sky/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-500" />
                <h4 className="font-bold text-sm text-slate-700">
                  최근 저장된 그래프 (Supabase DB)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isSupabaseConfigured() ? "연동 완료 🟢" : "환경변수 준비 🟡"}
              </span>
            </div>

            {recentRecords.length > 0 ? (
              <div className="flex flex-col gap-2">
                {recentRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-2xl bg-pastel-sky-light/80 border border-sky-200 flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">{rec.title}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rec.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="font-jua text-pink-600">{rec.formula}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                {isSupabaseConfigured()
                  ? "아직 저장된 그래프가 없습니다. 위 [Supabase DB에 저장하기]를 눌러보세요!"
                  : "Supabase 연동 후 첫 저장 기록이 여기에 표시됩니다."}
              </p>
            )}
          </div>

        </div>

      </section>

      {/* Supabase SQL Editor 실행 모달 */}
      <SqlEditorModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
