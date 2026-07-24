"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, MessageSquareHeart } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const MathChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "안녕! 나는 Cherish Math Bar의 **체리 선생님🍒**이야! 수학 공식이 궁금하거나 풀이법이 막힐 때 언제든 물어봐. 알기 쉽게 설명해 줄게! ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 자동 하단 스크롤
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 추천 샘플 질문 리스트
  const sampleQuestions = [
    "이차함수의 꼭짓점 구하는 공식 📈",
    "사차함수 그래프 극값 모양 🎯",
    "조건부확률 쉽게 푸는 방법 🎲",
    "수학 시험 준비할 때 꿀팁 💡",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "답변을 가져오지 못했어요. 다시 물어봐 주세요! 🍒",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "오류가 발생했어요 🍒 인터넷 연결이나 API 키 상태를 확인한 뒤 다시 질문해 주세요!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-4xl p-6 sm:p-8 shadow-pastel-soft border-2 border-pastel-pink/60 flex flex-col gap-4">
      
      {/* 챗봇 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-jelly text-2xl">
            🍒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-jua text-xl font-bold text-slate-800">
                체리 AI 수학 튜터 챗봇
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                GPT-4o 연동
              </span>
            </div>
            <p className="text-xs text-slate-500">
              OPEN_AI_KEY_17 연동 · 고등학생을 위한 맞춤형 수학 질문 실시간 답변
            </p>
          </div>
        </div>

        <MessageSquareHeart className="w-6 h-6 text-pink-400 animate-pulse hidden sm:block" />
      </div>

      {/* 추천 질문 칩 */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">추천 질문:</span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-pastel-pink-light text-pink-700 text-xs font-semibold hover:bg-pink-200 hover:scale-105 active:scale-95 transition-all shadow-sm border border-pink-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 대화 내역 스크롤 영역 */}
      <div className="h-80 sm:h-96 overflow-y-auto p-4 rounded-3xl bg-pastel-pink-light/40 border border-pink-100 flex flex-col gap-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* 아이콘 */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-sm ${
                  isUser
                    ? "bg-slate-700 text-white"
                    : "bg-gradient-to-tr from-pink-500 to-purple-500 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* 말풍선 */}
              <div
                className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-slate-800 text-white rounded-tr-none shadow-md font-medium"
                    : "bg-white text-slate-800 rounded-tl-none shadow-pastel-soft border border-pink-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* 로딩 대기 말풍선 */}
        {loading && (
          <div className="flex items-center gap-2 text-pink-600 font-semibold text-xs bg-white p-3 rounded-2xl w-fit shadow-sm border border-pink-100 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
            <span>체리 선생님이 답변을 생각하고 있어요... 🍒</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 질문 입력 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 수학 공식이나 문제를 물어보세요! (예: 삼차함수 극값 구하는 공식)"
            className="w-full px-5 py-3.5 rounded-full bg-white border-2 border-pink-200 text-slate-700 text-sm focus:outline-none focus:border-pink-400 shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex items-center gap-1.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm shadow-jelly hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">질문하기</span>
        </button>
      </form>

    </div>
  );
};

export default MathChatbot;
