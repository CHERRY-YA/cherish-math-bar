"use client";

import React, { useState } from "react";
import { X, Copy, Check, Database, Code2 } from "lucide-react";

interface SqlEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCRIPT = `-- ====================================================================
-- CHERRY Math Bar - Supabase SQL Editor 실행 쿼리문 (5개 점 관통 다항함수)
-- 이 SQL 스크립트를 Supabase 대시보드의 [SQL Editor]에 붙여넣고 [Run]을 누르세요.
-- ====================================================================

-- 1. graph_records 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS public.graph_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '5개 순서쌍 관통 다항함수',
    func_type VARCHAR(50) NOT NULL, -- 'exact_quartic', 'general_cubic', 'monic_quartic'
    formula TEXT NOT NULL,
    points JSONB NOT NULL, -- [{x: -2, y: 3}, ...]
    coefficients JSONB NOT NULL, -- [a_4, a_3, a_2, a_1, a_0]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE public.graph_records ENABLE ROW LEVEL SECURITY;

-- 3. 익명 및 인증 사용자의 조회(SELECT) 권한 정책 생성
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'graph_records' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.graph_records
            FOR SELECT USING (true);
    END IF;
END $$;

-- 4. 익명 및 인증 사용자의 저장(INSERT) 권한 정책 생성
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'graph_records' AND policyname = 'Allow public insert access'
    ) THEN
        CREATE POLICY "Allow public insert access" ON public.graph_records
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;`;

export const SqlEditorModal: React.FC<SqlEditorModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-pastel-pink flex flex-col gap-4">
        
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-pastel-pink-light flex items-center justify-center text-pink-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Supabase SQL Editor 실행 쿼리문 🗄️
              </h3>
              <p className="text-xs text-slate-500">
                Supabase 대시보드 -&gt; SQL Editor에 복사하여 붙여넣고 Run을 실행하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SQL 스크립트 코드 영역 */}
        <div className="relative rounded-2xl bg-slate-900 text-pink-200 p-4 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed shadow-inner">
          <pre>{SQL_SCRIPT}</pre>
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>테이블명: <code className="font-bold text-slate-700">graph_records</code></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all"
            >
              닫기
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs shadow-jelly hover:scale-105 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>SQL 쿼리문 전체 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SqlEditorModal;
