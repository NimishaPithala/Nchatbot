{/*
import { useState, useRef, useEffect } from "react";

const ACCEPTED = "image/*,.pdf,.txt,.csv,.json,.html,.md";

export default function InputBox({ onSend, loading }) {
  const [input, setInput]         = useState("");
  const [files, setFiles]         = useState([]);   // [{name, mimeType, data, preview}]
  const textareaRef               = useRef(null);
  const fileInputRef              = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // e.target.result is "data:<mime>;base64,<data>"
        const full   = e.target.result;
        const data   = full.split(",")[1];   // strip the prefix
        const preview = file.type.startsWith("image/") ? full : null;

        setFiles((prev) => [
          ...prev,
          { name: file.name, mimeType: file.type, data, preview },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || loading) return;
    onSend(input.trim(), files);
    setInput("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="rounded-2xl shadow-md overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(160,185,230,0.45)",
        boxShadow: "0 4px 28px rgba(80,110,200,0.10)",
      }}
    >
      
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {files.map((f, i) => (
            <div
              key={i}
              className="relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs"
              style={{
                background: "rgba(44,63,214,0.08)",
                border: "1px solid rgba(44,63,214,0.18)",
                color: "#2c3fd6",
                maxWidth: "180px",
              }}
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.name}
                  className="w-6 h-6 rounded object-cover shrink-0"
                />
              ) : (
                <FileIcon mime={f.mimeType} />
              )}
              <span className="truncate">{f.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="ml-1 text-blue-400 hover:text-red-500 shrink-0 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      
      <div className="flex items-end gap-2 px-4 py-3">
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: "rgba(44,63,214,0.08)", color: "#2c3fd6" }}
          title="Attach file or image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19
              a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm"
          style={{ color: "#1e2a45", lineHeight: "1.6", maxHeight: "160px" }}
          placeholder="Type a message or drop a file…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        
        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && files.length === 0)}
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background:
              loading || (!input.trim() && files.length === 0)
                ? "rgba(150,170,210,0.35)"
                : "#2c3fd6",
            color: "white",
            cursor:
              loading || (!input.trim() && files.length === 0)
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" />
              </path>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      
      <p className="text-center text-xs pb-2" style={{ color: "#9aaac8" }}>
        Drag & drop images, PDF, TXT, CSV, JSON
      </p>
    </div>
  );
}

function FileIcon({ mime }) {
  const icons = {
    "application/pdf": "📄",
    "text/plain":      "📝",
    "text/csv":        "📊",
    "application/json":"📋",
    "text/html":       "🌐",
    "text/markdown":   "📝",
  };
  return <span>{icons[mime] ?? "📎"}</span>;
}*/}


import { useState, useRef, useEffect } from "react";

const ACCEPTED = "image/*,.pdf,.txt,.csv,.json,.html,.md";

export default function InputBox({ onSend, loading, heroMode = false }) {
  const [input,  setInput]  = useState("");
  const [files,  setFiles]  = useState([]);
  const textareaRef          = useRef(null);
  const fileInputRef         = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  }, [input]);

  const readFile = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const full    = e.target.result;
      const data    = full.split(",")[1];
      const preview = file.type.startsWith("image/") ? full : null;
      resolve({ name: file.name, mimeType: file.type, data, preview });
    };
    reader.readAsDataURL(file);
  });

  const handleFiles = async (fileList) => {
    const r = await Promise.all(Array.from(fileList).map(readFile));
    setFiles((prev) => [...prev, ...r]);
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_,j) => j !== i));

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || loading) return;
    onSend(input.trim(), files);
    setInput("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = !loading && (input.trim().length > 0 || files.length > 0);

  return (
    <div
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      onDragOver={(e) => e.preventDefault()}
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px solid rgba(59,91,219,0.14)",
        borderRadius: heroMode ? "20px" : "18px",
        boxShadow: heroMode
          ? "0 8px 48px rgba(59,91,219,0.12), 0 1px 0 rgba(255,255,255,0.9) inset"
          : "0 4px 24px rgba(59,91,219,0.08)",
        overflow: "hidden",
      }}>

      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pt-3">
          {files.map((f, i) => (
            <div key={i}
              className="flex items-center gap-1.5 rounded-2xl px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(59,91,219,0.07)",
                color: "#3b5bdb",
                border: "1px solid rgba(59,91,219,0.15)",
                maxWidth: 180,
              }}>
              {f.preview
                ? <img src={f.preview} alt={f.name}
                    className="w-5 h-5 rounded-md object-cover shrink-0"/>
                : <span className="shrink-0">📎</span>}
              <span className="truncate">{f.name}</span>
              <button onClick={() => removeFile(i)}
                className="ml-0.5 font-bold hover:text-red-400 shrink-0 leading-none">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 px-4"
        style={{ paddingTop: heroMode ? "14px" : "10px",
                 paddingBottom: heroMode ? "14px" : "10px" }}>
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm font-medium"
          style={{
            color: "#1a2240",
            lineHeight: "1.65",
            maxHeight: 150,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          placeholder={heroMode ? "Type your message..." : "Ask me anything..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
            transition-all hover:bg-blue-50 hover:scale-105"
          style={{ color: "#9bb0d8" }}
          title="Attach file">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19
              a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input ref={fileInputRef} type="file" multiple accept={ACCEPTED}
          className="hidden" onChange={(e) => handleFiles(e.target.files)}/>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 rounded-xl flex items-center justify-center
            transition-all hover:opacity-90 active:scale-95"
          style={{
            width: heroMode ? "46px" : "38px",
            height: heroMode ? "46px" : "38px",
            background: canSend
              ? "linear-gradient(135deg,#5b7fff,#3b5bdb)"
              : "rgba(180,195,230,0.4)",
            boxShadow: canSend ? "0 4px 16px rgba(59,91,219,0.32)" : "none",
            cursor: canSend ? "pointer" : "not-allowed",
            borderRadius: heroMode ? "14px" : "12px",
          }}>
          {loading ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={canSend ? "white" : "#b0c0e0"} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}