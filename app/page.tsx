"use client";

import React, { useState } from "react";
import { PlusCircle, Wand2, Calculator, Lightbulb, Rocket, CheckCircle2 } from "lucide-react";

/**
 * [선생님을 위한 가이드]
 * page.tsx: 메인 화면(Hero Section)을 담당하는 파일입니다.
 * 
 * 💡 새로운 기능이나 수학 교구를 추가하는 방법:
 * 1. 아래의 `mathFeatures` 배열에 새로운 기능 카드 객체를 추가해보세요.
 * 2. 가짜 버튼(Placeholder Button) 클릭 이벤트를 수정하여 팝업이나 모달, 또는 다른 페이지 이동 링크로 변경하실 수 있습니다.
 */
export default function HomePage() {
  // 가짜 버튼 클릭 상태를 시각적으로 보여주기 위한 예시 State
  const [clickCount, setClickCount] = useState(0);

  // 수학 교구 및 기능 확장용 예시 데이터 카드 배열
  const mathFeatures = [
    {
      id: 1,
      title: "함수 그래프 놀이터 📈",
      description: "이차함수와 삼각함수의 그래프 모양을 파스텔 솜사탕처럼 달콤하게 관찰해요!",
      color: "bg-pastel-pink-light border-pastel-pink",
      badge: "인기 교구",
      badgeColor: "bg-pink-200 text-pink-700",
      icon: Calculator,
    },
    {
      id: 2,
      title: "확률과 통계 바 🎲",
      description: "주사위를 던지고 조건부확률의 원리를 알록달록 젤리로 쉽게 이해해 볼까요?",
      color: "bg-pastel-mint-light border-pastel-mint",
      badge: "추천 교구",
      badgeColor: "bg-emerald-200 text-emerald-800",
      icon: Wand2,
    },
    {
      id: 3,
      title: "수학 퀴즈 챌린지 💡",
      description: "친구들과 함께 푸는 매일매일 상큼한 1분 수학 퀴즈 매치!",
      color: "bg-pastel-sky-light border-pastel-sky",
      badge: "신규 교구",
      badgeColor: "bg-sky-200 text-sky-800",
      icon: Lightbulb,
    },
  ];

  const handlePlaceholderClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* 
        ========================================
        1. 메인 히어로 섹션 (Hero Section)
        ========================================
      */}
      <section className="relative overflow-hidden bg-white/70 backdrop-blur-md rounded-4xl p-8 sm:p-12 shadow-pastel-soft border-2 border-white/80 flex flex-col items-center text-center">
        
        {/* 상단 솜사탕 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 border border-pink-200/50 shadow-sm text-xs font-bold text-pink-700 mb-6 hover:scale-105 transition-transform cursor-default">
          <Rocket className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>고등학생을 위한 달콤한 수학 놀이터</span>
        </div>

        {/* 메인 헤드라인 타이트 (Cherish Math Bar) */}
        <h1 className="font-jua text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 bg-clip-text text-transparent mb-4 leading-tight">
          Cherish Math Bar 🍬
        </h1>

        {/* 서브 설명 문구 */}
        <p className="max-w-2xl text-base sm:text-xl text-slate-600 font-medium leading-relaxed mb-8">
          수학 공식이 어렵고 딱딱하다고 느꼈나요? <br className="hidden sm:block" />
          <span className="text-pink-600 font-bold underline decoration-pink-300 decoration-wavy">
            CHERRY Math Bar
          </span>
          에서 알록달록 파스텔 솜사탕처럼 재미있게 수학의 원리를 탐구해보세요!
        </p>

        {/* 
          [핵심 요구사항] 통통 튀는 젤리 모션의 가짜(Placeholder) 버튼 1개
          hover:scale-105 transition-transform duration-200 active:scale-95
        */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handlePlaceholderClick}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pastel-pink-deep via-purple-400 to-pastel-sky-deep text-white font-bold text-lg shadow-jelly hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
            <span>새로운 수학 기능 추가하기 (Placeholder)</span>
          </button>
        </div>

        {/* 버튼 클릭 테스트 피드백 영역 */}
        {clickCount > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>가짜 버튼을 {clickCount}번 클릭했어요! 선생님께서 여기에 원하시는 이벤트를 연결해보세요. ✨</span>
          </div>
        )}

      </section>

      {/* 
        ========================================
        2. 기능 확장 안내 카드 섹션 (Teacher's Guide Cards)
        ========================================
      */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">
            🍓 준비 중인 달콤한 수학 바
          </h2>
          <p className="text-sm text-slate-500">
            선생님들이 자유롭게 코드를 수정하고 코드를 확장할 수 있도록 준비된 기본 구조입니다.
          </p>
        </div>

        {/* 3열 카드 레이아웃 (반응형: 모바일 1열, 태블릿/PC 3열) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mathFeatures.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group relative rounded-3xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-pastel-soft bg-white/80 backdrop-blur-sm flex flex-col justify-between ${feature.color}`}
              >
                <div>
                  {/* 상단 뱃지 및 아이콘 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FeatureIcon className="w-5 h-5 text-pink-500" />
                    </div>
                  </div>

                  {/* 카드 제목 및 설명 */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* 하단 체험해보기 가짜 버튼 */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">클릭하여 기능 추가 가능</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-pink-600 shadow-sm hover:bg-pink-50 hover:scale-105 transition-all"
                    onClick={() => alert(`'${feature.title}' 준비 중인 기능입니다.`)}
                  >
                    체험해보기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================
        3. 선생님을 위한 코드 작성 팁 카드
        ========================================
      */}
      <section className="bg-gradient-to-r from-pastel-yellow-light via-yellow-50 to-amber-50/50 rounded-3xl p-6 sm:p-8 border-2 border-yellow-200/60 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 text-2xl">
            👩‍🏫
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-amber-900">
              선생님을 위한 꿀팁 & 확장 안내
            </h3>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              이 프로젝트는 <strong>Vercel 배포 최적화</strong>가 완료되어 있습니다. 
              <code className="bg-amber-200/50 px-2 py-0.5 rounded-md text-amber-950 font-mono text-xs mx-1">app/page.tsx</code> 
              파일에서 새로운 수학 공식을 시각화하거나 그래프 컴포넌트를 연동해보세요! 
              사용하지 않는 변수나 import가 없도록 작성하여 빌드 에러를 방지하였습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
