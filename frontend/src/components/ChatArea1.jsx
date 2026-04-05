import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import InputBox      from "./InputBox";

export default function ChatArea({ session, onCreateSession, onUpdateSession }) {
  const [messages, setMessages]   = useState(session?.messages ?? []);
  const [loading, setLoading]     = useState(false);
  const [sessionId, setSessionId] = useState(session?.id ?? null);
  const bottomRef                 = useRef(null);
  const isEmpty                   = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text, attachments = []) => {
    if (loading) return;

    let sid = sessionId;
    const userMsg = {
      role: "user", content: text,
      attachments: attachments.map(({ name, mimeType, preview }) =>
        ({ name, mimeType, preview })),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    // Create session on first message
    if (!sid) {
      sid = onCreateSession(text);
      setSessionId(sid);
    }

    const withPlaceholder = [...nextMessages, { role: "assistant", content: "" }];
    setMessages(withPlaceholder);

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
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }

      // Persist to parent
      const final = [...nextMessages, { role: "assistant", content: accumulated }];
      onUpdateSession(sid, final);
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Could not reach the backend.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const bg = "linear-gradient(160deg, #eef0fb 0%, #f3f0ff 40%, #eae8ff 80%, #e8eeff 100%)";

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: bg }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 shrink-0"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(167,139,250,0.15)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}
        >
          N
        </div>
        <span className="font-bold text-xl" style={{ color: "#7c3aed" }}>Nchat</span>
      </div>

      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.map((msg, i) => (
              <MessageBubble key={i} {...msg} />
            ))}

            {/* Typing dots */}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}>
                  N
                </div>
                <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
                  style={{ background: "rgba(255,255,255,0.85)" }}>
                  {[0,1,2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full"
                      style={{
                        background:"#a78bfa",
                        animation:"bounce 1.2s infinite",
                        animationDelay:`${i*0.2}s`,
                      }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-6 py-4 shrink-0"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(167,139,250,0.12)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <InputBox onSend={sendMessage} loading={loading} />
          <p className="text-center text-xs mt-2" style={{ color: "#9ca3af" }}>
            Nchat can make mistakes. Always verify important information.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%,80%,100%{transform:translateY(0);opacity:.45}
          40%{transform:translateY(-7px);opacity:1}
        }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center pb-10"
      style={{ animation:"fadeUp 0.5s ease both" }}>
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center font-bold text-white mb-5"
        style={{
          fontSize:"2.4rem",
          background:"linear-gradient(135deg,#a78bfa,#7c3aed)",
          boxShadow:"0 12px 40px rgba(109,40,217,0.28)",
        }}
      >
        N
      </div>
      <h2 className="font-bold mb-3"
        style={{ fontSize:"2.8rem", color:"#7c3aed", fontFamily:"'DM Sans',sans-serif" }}>
        Nchat
      </h2>
      <p className="max-w-md text-base leading-relaxed" style={{ color:"#6b7280" }}>
        Your AI study companion. Ask questions, get help with homework,<br/>
        or explore new topics.
      </p>
      <style>{`
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(18px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </div>
  );
}