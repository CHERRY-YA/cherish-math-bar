export interface Point {
  x: number;
  y: number;
}

export type FuncType = "monic_quartic" | "monic_cubic" | "exact_quartic";

export interface FitResult {
  funcType: FuncType;
  title: string;
  coefficients: number[]; // [a_n, a_{n-1}, ..., a_0]
  formula: string;
  evaluate: (x: number) => number;
}

/**
 * NxN 선형 방정식 AX = B 가우스 소거법 풀이
 */
function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row, i) => [...row, B[i]]);

  for (let i = 0; i < n; i++) {
    // 부분 피벗 선택
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    // 행 교환
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-12) {
      continue; // 다중 해 또는 주피벗 0 처리
    }

    // 소거 과정
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // 후진 대입법
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

  // At * A (cols x cols)
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

  // At * Z (cols x 1)
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
 * 계수 배열을 예쁜 수학 수식 문자열로 변환 (예: f(x) = x⁴ - 2.5x³ + 3.2x - 5)
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

    // 소수점 2자리 반올림
    const roundedCoeff = Math.round(coeff * 100) / 100;
    if (Math.abs(roundedCoeff) < 0.001) continue;

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
 * 1. 최고차항의 계수가 1인 사차함수 피팅 (f(x) = x⁴ + ax³ + bx² + cx + d)
 */
export function fitMonicQuartic(points: Point[]): FitResult {
  // y_i - x_i^4 = a x_i^3 + b x_i^2 + c x_i + d
  const X: number[][] = points.map((p) => [Math.pow(p.x, 3), Math.pow(p.x, 2), p.x, 1]);
  const Z: number[] = points.map((p) => p.y - Math.pow(p.x, 4));

  const [a, b, c, d] = solveLeastSquares(X, Z);
  const coeffs = [1, a, b, c, d];

  const evaluate = (x: number) =>
    Math.pow(x, 4) + a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;

  return {
    funcType: "monic_quartic",
    title: "최고차항 계수가 1인 사차함수",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * 2. 최고차항의 계수가 1인 삼차함수 피팅 (f(x) = x³ + ax² + bx + c)
 */
export function fitMonicCubic(points: Point[]): FitResult {
  // y_i - x_i^3 = a x_i^2 + b x_i + c
  const X: number[][] = points.map((p) => [Math.pow(p.x, 2), p.x, 1]);
  const Z: number[] = points.map((p) => p.y - Math.pow(p.x, 3));

  const [a, b, c] = solveLeastSquares(X, Z);
  const coeffs = [1, a, b, c];

  const evaluate = (x: number) =>
    Math.pow(x, 3) + a * Math.pow(x, 2) + b * x + c;

  return {
    funcType: "monic_cubic",
    title: "최고차항 계수가 1인 삼차함수",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * 3. 5개 점을 정확히 연결하는 일반 4차 다항함수 피팅 (f(x) = a4 x⁴ + a3 x³ + a2 x² + a1 x + a0)
 */
export function fitExactQuartic(points: Point[]): FitResult {
  const n = points.length; // 5
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
    title: "5개 점을 지나는 4차 다항함수 (일반)",
    coefficients: coeffs,
    formula: formatPolynomial(coeffs),
    evaluate,
  };
}

/**
 * 무작위 5개 순서쌍 점 생성기 (x값 중복 방지)
 */
export function generateRandomPoints(count: number = 5, min: number = -6, max: number = 6): Point[] {
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
