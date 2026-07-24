import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase 환경 변수가 Vercel 또는 .env.local에 세팅되어 있는지 확인하는 헬퍼 함수
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"));
};

/**
 * Supabase 클라이언트 인스턴스
 * (환경변수가 없을 경우 빌드가 깨지지 않도록 더미 URL로 안전하게 초기화합니다.)
 */
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://dummy-placeholder.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "dummy-key"
);
