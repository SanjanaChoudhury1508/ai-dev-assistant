type InputBarProps = {
  input: string;
  isTyping: boolean;
  isDark: boolean;
  tokenCount: number;
  onChange: (value: string) => void;
  onSend: () => void;
};

const HINTS = ["review my code", "find bugs", "explain this", "suggest improvements"];

export default function InputBar({
  input,
  isTyping,
  isDark,
  tokenCount,
  onChange,
  onSend,
}: InputBarProps) {
  const d = isDark;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <>
      {/* Status bar */}
      <div
        className={`flex items-center gap-3 px-5 py-[6px] border-t flex-shrink-0 ${
          d ? "bg-zinc-900 border-zinc-800" : "bg-[#eaeae6] border-[#e0e0d8]"
        }`}
      >
        <div
          className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
            d ? "bg-emerald-400" : "bg-[#1aaa30]"
          }`}
        />
        <span
          className={`text-[10px] tracking-widest ${
            d ? "text-zinc-400" : "text-[#9090a8]"
          }`}
        >
          {isTyping ? "THINKING" : "READY"}
        </span>
        <div className="flex-1" />
        <span className={`text-[10px] ${d ? "text-zinc-500" : "text-[#aaaabc]"}`}>
          ~{tokenCount.toLocaleString()} tokens
        </span>
      </div>

      {/* Hint chips */}
      <div
        className={`flex gap-2 px-4 py-[8px] flex-wrap ${
          d ? "bg-[#0a0a0b]" : "bg-[#f5f5f2]"
        }`}
      >
        {HINTS.map((h) => (
          <button
            key={h}
            onClick={() => onChange(h)}
            className={`text-[10px] px-3 py-[3px] rounded-full border tracking-[0.04em] transition-all duration-150 font-mono hover:text-[#6a6af4] hover:border-[#6a6af4] ${
              d
                ? "bg-zinc-900 border-zinc-700 text-zinc-400"
                : "bg-white border-[#d8d8d0] text-[#9090a8]"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div className={`px-4 pb-4 flex-shrink-0 ${d ? "bg-[#0a0a0b]" : "bg-[#f5f5f2]"}`}>
        <div
          className={`flex items-center gap-[10px] border rounded-lg px-[14px] py-[10px] focus-within:border-[#6a6af4] transition-colors duration-150 ${
            d ? "bg-zinc-900 border-zinc-700" : "bg-white border-[#d8d8d0]"
          }`}
        >
          <span
            className={`text-[13px] select-none flex-shrink-0 ${
              d ? "text-zinc-500" : "text-[#aaaabc]"
            }`}
          >
            ›
          </span>
          <input
            className={`flex-1 bg-transparent outline-none text-[13px] caret-[#6a6af4] font-mono ${
              d
                ? "text-zinc-200 placeholder:text-zinc-600"
                : "text-[#1a1a2a] placeholder:text-[#bbbbcc]"
            }`}
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type your command..."
            disabled={isTyping}
          />
          <button
            onClick={onSend}
            disabled={isTyping}
            className={`text-[10px] px-[10px] py-1 border rounded-[5px] hover:text-[#6a6af4] hover:border-[#6a6af4] active:scale-95 transition-all duration-150 font-mono tracking-[0.05em] disabled:opacity-30 ${
              d ? "border-zinc-700 text-zinc-400" : "border-[#d0d0c8] text-[#9090a8]"
            }`}
          >
            ⏎ run
          </button>
        </div>
      </div>
    </>
  );
}