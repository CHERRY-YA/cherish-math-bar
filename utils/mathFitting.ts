export interface Point {
  x: number;
  y: number;
}

export type FuncType = "exact_quartic" | "general_cubic" | "monic_quartic";

export interface FitResult {
  funcType: FuncType;
  title: string;
  coefficients: number[]; // [a_n, a_{n-1}, ..., a_0]
  formula: string;
  evaluate: (x: number) => number;
}

/**
 * 좌표 범위 제한 헬퍼 (-7 ~ 7 사이 정수로 제한)
 */
export function clampCoordinate(val: number): number {
  if (isNaN(val)) return 0;
  const intVal = Math.round(val);
  return Math.max(-7, Math.min(7, intVal));
}

/**
 * NxN 선형 방정식 AX = B 가우스 소거법 (Partial Pivoting)
 * 5개 점을 정확히 100% 관통하는 다항식 계수 산출용
 */
function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row, i) => [...row, B[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-12) {
      continue;
    }

    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = Math.abs(M[i][i]) > 1e-12 ? sum / M[i][i] : 0;
  }
  return x;
}

/**
 * 최소제곱법 (At * A) * Coeffs = At * Z 풀이
 */
function solveLeastSquares(X: number[][], Z: number[]): number[] {
  const rows = X.length;
  const cols = X[0].length;

  const AtA: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(0));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let r = 0; r < rows; r++) {
        sum += X[r][i] * X[r][j];
      }
      AtA[i][j] = sum;
    }
  }

  const AtZ: number[] = new Array(cols).fill(0);
  for (let i = 0; i < cols; i++) {
    let sum = 0;
    for (let r = 0; r < rows; r++) {
      sum += X[r][i] * Z[r];
    }
    AtZ[i] = sum;
  }

  return solveLinearSystem(AtA, AtZ);
}

/**
 * 다항식 계수를 표준 수학 수식 문자열로 포맷팅
 */
export function formatPolynomial(coeffs: number[]): string {
  const degree = coeffs.length - 1;
  const superscripts: { [key: number]: string } = {
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
  };

  const terms: string[] = [];

  for (let i = 0; i <= degree; i++) {
    const coeff = coeffs[i];
    const power = degree - i;

    let roundedCoeff = Math.round(coeff * 100) / 100;
    if (Math.abs(roundedCoeff) < 0.01 && Math.abs(coeff) > 0.0001) {
      roundedCoeff = Math.round(coeff * 1000) / 1000;
    }

    if (Math.abs(roundedCoeff) < 0.0001) continue;

    let sign = "";
    if (terms.length === 0) {
      sign = roundedCoeff < 0 ? "-" : "";
    } else {
      sign = roundedCoeff < 0 ? " - " : " + ";
    }

    const absVal = Math.abs(roundedCoeff);
    let valStr = absVal === 1 && power > 0 ? "" : absVal.toString();

    let variable = "";
    if (power > 1) {
      variable = `x${superscripts[power] || "^" + power}`;
    } else if (power === 1) {
      variable = "x";
    }

    terms.push(`${sign}${valStr}${variable}`);
  }

  if (terms.length === 0) return "f(x) = 0";
  return `f(x) = ${terms.join("")}`;
}

/**
 * 1. 5개 점을 100% 관통하는 사차함수 (f(x) = a x⁴ + b x³ + c x² + d x + e)
 */
export function fitExactQuartic(points: Point[]): FitResult {
  const A: number[][] = points.map((p) => [
    Math.pow(p.x, 4),
    Math.pow(p.x, 3),
    Math.pow(p.x, 2),
    p.x,
    1,
  ]);
  const B: number[] = points.map((p) => p.y);

  const coeffs = solveLinearSystem(A, B);

  const evaluate = (x: number) => {
    return coeffs.reduce((acc, c, idx) => acc + c * Math.pow(x, 4 - idx), 0);
  };

  return {
    funcType: "exact_quartic",
    title: "5개 점 관통 4차함수 (a x⁴ + b x³ + c x² + d x + e)",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * 2. 일반 삼차함수 피팅 (f(x) = a x³ + b x² + c x + d)
 */
export function fitGeneralCubic(points: Point[]): FitResult {
  const X: number[][] = points.map((p) => [
    Math.pow(p.x, 3),
    Math.pow(p.x, 2),
    p.x,
    1,
  ]);
  const Z: number[] = points.map((p) => p.y);

  const coeffs = solveLeastSquares(X, Z);

  const evaluate = (x: number) => {
    return coeffs.reduce((acc, c, idx) => acc + c * Math.pow(x, 3 - idx), 0);
  };

  return {
    funcType: "general_cubic",
    title: "일반 삼차함수 (a x³ + b x² + c x + d)",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * 3. 최고차항 계수 1 사차함수 (f(x) = x⁴ + a x³ + b x² + c x + d)
 */
export function fitMonicQuartic(points: Point[]): FitResult {
  const X: number[][] = points.map((p) => [Math.pow(p.x, 3), Math.pow(p.x, 2), p.x, 1]);
  const Z: number[] = points.map((p) => p.y - Math.pow(p.x, 4));

  const [a, b, c, d] = solveLeastSquares(X, Z);
  const coeffs = [1, a, b, c, d];

  const evaluate = (x: number) =>
    Math.pow(x, 4) + a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;

  return {
    funcType: "monic_quartic",
    title: "최고차항 계수 1 사차함수 (x⁴ + a x³ + b x² + c x + d)",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * -7부터 7까지의 정수 범위 내에서 x값 중복 없는 무작위 5개 순서쌍 점 생성기
 */
export function generateRandomPoints(count: number = 5, min: number = -7, max: number = 7): Point[] {
  const xValues = new Set<number>();
  while (xValues.size < count) {
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    xValues.add(x);
  }

  const sortedX = Array.from(xValues).sort((a, b) => a - b);
  return sortedX.map((x) => ({
    x,
    y: Math.floor(Math.random() * (max - min + 1)) + min,
  }));
}
