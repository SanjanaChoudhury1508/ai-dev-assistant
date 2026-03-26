import { useEffect, useRef } from "react";
import { Message } from "../types";

type ChatAreaProps = {
  messages: Message[];
  isTyping: boolean;
  isDark: boolean;
};

export default function ChatArea({ messages, isTyping, isDark }: ChatAreaProps) {
  const d = isDark;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-[10px] ${
        d ? "bg-[#0a0a0b]" : "bg-[#f5f5f2]"
      }`}
    >
      {messages.map((msg, idx) => (
        <div key={idx}>
          {/* Divider between exchanges */}
          {idx > 0 && msg.role === "user" && (
            <div
              className={`h-px my-2 ${d ? "bg-zinc-800" : "bg-[#e0e0d8]"}`}
            />
          )}

          {msg.role === "user" ? (
            <div className="text-[13px] leading-relaxed">
              <span className={`mr-2 font-bold ${d ? "text-zinc-500" : "text-[#aaaabc]"}`}>
                ›
              </span>
              <span className={d ? "text-zinc-200" : "text-[#3a3a7a]"}>
                {msg.text}
              </span>
            </div>
          ) : (
            <div
              className={`text-[13px] leading-[1.7] pl-[14px] border-l-[1.5px] mt-1 ${
                d ? "border-zinc-700" : "border-[#c8c8e4]"
              }`}
            >
              <span
                className={`block text-[10px] tracking-widest uppercase mb-[3px] ${
                  d ? "text-zinc-500" : "text-[#9090a8]"
                }`}
              >
                claude
              </span>
              <span className={d ? "text-zinc-300" : "text-[#2a2a3a]"}>
                {msg.text}
              </span>
              {/* Blinking cursor on last AI message while typing */}
              {idx === messages.length - 1 && isTyping && (
                <span className="inline-block w-[7px] h-[13px] bg-[#6a6af4] rounded-[1px] ml-[2px] align-middle animate-pulse" />
              )}
            </div>
          )}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}