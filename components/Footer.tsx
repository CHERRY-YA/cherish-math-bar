"use client";

import React from "react";
import { Heart } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * Footer 컴포넌트: 웹 서비스 최하단의 저작권 표기 및 정보 안내 영역입니다.
 * 하단에 부드럽고 커다란 둥근 카드(rounded-3xl) 스타일로 포근함을 줍니다.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 px-4 max-w-6xl mx-auto w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center shadow-pastel-soft border border-pastel-pink/30 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
          <span>Cherish Math Bar (CHERRY)</span>
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
          <span>Made with love for Math Education</span>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} CHERRY Math Bar. All rights reserved. Vercel Ready Boilerplate.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
