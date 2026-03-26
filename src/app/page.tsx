"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Session } from "./types";
import Sidebar from "./components/Sidebar";
import TitleBar from "./components/TitleBar";
import ChatArea from "./components/ChatArea";
import InputBar from "./components/InputBar";

// ── Constants ─────────────────────────────────────────────

const STORAGE_KEY = "chat_sessions";
const ACTIVE_KEY  = "chat_active_id";

const INITIAL_SESSIONS: Session[] = [
  {
    id: "1",
    title: "auth.ts security review",
    time: "just now",
    messages: [
      { role: "user", text: "hi claude" },
      { role: "ai",   text: "Hi! How can I help you today?" },
    ],
  },
  {
    id: "2",
    title: "refactor api routes",
    time: "2h ago",
    messages: [
      { role: "user", text: "refactor my api routes" },
      { role: "ai",   text: "Sure! Share the file and I'll suggest a cleaner structure." },
    ],
  },
  {
    id: "3",
    title: "fix typescript errors",
    time: "yesterday",
    messages: [
      { role: "user", text: "fix typescript errors in utils.ts" },
      { role: "ai",   text: "Paste the file and I'll go through each error." },
    ],
  },
  {
    id: "4",
    title: "optimize db queries",
    time: "yesterday",
    messages: [
      { role: "user", text: "my db queries are slow" },
      { role: "ai",   text: "Let's profile them. Share your query code." },
    ],
  },
];

// ── localStorage helpers ──────────────────────────────────
// All reads/writes are wrapped in try/catch so a corrupt or
// missing value never crashes the app.

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SESSIONS;
    const parsed = JSON.parse(raw);
    // Basic shape validation: must be a non-empty array
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SESSIONS;
    return parsed as Session[];
  } catch {
    return INITIAL_SESSIONS;
  }
}

function loadActiveId(sessions: Session[]): string {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return sessions[0]?.id ?? "1";
    // Guard: stored id must still exist in the loaded sessions
    const exists = sessions.some((s) => s.id === raw);
    return exists ? raw : sessions[0]?.id ?? "1";
  } catch {
    return sessions[0]?.id ?? "1";
  }
}

function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

function saveActiveId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // fail silently
  }
}

// ── Component ─────────────────────────────────────────────

export default function Home() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted,     setMounted]     = useState(false);
  const [sessions,    setSessions]    = useState<Session[]>(INITIAL_SESSIONS);
  const [activeId,    setActiveId]    = useState("1");
  const [input,       setInput]       = useState("");
  const [isTyping,    setIsTyping]    = useState(false);
  const [tokenCount,  setTokenCount]  = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Hydrate from localStorage once on mount ──────────────
  // Must run client-side only (localStorage doesn't exist on
  // the server), so we gate everything behind `mounted`.
  useEffect(() => {
    const stored   = loadSessions();
    const activeId = loadActiveId(stored);
    setSessions(stored);
    setActiveId(activeId);
    setMounted(true);
  }, []);

  // ── Persist sessions whenever they change ────────────────
  // Skip the very first render (before hydration) so we never
  // overwrite localStorage with the placeholder initial state.
  useEffect(() => {
    if (!mounted) return;
    saveSessions(sessions);
  }, [sessions, mounted]);

  // ── Persist activeId whenever it changes ─────────────────
  useEffect(() => {
    if (!mounted) return;
    saveActiveId(activeId);
  }, [activeId, mounted]);

  const isDark        = resolvedTheme === "dark";
  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  // ── Handlers ─────────────────────────────────────────────

  const handleNewSession = () => {
    const id: string = Date.now().toString();
    const session: Session = {
      id,
      title: "new session",
      time: "just now",
      messages: [{ role: "ai", text: "Hi! How can I help you today?" }],
    };
    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    setTokenCount(0);
  };

  const handleSelectSession = (id: string) => {
    setActiveId(id);
  };

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const typeMessage = (text: string) => {
    setIsTyping(true);
    let i = 0;
    let current = "";

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: "ai", text: "" }] }
          : s
      )
    );

    const interval = setInterval(() => {
      current += text[i++];
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? { ...s, messages: [...s.messages.slice(0, -1), { role: "ai", text: current }] }
            : s
        )
      );
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTokenCount((t) => t + Math.floor(text.length / 4));
      }
    }, 18);
  };

  const handleSend = () => {
  if (!input.trim() || isTyping) return;
  const userText = input.trim();
  setInput("");

  // ── Command system ────────────────────────────────────────
  if (userText.startsWith("/")) {
    const command = userText.toLowerCase();

    if (command === "/clear") {
      // Wipe all messages in the active session except a confirmation
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [
                  { role: "ai", text: "Session cleared. How can I help you?" },
                ],
              }
            : s
        )
      );
      return;
    }

    if (command === "/help") {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  { role: "user", text: "/help" },
                  {
                    role: "ai",
                    text: "Available commands:\n  /clear  — clear current session messages\n  /help   — show this list",
                  },
                ],
              }
            : s
        )
      );
      return;
    }

    // Unknown command
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
              ...s,
              messages: [
                ...s.messages,
                { role: "user", text: userText },
                { role: "ai", text: `Unknown command: "${userText}". Type /help for available commands.` },
              ],
            }
          : s
      )
    );
    return;
  }

  // ── Normal message flow (unchanged) ──────────────────────
  setSessions((prev) =>
    prev.map((s) =>
      s.id === activeId
        ? {
            ...s,
            title: s.title === "new session" ? userText.slice(0, 28) : s.title,
            messages: [...s.messages, { role: "user", text: userText }],
          }
        : s
    )
  );
  setTokenCount((t) => t + Math.floor(userText.length / 4));
  setTimeout(() => {
    typeMessage(
      "This is a response from your AI assistant. Paste real code and I'll give you a proper review."
    );
  }, 300);
};

  if (!mounted) return null;

  // ── Render ────────────────────────────────────────────────

  return (
    <div
      className={`h-screen flex items-center justify-center p-4 font-mono transition-colors duration-200 ${
        isDark ? "bg-[#060608]" : "bg-[#e8e8e4]"
      }`}
    >
      <div
        className={`w-full max-w-[1200px] h-full max-h-[680px] flex rounded-xl border overflow-hidden transition-colors duration-200 ${
          isDark ? "bg-[#0a0a0b] border-zinc-800" : "bg-[#f5f5f2] border-[#d8d8d0]"
        }`}
      >
        {sidebarOpen && (
          <Sidebar
            sessions={sessions}
            activeId={activeId}
            isDark={isDark}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TitleBar
            title={activeSession.title}
            isDark={isDark}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onToggleTheme={handleToggleTheme}
          />
          <ChatArea
            messages={activeSession.messages}
            isTyping={isTyping}
            isDark={isDark}
          />
          <InputBar
            input={input}
            isTyping={isTyping}
            isDark={isDark}
            tokenCount={tokenCount}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}