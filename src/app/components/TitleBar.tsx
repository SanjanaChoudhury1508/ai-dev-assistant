type TitleBarProps = {
  title: string;
  isDark: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
};

export default function TitleBar({
  title,
  isDark,
  sidebarOpen,
  onToggleSidebar,
  onToggleTheme,
}: TitleBarProps) {
  const d = isDark;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-[10px] border-b flex-shrink-0 transition-colors duration-200 ${
        d ? "bg-zinc-900 border-zinc-800" : "bg-[#eaeae6] border-[#d8d8d0]"
      }`}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        className={`text-[11px] px-2 py-[2px] rounded border transition-all duration-150 hover:border-[#6a6af4] hover:text-[#6a6af4] mr-1 ${
          d ? "border-zinc-700 text-zinc-400" : "border-[#d0d0c8] text-[#9090a8]"
        }`}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>

      {/* Traffic lights when sidebar is hidden */}
      {!sidebarOpen && (
        <div className="flex gap-[5px] mr-1">
          <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
          <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
        </div>
      )}

      {/* Session title */}
      <span
        className={`flex-1 text-center text-[11px] tracking-wider truncate ${
          d ? "text-zinc-300" : "text-[#9090a8]"
        }`}
      >
        {title}
      </span>

      {/* Theme toggle */}
      <button
        onClick={onToggleTheme}
        className={`flex items-center gap-[6px] text-[10px] px-[10px] py-[3px] rounded-full border transition-all duration-200 font-mono tracking-[0.04em] hover:border-[#6a6af4] hover:text-[#6a6af4] ${
          d
            ? "bg-zinc-800 border-zinc-600 text-zinc-300"
            : "bg-[#e8e8e0] border-[#c8c8c0] text-[#8888aa]"
        }`}
      >
        <div
          className={`relative w-7 h-[15px] rounded-full border transition-colors duration-200 ${
            d ? "bg-zinc-700 border-zinc-600" : "bg-[#6a6af4] border-[#5252d4]"
          }`}
        >
          <div
            className={`absolute top-[2px] w-[11px] h-[11px] rounded-full transition-all duration-200 ${
              d ? "left-[2px] bg-zinc-400" : "left-[14px] bg-white"
            }`}
          />
        </div>
        {d ? "dark" : "light"}
      </button>

      {/* MAX badge */}
      <span
        className={`text-[10px] px-2 py-[2px] rounded-full border tracking-widest ${
          d
            ? "bg-[#1a1a2e] text-[#8a8af4] border-[#3a3a6a]"
            : "bg-[#eeeeff] text-[#5252d4] border-[#c8c8f0]"
        }`}
      >
        MAX
      </span>
    </div>
  );
}