export interface IntegralProblem {
  id: string;
  category: "polynomial" | "exponential" | "logarithmic" | "trigonometric";
  categoryLabel: string;
  expression: string; // e.g. "x² + 2x - 3"
  lowerBound: string; // e.g. "0"
  upperBound: string; // e.g. "2"
  displayLatex: string; // e.g. "\int_{0}^{2} (x^2 + 2x - 3) \, dx"
}

/**
 * 2차/3차 다항함수, 지수함수, 로그함수, 삼각함수 무작위 정적분 문제 생성기
 */
export function generateRandomIntegralProblem(): IntegralProblem {
  const categories = ["polynomial", "exponential", "logarithmic", "trigonometric"] as const;
  const category = categories[Math.floor(Math.random() * categories.length)];

  const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);

  switch (category) {
    case "polynomial": {
      const isCubic = Math.random() > 0.5;
      const a = Math.floor(Math.random() * 3) + 1; // 1 ~ 3
      const b = Math.floor(Math.random() * 5) - 2; // -2 ~ 2
      const c = Math.floor(Math.random() * 5) - 2; // -2 ~ 2
      const d = Math.floor(Math.random() * 5) - 2; // -2 ~ 2

      const lower = Math.floor(Math.random() * 2); // 0 또는 1
      const upper = lower + Math.floor(Math.random() * 2) + 1; // 1 ~ 3

      let expr = "";
      if (isCubic) {
        expr = `${a}x³ ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x² ${c >= 0 ? "+ " + c : "- " + Math.abs(c)}x ${d >= 0 ? "+ " + d : "- " + Math.abs(d)}`;
      } else {
        expr = `${a}x² ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x ${c >= 0 ? "+ " + c : "- " + Math.abs(c)}`;
      }

      return {
        id,
        category: "polynomial",
        categoryLabel: isCubic ? "3차 다항함수 정적분" : "2차 다항함수 정적분",
        expression: expr,
        lowerBound: lower.toString(),
        upperBound: upper.toString(),
        displayLatex: `\\int_{${lower}}^{${upper}} \\left(${expr}\\right) \\, dx`,
      };
    }

    case "exponential": {
      const types = [
        { expr: "e^x", lower: "0", upper: "1", latex: "\\int_{0}^{1} e^x \\, dx" },
        { expr: "2e^x", lower: "0", upper: "1", latex: "\\int_{0}^{1} 2e^x \\, dx font" },
        { expr: "e^{2x}", lower: "0", upper: "1", latex: "\\int_{0}^{1} e^{2x} \\, dx" },
        { expr: "e^x + 1", lower: "0", upper: "2", latex: "\\int_{0}^{2} (e^x + 1) \\, dx" },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      return {
        id,
        category: "exponential",
        categoryLabel: "지수함수 정적분",
        expression: selected.expr,
        lowerBound: selected.lower,
        upperBound: selected.upper,
        displayLatex: selected.latex,
      };
    }

    case "logarithmic": {
      const types = [
        { expr: "\\ln(x)", lower: "1", upper: "e", latex: "\\int_{1}^{e} \\ln(x) \\, dx" },
        { expr: "2 \\ln(x)", lower: "1", upper: "2", latex: "\\int_{1}^{2} 2\\ln(x) \\, dx" },
        { expr: "x \\ln(x)", lower: "1", upper: "2", latex: "\\int_{1}^{2} x\\ln(x) \\, dx" },
        { expr: "\\frac{1}{x}", lower: "1", upper: "e", latex: "\\int_{1}^{e} \\frac{1}{x} \\, dx" },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      return {
        id,
        category: "logarithmic",
        categoryLabel: "로그함수 정적분",
        expression: selected.expr,
        lowerBound: selected.lower,
        upperBound: selected.upper,
        displayLatex: selected.latex,
      };
    }

    case "trigonometric": {
      const types = [
        { expr: "\\sin(x)", lower: "0", upper: "\\pi", latex: "\\int_{0}^{\\pi} \\sin(x) \\, dx" },
        { expr: "\\cos(x)", lower: "0", upper: "\\frac{\\pi}{2}", latex: "\\int_{0}^{\\pi/2} \\cos(x) \\, dx" },
        { expr: "\\sin(2x)", lower: "0", upper: "\\frac{\\pi}{2}", latex: "\\int_{0}^{\\pi/2} \\sin(2x) \\, dx" },
        { expr: "\\sec^2(x)", lower: "0", upper: "\\frac{\\pi}{4}", latex: "\\int_{0}^{\\pi/4} \\sec^2(x) \\, dx" },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      return {
        id,
        category: "trigonometric",
        categoryLabel: "삼각함수 정적분",
        expression: selected.expr,
        lowerBound: selected.lower,
        upperBound: selected.upper,
        displayLatex: selected.latex,
      };
    }
  }
}
