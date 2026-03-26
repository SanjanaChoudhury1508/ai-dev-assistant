import { Session } from "../types";

type SidebarProps = {
  sessions: Session[];
  activeId: string;
  isDark: boolean;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
};

export default function Sidebar({
  sessions,
  activeId,
  isDark,
  onSelectSession,
  onNewSession,
}: SidebarProps) {
  const d = isDark;

  return (
    <div
      className={`w-56 flex-shrink-0 flex flex-col border-r transition-colors duration-200 ${
        d ? "bg-zinc-900 border-zinc-800" : "bg-[#eaeae6] border-[#d4d4cc]"
      }`}
    >
      {/* Header */}
      <div
        className={`px-3 py-[11px] border-b flex items-center gap-2 ${
          d ? "border-zinc-800" : "border-[#d4d4cc]"
        }`}
      >
        <div className="flex gap-[5px]">
          <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
        </div>
        <span
          className={`flex-1 text-[11px] tracking-wider truncate uppercase ${
            d ? "text-zinc-400" : "text-[#9090a8]"
          }`}
        >
          sessions
        </span>
      </div>

      {/* New session button */}
      <button
        onClick={onNewSession}
        className={`mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-[6px] rounded-lg border text-[11px] tracking-wide transition-all duration-150 hover:border-[#6a6af4] hover:text-[#6a6af4] ${
          d
            ? "border-zinc-700 text-zinc-300 bg-zinc-800"
            : "border-[#d0d0c8] text-[#9090a8] bg-white"
        }`}
      >
        <span className="text-base leading-none">+</span>
        <span>new session</span>
      </button>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSession(s.id)}
            className={`w-full text-left px-3 py-[7px] rounded-lg mb-[2px] transition-all duration-150 ${
              s.id === activeId
                ? d
                  ? "bg-zinc-800 border border-zinc-600 text-zinc-100"
                  : "bg-white border border-[#c8c8e0] text-[#3a3a7a]"
                : d
                  ? "border border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  : "border border-transparent text-[#9090a8] hover:bg-[#e4e4e0] hover:text-[#5a5a8a]"
            }`}
          >
            <div className="text-[11px] truncate leading-snug font-medium">
              {s.title}
            </div>
            <div
              className={`text-[9px] mt-[2px] tracking-wider ${
                d ? "text-zinc-500" : "text-[#bbbbcc]"
              }`}
            >
              {s.time}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        className={`px-3 py-3 border-t ${
          d ? "border-zinc-800" : "border-[#d4d4cc]"
        }`}
      >
        <div
          className={`text-[9px] tracking-widest uppercase mb-1 ${
            d ? "text-zinc-500" : "text-[#bbbbcc]"
          }`}
        >
          model
        </div>
        <div className={`text-[11px] ${d ? "text-zinc-300" : "text-[#8888aa]"}`}>
          claude-sonnet-4-5
        </div>
        <div
          className={`text-[9px] mt-[2px] px-[5px] py-[1px] rounded-full border inline-block tracking-widest uppercase ${
            d
              ? "bg-[#1a1a2a] border-[#3a3a6a] text-[#8a8af4]"
              : "bg-[#eeeeff] border-[#c8c8f0] text-[#5252d4]"
          }`}
        >
          MAX
        </div>
      </div>
    </div>
  );
}