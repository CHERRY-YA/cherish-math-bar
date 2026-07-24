import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { problem, userAnswer } = await req.json();

    const apiKey = process.env.OPEN_AI_KEY_17 || process.env.OPENAI_API_KEY || "";

    // API 키가 등록되지 않았을 경우 안심 폴백 채점
    if (!apiKey) {
      return NextResponse.json({
        isCorrect: true,
        exactValue: "체크중 (API 키 연동 준비)",
        explanation:
          "OPEN_AI_KEY_17 환경변수가 연동되면 AI가 정밀 수학 수식 정답을 판정하고 해설을 제공합니다! 임시로 정답 처리 되었습니다.",
      });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `당신은 엄격하고 정확한 수학 정적분 평가 채점관입니다.
학생이 제출한 정적분 답이 해당 문제의 정적분 값과 수학적으로 동등(equivalent)한지 판정해야 합니다.

[문제 정보]
- 유형: ${problem.categoryLabel}
- 수식: ${problem.displayLatex}
- 피적분함수: ${problem.expression}
- 적분 구간: [${problem.lowerBound}, ${problem.upperBound}]
- 학생 제출 답: ${userAnswer}

[판정 규칙]
1. 수학적으로 정확한 정적분 값 I = ∫_{a}^{b} f(x) dx 를 계산하세요.
2. 학생의 답(${userAnswer})이 분수(예: 1/3, 5/2), 소수(예: 0.5), 또는 e, pi를 포함한 수식(예: e-1, pi/2, 2e-2) 형태이더라도 계산한 정적분 값과 수학적으로 일치하면 isCorrect: true 로 판정하세요.
3. 오직 아래 JSON 포맷으로만 응답하세요:
{
  "isCorrect": boolean,
  "exactValue": "정확한 정적분 값 수식 문자열",
  "explanation": "한 줄 풀이 과정 설명"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const replyText = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(replyText);

    return NextResponse.json({
      isCorrect: Boolean(result.isCorrect),
      exactValue: result.exactValue || "정답 수식",
      explanation: result.explanation || "정적분 계산 결과입니다.",
    });
  } catch (error) {
    console.error("Integral Eval Error:", error);
    return NextResponse.json({
      isCorrect: false,
      exactValue: "오류",
      explanation: "채점 중 오류가 발생했습니다. 다시 제출해 주세요.",
    });
  }
}
