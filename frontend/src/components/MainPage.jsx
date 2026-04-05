import { useState, useCallback, useRef, useEffect } from "react";
import InputBox      from "./InputBox";
import MessageBubble from "./MessageBubble";
import Sidebar       from "./Sidebar";

function makeId() { return Math.random().toString(36).slice(2, 10); }

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function MainPage({ user }) {
  const [messages,    setMessages]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [sessions,    setSessions]    = useState([]);
  const [activeId,    setActiveId]    = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (!e.target.closest("#sidebar") && !e.target.closest("#menu-btn")) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  const loadSession = useCallback((id) => {
    const s = sessions.find((x) => x.id === id);
    if (s) {
      setMessages(s.messages);
      setActiveId(id);
      setSidebarOpen(false);
    }
  }, [sessions]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setActiveId(null);
    setSidebarOpen(false);
  }, []);

  const sendMessage = async (text, attachments = []) => {
    if (loading) return;

    const userMsg = {
      role: "user", content: text,
      attachments: attachments.map(({ name, mimeType, preview }) =>
        ({ name, mimeType, preview })),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    let sid = activeId;
    const withPlaceholder = [...nextMessages, { role: "assistant", content: "" }];
    setMessages(withPlaceholder);

    // Create new session on first message
    if (!sid) {
      sid = makeId();
      const title = text.length > 42 ? text.slice(0, 42) + "…" : text;
      setSessions((prev) => [
        { id: sid, title, messages: nextMessages, ts: Date.now() },
        ...prev,
      ]);
      setActiveId(sid);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: nextMessages,
            attachments: attachments.map(({ name, mimeType, data }) =>
              ({ name, mimeType, data })),
          }),
        }
      );

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value || new Uint8Array());
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1] = { role: "assistant", content: accumulated };
          return u;
        });
      }

      const finalMsgs = [...nextMessages, { role: "assistant", content: accumulated }];
      setSessions((prev) =>
        prev.map((s) => s.id === sid ? { ...s, messages: finalMsgs } : s)
      );
    } catch {
      setMessages((prev) => {
        const u = [...prev];
        u[u.length - 1] = { role: "assistant", content: "⚠️ Could not reach the backend." };
        return u;
      });
    } finally {
      setLoading(false);
    }
  };

  const formattedSessions = sessions.map((s) => ({ ...s, timeAgo: timeAgo(s.ts) }));

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative"
      style={{ background: "linear-gradient(145deg, #eaecff 0%, #f0eeff 35%, #ede9ff 65%, #eaedff 100%)" }}
    >
      {/* ── Ambient blobs ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0,
      }}>
        <div style={{
          position:"absolute", width:700, height:700, borderRadius:"50%",
          top:-200, left:-180,
          background:"radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 65%)",
        }}/>
        <div style={{
          position:"absolute", width:500, height:500, borderRadius:"50%",
          bottom:-100, right:-80,
          background:"radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 65%)",
        }}/>
        <div style={{
          position:"absolute", width:350, height:350, borderRadius:"50%",
          top:"40%", right:"15%",
          background:"radial-gradient(circle, rgba(196,181,253,0.13) 0%, transparent 65%)",
        }}/>
      </div>

      {/* ── TOP BAR ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3 shrink-0"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isEmpty ? "none" : "1px solid rgba(167,139,250,0.18)",
        }}
      >
        {/* Hamburger / menu button */}
        <button
          id="menu-btn"
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
            boxShadow: "0 4px 16px rgba(109,40,217,0.32)",
          }}
          title="Menu"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Logo — shown in chat state */}
        {!isEmpty && (
          <div className="flex items-center gap-2.5" style={{ animation:"fadeIn 0.3s ease" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)" }}>
              N
            </div>
            <span className="font-bold text-xl" style={{ color:"#7c3aed" }}>Nchat</span>
          </div>
        )}

        {isEmpty && <div/>}

        {/* Right placeholder for balance */}
        <div className="w-10"/>
      </header>

      {/* ── SIDEBAR DRAWER ── */}
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20"
          style={{ background:"rgba(30,10,60,0.18)", backdropFilter:"blur(2px)" }}
        />
      )}
      <div
        id="sidebar"
        className="fixed top-0 left-0 h-full z-30"
        style={{
          width: 300,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(167,139,250,0.2)",
          boxShadow: sidebarOpen ? "8px 0 40px rgba(109,40,217,0.12)" : "none",
        }}
      >
        <Sidebar
          user={user}
          sessions={formattedSessions}
          activeId={activeId}
          onSelect={loadSession}
          onNewChat={startNewChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* Empty / Hero state */}
        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center px-4"
            style={{ paddingBottom:"120px" }}>
            <div style={{ animation:"fadeUp 0.55s ease both" }}>
              <h1 className="text-center font-extrabold"
                style={{
                  fontSize:"clamp(3.5rem,8vw,5.5rem)",
                  color:"#5b21b6",
                  letterSpacing:"-0.02em",
                  lineHeight: 1.05,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                }}>
                Nchat
              </h1>
              <p className="text-center mt-3"
                style={{
                  fontSize:"1.15rem", color:"#7c6f9a",
                  fontWeight:500, letterSpacing:"-0.01em",
                }}>
                How can I help you today?
              </p>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {!isEmpty && (
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
              {messages.map((msg, i) => (
                <MessageBubble key={i} {...msg} />
              ))}

              {/* Typing indicator */}
              {loading && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center
                    justify-center font-bold text-white text-xs"
                    style={{ background:"linear-gradient(135deg,#a78bfa,#7c3aed)" }}>
                    N
                  </div>
                  <div className="flex gap-1.5 px-5 py-3.5 rounded-3xl rounded-bl-lg"
                    style={{
                      background:"rgba(255,255,255,0.88)",
                      border:"1px solid rgba(167,139,250,0.2)",
                      boxShadow:"0 2px 16px rgba(109,40,217,0.07)",
                    }}>
                    {[0,1,2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full inline-block"
                        style={{
                          background:"#a78bfa",
                          animation:"bounceTyping 1.2s infinite",
                          animationDelay:`${i*0.18}s`,
                        }}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>
          </div>
        )}

        {/* ── INPUT AREA — always visible ── */}
        <div className="shrink-0 px-4 pb-5 pt-2"
          style={{
            // Float above content when in hero state
            position: isEmpty ? "absolute" : "relative",
            bottom: isEmpty ? 0 : "auto",
            left: isEmpty ? 0 : "auto",
            right: isEmpty ? 0 : "auto",
            background: isEmpty
              ? "transparent"
              : "rgba(240,242,255,0.7)",
            backdropFilter: isEmpty ? "none" : "blur(16px)",
            borderTop: isEmpty ? "none" : "1px solid rgba(167,139,250,0.12)",
          }}
        >
          <div className="max-w-3xl mx-auto"
            style={{ animation: isEmpty ? "fadeUp 0.65s 0.1s ease both" : "none" }}>
            <InputBox onSend={sendMessage} loading={loading} />
            <p className="text-center text-xs mt-2.5"
              style={{ color:"#a89ec4", fontWeight:500 }}>
              Nchat can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}