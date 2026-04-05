import { useState, useCallback } from "react";
import Sidebar   from "./Sidebar";
import ChatArea  from "./ChatArea";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AppLayout({ user }) {
  const [sessions, setSessions]         = useState([]);   // [{id, title, messages, ts}]
  const [activeId, setActiveId]         = useState(null);

  const activeSession = sessions.find((s) => s.id === activeId) || null;

  // Start a brand new chat
  const newChat = useCallback(() => {
    setActiveId(null);
  }, []);

  // Called when user sends first message in a new chat
  const createSession = useCallback((firstMessage) => {
    const id = makeId();
    const title = firstMessage.length > 40
      ? firstMessage.slice(0, 40) + "…"
      : firstMessage;
    const session = { id, title, messages: [], ts: Date.now() };
    setSessions((prev) => [session, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  // Update messages of a session
  const updateSession = useCallback((id, messages) => {
    setSessions((prev) =>
      prev.map((s) => s.id === id ? { ...s, messages } : s)
    );
  }, []);

  const formattedSessions = sessions.map((s) => ({
    ...s,
    timeAgo: timeAgo(s.ts),
  }));

  return (
    <div className="h-screen flex overflow-hidden"
      style={{ background: "#f3f4f8" }}>
      <Sidebar
        user={user}
        sessions={formattedSessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={newChat}
      />
      <ChatArea
        key={activeId ?? "new"}
        session={activeSession}
        onCreateSession={createSession}
        onUpdateSession={updateSession}
      />
    </div>
  );
}