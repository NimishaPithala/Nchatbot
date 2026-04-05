{/*
import { useState, useRef, useEffect } from "react";
import InputBox from "./InputBox";
import MessageBubble from "./MessageBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Add empty assistant placeholder
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value || new Uint8Array());
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Could not reach the backend. Is it running?",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // ── EMPTY STATE ──────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #e8eef8 0%, #f0f4fc 50%, #e4ecf7 100%)" }}
      >
        <div className="mb-8 text-center select-none">
          <h1
            className="text-6xl font-bold tracking-tight"
            style={{ color: "#2c3fd6" }}
          >
            Nchat
          </h1>
          <p className="mt-3 text-lg" style={{ color: "#5a6580" }}>
            How can I help you today?
          </p>
        </div>

        <div className="w-full max-w-2xl px-4">
          <InputBox onSend={sendMessage} loading={loading} />
        </div>
      </div>
    );
  }

  // ── CHAT STATE ───────────────────────────────────────────────
  return (
    <div
      className="h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #e8eef8 0%, #f0f4fc 50%, #e4ecf7 100%)" }}
    >

      <div
        className="flex items-center px-6 py-3 border-b"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(180,196,230,0.4)",
        }}
      >
        <span className="text-xl font-bold" style={{ color: "#2c3fd6" }}>
          Nchat
        </span>
      </div>

      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} {...msg} />
          ))}

          
          {loading && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-1.5 px-4 py-3 rounded-2xl w-fit"
              style={{ background: "rgba(255,255,255,0.7)" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "#8da0c4",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      
      <div
        className="border-t px-4 py-4"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(180,196,230,0.4)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <InputBox onSend={sendMessage} loading={loading} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
  */}

  import { useState, useRef, useEffect } from "react";
  import InputBox from "./InputBox";
  import MessageBubble from "./MessageBubble";
  
  export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading]   = useState(false);
    const bottomRef               = useRef(null);
    const isEmpty                 = messages.length === 0;
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const sendMessage = async (text, attachments = []) => {
      if (loading) return;
  
      // Build display content for user bubble
      const userMsg = {
        role: "user",
        content: text,
        attachments: attachments.map((a) => ({
          name: a.name,
          mimeType: a.mimeType,
          preview: a.preview,   // only images have preview
        })),
      };
  
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setLoading(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
  
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/chat`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              history: newMessages,
              attachments: attachments.map((a) => ({
                name: a.name,
                mimeType: a.mimeType,
                data: a.data,
              })),
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
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "⚠️ Could not reach the backend. Is it running?",
          };
          return updated;
        });
      } finally {
        setLoading(false);
      }
    };
  
    const bgStyle = {
      background: "linear-gradient(160deg, #e8eef8 0%, #f0f4fc 50%, #e4ecf7 100%)",
    };
  
    // ── EMPTY STATE ───────────────────────────────────────────────
    if (isEmpty) {
      return (
        <div className="h-screen flex flex-col items-center justify-center" style={bgStyle}>
          <div className="mb-8 text-center select-none">
            <h1 className="text-6xl font-bold tracking-tight" style={{ color: "#2c3fd6" }}>
              Nchat
            </h1>
            <p className="mt-3 text-lg" style={{ color: "#5a6580" }}>
              How can I help you today?
            </p>
          </div>
          <div className="w-full max-w-2xl px-4">
            <InputBox onSend={sendMessage} loading={loading} />
          </div>
        </div>
      );
    }
  
    // ── CHAT STATE ────────────────────────────────────────────────
    return (
      <div className="h-screen flex flex-col" style={bgStyle}>
        {/* Header */}
        <div
          className="flex items-center px-6 py-3 border-b shrink-0"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(180,196,230,0.4)",
          }}
        >
          <span className="text-xl font-bold" style={{ color: "#2c3fd6" }}>Nchat</span>
        </div>
  
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} {...msg} />
            ))}
  
            {loading && messages[messages.length - 1]?.content === "" && (
              <div
                className="flex gap-1.5 px-4 py-3 rounded-2xl w-fit"
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#8da0c4",
                      animation: "bounce 1.2s infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
  
        {/* Input */}
        <div
          className="border-t px-4 py-4 shrink-0"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(180,196,230,0.4)",
          }}
        >
          <div className="max-w-2xl mx-auto">
            <InputBox onSend={sendMessage} loading={loading} />
          </div>
        </div>
  
        <style>{`
          @keyframes bounce {
            0%,80%,100%{transform:translateY(0);opacity:.5}
            40%{transform:translateY(-6px);opacity:1}
          }
        `}</style>
      </div>
    );
  }