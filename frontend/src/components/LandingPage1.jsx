export default function LandingPage({ onEnter }) {
    return (
      <div
        className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #e8f0ff 0%, #ede9ff 40%, #f3f0ff 70%, #e8eeff 100%)",
        }}
      >
        {/* Soft blobs */}
        <div style={{
          position:"absolute", width:500, height:500,
          borderRadius:"50%", top:-120, left:-100,
          background:"radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)",
          pointerEvents:"none"
        }}/>
        <div style={{
          position:"absolute", width:400, height:400,
          borderRadius:"50%", bottom:-80, right:-60,
          background:"radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)",
          pointerEvents:"none"
        }}/>
  
        {/* Title */}
        <div className="text-center mb-10" style={{ animation: "fadeUp 0.6s ease both" }}>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "5rem", color: "#3b1fa8", fontFamily: "'DM Sans', sans-serif", lineHeight:1 }}
          >
            Nchat
          </h1>
          <p className="mt-4 text-lg" style={{ color: "#6b7280" }}>
            How can I help you today?
          </p>
        </div>
  
        {/* Input bar (purely visual on landing — click fires onEnter) */}
        <div
          onClick={onEnter}
          className="cursor-pointer flex items-center gap-3 px-6 py-4 rounded-2xl"
          style={{
            width: "min(680px, 90vw)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(167,139,250,0.3)",
            boxShadow: "0 8px 40px rgba(109,40,217,0.10)",
            animation: "fadeUp 0.7s 0.1s ease both",
          }}
        >
          <span style={{ flex:1, color:"#9ca3af", fontSize:"1rem" }}>
            Type your message...
          </span>
          <button
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              boxShadow: "0 4px 14px rgba(109,40,217,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
  
        <style>{`
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(20px); }
            to   { opacity:1; transform:translateY(0); }
          }
        `}</style>
      </div>
    );
  }