"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Shuffle,
  Save,
  Database,
  Code,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  ArrowLeft,
} from "lucide-react";
import {
  Point,
  FuncType,
  FitResult,
  fitExactQuartic,
  fitGeneralCubic,
  fitMonicQuartic,
  generateRandomPoints,
  clampCoordinate,
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

export default function GraphPage() {
  // 1. 무작위 5개 순서쌍 점 생성 (-7 ~ 7 정수 범위 제한)
  const [points, setPoints] = useState<Point[]>(() => generateRandomPoints(5, -7, 7));
  const [funcType, setFuncType] = useState<FuncType>("exact_quartic");

  // 모달 및 저장 피드백 Toast 상태
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Supabase 실시간 저장 데이터 목록
  const [recentRecords, setRecentRecords] = useState<GraphRecord[]>([]);

  // 2. 선택된 함수 모드에 따른 다항함수 피팅 (5개 점 100% 완벽 관통)
  const fitResult: FitResult = React.useMemo(() => {
    switch (funcType) {
      case "exact_quartic":
        return fitExactQuartic(points);
      case "general_cubic":
        return fitGeneralCubic(points);
      case "monic_quartic":
        return fitMonicQuartic(points);
      default:
        return fitExactQuartic(points);
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
      // Supabase 조회 예외 무시
    }
  }, []);

  useEffect(() => {
    fetchRecentRecords();
  }, [fetchRecentRecords]);

  // 무작위 5개 순서쌍 점 갱신 (-7 ~ 7 정수)
  const handleRandomize = () => {
    setPoints(generateRandomPoints(5, -7, 7));
    setSaveStatus({ type: null, message: "" });
  };

  // 수동 좌표 수정 함수 (-7 ~ 7 클램핑 검증)
  const handlePointChange = (index: number, axis: "x" | "y", val: string) => {
    const rawNum = parseInt(val, 10);
    if (isNaN(rawNum)) return;
    const clampedNum = clampCoordinate(rawNum);

    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [axis]: clampedNum };
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
          "💡 Supabase 환경 변수가 아직 Vercel/환경 설정에 등록되지 않았습니다. 상단 [SQL 쿼리문 보기]에서 테이블을 생성하신 후 환경변수를 연동해 주세요!",
      });
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("graph_records").insert([
        {
          title: `[-7,7 정수] 5개 점 관통 ${fitResult.title}`,
          func_type: fitResult.funcType,
          formula: fitResult.formula,
          points: points,
          coefficients: fitResult.coefficients,
        },
      ]);

      if (error) {
        setSaveStatus({
          type: "error",
          message: `저장 실패: ${error.message} (Supabase SQL Editor에서 쿼리를 실행했는지 확인해 주세요)`,
        });
      } else {
        setSaveStatus({
          type: "success",
          message: "🎉 5개 점(-7~7 정수)을 통과하는 다항함수가 Supabase DB에 성공적으로 저장되었습니다!",
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
      {/* 상단 메인으로 돌아가기 뒤로가기 헤더 */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-500" />
          <span>메인으로 돌아가기</span>
        </Link>

        <span className="text-xs text-slate-400 font-mono">CHERRY Math Bar - Graph Explorer</span>
      </div>

      {/* 헤더 컨트롤 영역 */}
      <section className="bg-white/80 backdrop-blur-md rounded-4xl p-6 sm:p-10 shadow-pastel-soft border-2 border-pink-100 flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 shadow-sm">
              <Target className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>-7 ~ 7 정수 좌표 100% 관통 프로그램</span>
            </div>
            <h1 className="font-jua text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
              5개 순서쌍 관통 삼차/사차함수 탐구 🎯
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              <strong>x, y 좌표는 -7부터 7까지 정수만 가능</strong>합니다. 5개 점을 무작위로 생성하거나 직접 입력해 보세요!
            </p>
          </div>

          {/* 주요 액션 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pastel-pink-deep to-pink-500 text-white font-bold text-sm shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Shuffle className="w-4 h-4" />
              <span>🎲 무작위 5개 순서쌍 생성 (-7~7)</span>
            </button>

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

        {/* 함수 모드 탭 & 순서쌍 수동 입력폼 */}
        <div className="flex flex-col gap-4 bg-pastel-pink-light/60 p-4 sm:p-6 rounded-3xl border border-pink-200/60">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-pink-500" />
              <span>함수 모델 선택:</span>
            </span>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFuncType("exact_quartic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "exact_quartic"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md ring-2 ring-pink-300"
                    : "bg-white text-slate-600 hover:bg-pink-100"
                }`}
              >
                🎯 5개 점 100% 관통 (4차함수)
              </button>

              <button
                type="button"
                onClick={() => setFuncType("general_cubic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "general_cubic"
                    ? "bg-gradient-to-r from-purple-500 to-sky-500 text-white shadow-md ring-2 ring-purple-300"
                    : "bg-white text-slate-600 hover:bg-purple-100"
                }`}
              >
                🔮 일반 삼차함수 (a x³ + b x² + c x + d)
              </button>

              <button
                type="button"
                onClick={() => setFuncType("monic_quartic")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${
                  funcType === "monic_quartic"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-sky-100"
                }`}
              >
                ✨ 최고차항 계수 1 (사차함수)
              </button>
            </div>
          </div>

          {/* 5개 순서쌍 점 좌표 수동 편집기 (범위: -7 ~ 7 정수) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-pink-200/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                ✏️ 5개 점 좌표 설정 <strong className="text-pink-600">(-7에서 7까지 정수만 가능)</strong>:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">min: -7 / max: 7</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                      min="-7"
                      max="7"
                      step="1"
                      value={p.x}
                      onChange={(e) => handlePointChange(idx, "x", e.target.value)}
                      className="w-9 text-center bg-slate-100 rounded-md font-bold text-slate-700 p-0.5 focus:ring-2 focus:ring-pink-300 outline-none"
                    />
                    <span>,</span>
                    <input
                      type="number"
                      min="-7"
                      max="7"
                      step="1"
                      value={p.y}
                      onChange={(e) => handlePointChange(idx, "y", e.target.value)}
                      className="w-9 text-center bg-pink-50 rounded-md font-bold text-pink-700 p-0.5 focus:ring-2 focus:ring-pink-300 outline-none"
                    />
                    <span>)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 시각화 및 결과 카드 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 좌측: SVG 기반 좌표평면 (7열) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <CoordinateCanvas points={points} fitResult={fitResult} />
        </div>

        {/* 우측: 수식 결과 & Supabase DB 저장 (5열) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-pastel-soft border-2 border-pastel-mint/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pastel-mint flex items-center justify-center text-emerald-700">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  도출된 다항함수 수식 📐
                </h3>
              </div>
              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                -7 ~ 7 정수 100% 관통
              </span>
            </div>

            {/* 수식 표시 카드리프 */}
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
              <span>{isSaving ? "Supabase 저장 중..." : "💾 Supabase DB에 그래프 저장하기"}</span>
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
                  : "Supabase 연동 후 [-7, 7 정수] 그래프 저장 결과가 여기에 보관됩니다."}
              </p>
            )}
          </div>

        </div>

      </section>

      {/* Supabase SQL Editor 모달 */}
      <SqlEditorModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
