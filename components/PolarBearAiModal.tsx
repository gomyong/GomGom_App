"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PolarBearAiModal({ bearName = "아쿠" }: { bearName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `안녕! 나는 북극 생태 탐사 가이드 AI야. ${bearName}의 여정이나 북극곰 생물학(투명한 털, 검은 피부, 눈굴 육아), 해빙 생태계에 대해 무엇이든 물어봐! 🐾`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, bearName }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "북극과의 통신 상태가 지연되고 있어요. 다시 시도해 주세요." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "네트워크 문제로 탐사선 연결이 원활하지 않습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-5 z-40 flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105"
        aria-label="북극곰 AI 가이드 문의"
      >
        <span className="text-lg">🐾</span>
        <span className="hidden text-sm sm:inline">북극곰 AI 탐사 가이드</span>
      </button>

      {/* AI Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center">
          <div className="flex h-[80vh] w-full max-w-lg flex-col rounded-xl border border-outline-variant bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface-low px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-primary-tint p-1.5 text-primary">🐾</span>
                <div>
                  <h3 className="font-bold text-ink">북극곰 생태 AI 가이드</h3>
                  <p className="text-xs text-muted">{bearName}의 여정 및 생물학 지식 연동 중</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-muted hover:bg-surface-container hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-white"
                        : "border border-hairline bg-surface-low text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-hairline bg-surface-low px-3.5 py-2 text-xs text-muted animate-pulse">
                    북극곰 AI가 응답을 생성하는 중입니다... ❄️
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="border-t border-hairline p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="예: 털은 왜 하얗게 보여? 눈굴은 어떻게 생겼어?"
                  className="flex-1 rounded border border-outline-variant px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  전송
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
