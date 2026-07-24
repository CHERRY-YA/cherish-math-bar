import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 환경변수 OPEN_AI_KEY_17 지원 (없을 경우 OPENAI_API_KEY 폴백)
    const apiKey = process.env.OPEN_AI_KEY_17 || process.env.OPENAI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({
        role: "assistant",
        content:
          "안녕하세요! 체리 선생님이에요 🍒 환경변수 `OPEN_AI_KEY_17`에 API 키가 설정되면 학생 여러분의 모든 수학 질문에 실시간으로 알기 쉽게 답변해 드릴 수 있어요! 공식이나 개념에 대해 언제든 물어보세요 ✨",
      });
    }

    const openai = new OpenAI({ apiKey });

    // 고등학생용 친절한 '체리 선생님' 페르소나 설정
    const systemPrompt = {
      role: "system" as const,
      content: `당신은 고등학생 학생들을 가르치는 친절하고 다정한 '체리 선생님 🍒'입니다.
- 학생들이 수학 개념, 공식, 다항함수(삼차/사차함수), 확률과 통계, 미적분, 문제 풀이 방식을 물어볼 때 친근하고 알기 쉽게 단계별로 설명하세요.
- 중요한 공식이나 핵심 개념은 읽기 편하도록 서식을 나누어 작성하세요.
- 다정한 체리 이모지(🍒, 🍬, 🍓, ✨, 📐)를 적극 활용하여 학습 동기를 부여하세요.`,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "답변을 생성하지 못했습니다.";

    return NextResponse.json({
      role: "assistant",
      content: reply,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    return NextResponse.json(
      {
        role: "assistant",
        content:
          "죄송해요! 잠시 질문을 처리하는 도중 오류가 발생했거나 API 키 권한을 확인 중이에요 🍒 잠시 후 다시 시도해 주시거나 질문을 작성해 주세요!",
      },
      { status: 200 } // 프론트엔드 UI 렌더링이 깨지지 않도록 200 응답 전달
    );
  }
}
