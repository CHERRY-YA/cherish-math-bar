"use client";

import React, { useMemo } from "react";
import { Point, FitResult } from "@/utils/mathFitting";

interface CoordinateCanvasProps {
  points: Point[];
  fitResult: FitResult;
  width?: number;
  height?: number;
}

export const CoordinateCanvas: React.FC<CoordinateCanvasProps> = ({
  points,
  fitResult,
  width = 600,
  height = 420,
}) => {
  // 1. 좌표평면 가시 범위 (-7 ~ +7 정수 범위 고정)
  const margin = 40;
  const minX = -7.5;
  const maxX = 7.5;
  const minY = -7.5;
  const maxY = 7.5;

  // 수학 좌표 (x, y) -> SVG 화면 Pixel 좌표 (px, py) 변환 함수
  const toPixelX = (x: number): number => {
    return margin + ((x - minX) / (maxX - minX)) * (width - 2 * margin);
  };

  const toPixelY = (y: number): number => {
    return height - margin - ((y - minY) / (maxY - minY)) * (height - 2 * margin);
  };

  // 원점 (0,0)의 픽셀 좌표
  const originPx = toPixelX(0);
  const originPy = toPixelY(0);

  // 2. [-7, 7] 범위의 정수 눈금 라벨 생성
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let x = -7; x <= 7; x++) {
      if (x !== 0) ticks.push(x);
    }
    return ticks;
  }, []);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let y = -7; y <= 7; y++) {
      if (y !== 0 && y % 2 === 0) ticks.push(y); // Y축은 2단위 간격 표시
    }
    return ticks;
  }, []);

  // 3. 다항함수 곡선 SVG Path 계산
  const pathD = useMemo(() => {
    const step = (maxX - minX) / 250;
    const pathPoints: { px: number; py: number }[] = [];

    for (let x = minX; x <= maxX; x += step) {
      try {
        const y = fitResult.evaluate(x);
        if (!isNaN(y) && isFinite(y) && y >= minY - 50 && y <= maxY + 50) {
          pathPoints.push({
            px: toPixelX(x),
            py: toPixelY(y),
          });
        }
      } catch {
        // 백그라운드 계산 예외 무시
      }
    }

    if (pathPoints.length < 2) return "";

    return pathPoints.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.px} ${p.py}` : `${acc} L ${p.px} ${p.py}`;
    }, "");
  }, [fitResult]);

  return (
    <div className="relative w-full overflow-hidden bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-pastel-soft border-2 border-pastel-pink/50 flex flex-col items-center">
      
      {/* 캔버스 상단 범주 및 함수식 뱃지 */}
      <div className="w-full flex items-center justify-between px-2 mb-2 flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-500 bg-pastel-pink-light px-3 py-1 rounded-full border border-pink-200">
          📍 정수 좌표 범위 [-7, 7]
        </span>
        <span className="font-jua text-sm sm:text-base font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
          {fitResult.formula}
        </span>
      </div>

      {/* SVG 좌표평면 렌더링 */}
      <div className="relative w-full max-w-full aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full rounded-2xl select-none"
        >
          <defs>
            {/* 곡선 그라데이션 필터 */}
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>

            {/* 점 핑크 글로우 그림자 */}
            <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EC4899" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 배경 격자 그리드 */}
          {xTicks.map((x) => (
            <line
              key={`grid-x-${x}`}
              x1={toPixelX(x)}
              y1={margin}
              x2={toPixelX(x)}
              y2={height - margin}
              stroke="#F3E8FF"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {yTicks.map((y) => (
            <line
              key={`grid-y-${y}`}
              x1={margin}
              y1={toPixelY(y)}
              x2={width - margin}
              y2={toPixelY(y)}
              stroke="#F3E8FF"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* X축 및 Y축 메인 라인 */}
          <line
            x1={margin}
            y1={originPy}
            x2={width - margin}
            y2={originPy}
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <line
            x1={originPx}
            y1={margin}
            x2={originPx}
            y2={height - margin}
            stroke="#94A3B8"
            strokeWidth="2"
          />

          {/* 화살표 라벨 (X, Y 축 끝점) */}
          <text x={width - margin + 8} y={originPy + 4} fill="#64748B" fontSize="12" fontWeight="bold">
            X
          </text>
          <text x={originPx - 4} y={margin - 8} fill="#64748B" fontSize="12" fontWeight="bold">
            Y
          </text>
          <text x={originPx - 10} y={originPy + 14} fill="#94A3B8" fontSize="10">
            0
          </text>

          {/* X축 눈금 숫자 */}
          {xTicks.map((x) => (
            <g key={`tick-x-${x}`}>
              <line
                x1={toPixelX(x)}
                y1={originPy - 3}
                x2={toPixelX(x)}
                y2={originPy + 3}
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <text
                x={toPixelX(x)}
                y={originPy + 15}
                fill="#94A3B8"
                fontSize="9"
                textAnchor="middle"
              >
                {x}
              </text>
            </g>
          ))}

          {/* Y축 눈금 숫자 */}
          {yTicks.map((y) => (
            <g key={`tick-y-${y}`}>
              <line
                x1={originPx - 3}
                y1={toPixelY(y)}
                x2={originPx + 3}
                y2={toPixelY(y)}
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <text
                x={originPx - 8}
                y={toPixelY(y) + 3}
                fill="#94A3B8"
                fontSize="9"
                textAnchor="end"
              >
                {y}
              </text>
            </g>
          ))}

          {/* 삼차/사차 다항함수 곡선 드로잉 */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 5개 정수 입력 점(Points) 렌더링 */}
          {points.map((p, idx) => {
            const px = toPixelX(p.x);
            const py = toPixelY(p.y);

            return (
              <g key={`point-${idx}-${p.x}-${p.y}`} className="cursor-pointer group">
                <circle
                  cx={px}
                  cy={py}
                  r="10"
                  fill="#FFD6E8"
                  opacity="0.6"
                  className="animate-pulse"
                />
                <circle
                  cx={px}
                  cy={py}
                  r="6"
                  fill="#EC4899"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter="url(#pinkGlow)"
                  className="transition-transform group-hover:scale-125 duration-200"
                />
                <rect
                  x={px - 20}
                  y={py - 24}
                  width="40"
                  height="16"
                  rx="8"
                  fill="#1E293B"
                  opacity="0.85"
                />
                <text
                  x={px}
                  y={py - 13}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ({p.x}, {p.y})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 하단 점 범례 */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs font-semibold text-slate-600">
        <span className="text-slate-400">입력된 5개 순서쌍 (-7~7 정수):</span>
        {points.map((p, i) => (
          <span
            key={`legend-${i}`}
            className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200 font-mono text-[11px]"
          >
            P{i + 1}({p.x}, {p.y})
          </span>
        ))}
      </div>

    </div>
  );
};

export default CoordinateCanvas;
