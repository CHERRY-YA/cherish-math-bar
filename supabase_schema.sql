-- ====================================================================
-- CHERRY Math Bar - Supabase SQL Editor 실행 쿼리문
-- 이 SQL 스크립트를 Supabase 대시보드의 [SQL Editor]에 붙여넣고 [Run]을 누르세요.
-- ====================================================================

-- 1. graph_records 테이블 생성 (5개 순서쌍 다항함수 저장)
CREATE TABLE IF NOT EXISTS public.graph_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '5개 순서쌍 관통 다항함수',
    func_type VARCHAR(50) NOT NULL, -- 'exact_quartic', 'general_cubic', 'monic_quartic'
    formula TEXT NOT NULL,
    points JSONB NOT NULL, -- [{x: -7~7, y: -7~7}, ...]
    coefficients JSONB NOT NULL, -- [a_4, a_3, a_2, a_1, a_0]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. integral_quiz_ranks 테이블 생성 (정적분 퀴즈 랭킹 리더보드)
CREATE TABLE IF NOT EXISTS public.integral_quiz_ranks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    correct_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE public.graph_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integral_quiz_ranks ENABLE ROW LEVEL SECURITY;

-- 4. RLS 권한 정책 설정 (graph_records)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'graph_records' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.graph_records FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'graph_records' AND policyname = 'Allow public insert access'
    ) THEN
        CREATE POLICY "Allow public insert access" ON public.graph_records FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 5. RLS 권한 정책 설정 (integral_quiz_ranks)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'integral_quiz_ranks' AND policyname = 'Allow public read quiz ranks'
    ) THEN
        CREATE POLICY "Allow public read quiz ranks" ON public.integral_quiz_ranks FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'integral_quiz_ranks' AND policyname = 'Allow public insert quiz ranks'
    ) THEN
        CREATE POLICY "Allow public insert quiz ranks" ON public.integral_quiz_ranks FOR INSERT WITH CHECK (true);
    END IF;
END $$;

COMMENT ON TABLE public.graph_records IS 'Cherish Math Bar - [-7, 7] 정수 범위 좌표평면 5개 순서쌍 다항함수 결과 저장 테이블';
COMMENT ON TABLE public.integral_quiz_ranks IS 'Cherish Math Bar - 정적분 퀴즈 챌린지 랭킹 리더보드 테이블';
