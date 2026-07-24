-- ====================================================================
-- CHERRY Math Bar - Supabase SQL Editor 실행 쿼리문 ([-7, 7] 정수 순서쌍 다항함수)
-- 이 SQL 스크립트를 Supabase 대시보드의 [SQL Editor]에 붙여넣고 [Run]을 누르세요.
-- ====================================================================

-- 1. graph_records 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS public.graph_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '5개 순서쌍 관통 다항함수',
    func_type VARCHAR(50) NOT NULL, -- 'exact_quartic', 'general_cubic', 'monic_quartic'
    formula TEXT NOT NULL,
    points JSONB NOT NULL, -- [{x: -7~7, y: -7~7}, ...]
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
END $$;

-- 테이블 코멘트 추가
COMMENT ON TABLE public.graph_records IS 'Cherish Math Bar - [-7, 7] 정수 범위 좌표평면 5개 순서쌍 다항함수 결과 저장 테이블';
