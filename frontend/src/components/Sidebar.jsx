{/*
import { useEffect, useState } from "react";
import { apiGetSessions, apiNewSession, apiDeleteSession } from "../api";

export default function Sidebar({ activeSessionId, onSelectSession, onNewChat, refreshTrigger }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    apiGetSessions().then(setSessions).catch(() => {});
  }, [refreshTrigger]);

  const handleNew = async () => {
    const session = await apiNewSession();
    setSessions((prev) => [session, ...prev]);
    onNewChat(session);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await apiDeleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) onNewChat(null);
  };

  // Group by recency
  const grouped = sessions.reduce((acc, s) => {
    const diff = Math.floor((Date.now() - new Date(s.updated_at)) / 86400000);
    const label = diff === 0 ? "Today" : diff === 1 ? "Yesterday" : diff < 7 ? "This Week" : "Older";
    (acc[label] = acc[label] || []).push(s);
    return acc;
  }, {});

  const ORDER = ["Today", "Yesterday", "This Week", "Older"];

  return (
    <div
      className="h-full w-64 shrink-0 flex flex-col select-none"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(180,196,230,0.4)",
      }}
    >
      
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-xl font-bold" style={{ color: "#2c3fd6" }}>Nchat</span>
        <button
          onClick={handleNew}
          title="New Chat"
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(44,63,214,0.1)", color: "#2c3fd6" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {sessions.length === 0 && (
          <p className="text-xs text-center mt-10" style={{ color: "#8da0c4" }}>
            No chats yet.<br />Start a new one!
          </p>
        )}
        {ORDER.filter((l) => grouped[l]).map((label) => (
          <div key={label} className="mb-3">
            <p className="text-xs font-semibold px-2 py-1" style={{ color: "#8da0c4" }}>{label}</p>
            {grouped[label].map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSession(s)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm group flex items-center justify-between gap-2 mb-0.5 transition-colors"
                style={{
                  background: activeSessionId === s.id ? "rgba(44,63,214,0.12)" : "transparent",
                  color: activeSessionId === s.id ? "#2c3fd6" : "#1e2a45",
                  fontWeight: activeSessionId === s.id ? 600 : 400,
                }}
              >
                <span className="truncate flex-1">{s.title || "New Chat"}</span>
                <span
                  className="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
                  onClick={(e) => handleDelete(e, s.id)}
                  title="Delete"
                  style={{ color: "#e55" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} */}


export default function Sidebar({ user, sessions, activeId, onSelect, onNewChat, onClose }) {
  return (
    <div className="h-full flex flex-col"
      style={{
        background: "rgba(255,255,255,0.97)",
        borderRight: "1px solid rgba(59,91,219,0.10)",
      }}>

      {/* User profile row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(59,91,219,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#5b7fff,#3b5bdb)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1a2240" }}>
              {user.name}
            </p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              {user.email}
            </p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center
            transition hover:bg-blue-50"
          style={{ color: "#9ca3af" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6"  y2="18"/>
            <line x1="6"  y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* New Chat */}
      <div className="px-4 py-3">
        <button onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl
            font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#5b7fff,#3b5bdb)",
            boxShadow: "0 4px 16px rgba(59,91,219,0.28)",
            letterSpacing: "-0.01em",
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {sessions.length === 0 ? (
          <p className="text-xs text-center mt-8" style={{ color: "#b8c4d8" }}>
            No previous chats yet
          </p>
        ) : (
          <>
            <p className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "#b8c4d8", letterSpacing: "0.1em" }}>
              Previous Chats
            </p>
            <div className="flex flex-col gap-0.5">
              {sessions.map((s) => {
                const active = s.id === activeId;
                return (
                  <button key={s.id} onClick={() => onSelect(s.id)}
                    className="w-full text-left flex items-start gap-2.5 px-3 py-2.5
                      rounded-xl transition-all hover:bg-blue-50"
                    style={{
                      background: active ? "rgba(59,91,219,0.07)" : "transparent",
                      border: active
                        ? "1px solid rgba(59,91,219,0.18)"
                        : "1px solid transparent",
                    }}>
                    <svg className="shrink-0 mt-0.5" width="13" height="13"
                      viewBox="0 0 24 24" fill="none"
                      stroke={active ? "#3b5bdb" : "#b8c4d8"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate"
                        style={{ color: active ? "#3b5bdb" : "#374151" }}>
                        {s.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                        {s.timeAgo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Bottom brand */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(59,91,219,0.08)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center
            text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg,#5b7fff,#3b5bdb)" }}>
            N
          </div>
          <span className="font-bold text-sm" style={{ color: "#3b5bdb" }}>Nchat</span>
        </div>
      </div>
    </div>
  );
}