
{/*
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ role, content, attachments = [] }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0"
          style={{ background: "#2c3fd6", color: "white" }}
        >
          N
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-w-[78%]">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {attachments.map((a, i) =>
              a.preview ? (
                <img
                  key={i}
                  src={a.preview}
                  alt={a.name}
                  className="max-w-[200px] max-h-[160px] rounded-xl object-cover shadow"
                />
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs"
                  style={{
                    background: "rgba(44,63,214,0.1)",
                    color: "#2c3fd6",
                    border: "1px solid rgba(44,63,214,0.2)",
                  }}
                >
                  <span>📎</span>
                  <span className="truncate max-w-[120px]">{a.name}</span>
                </div>
              )
            )}
          </div>
        )}

        
        {(content || content === "") && (
          <div
            className={`prose text-sm leading-relaxed px-4 py-3 rounded-2xl shadow-sm ${
              isUser ? "rounded-br-sm" : "rounded-bl-sm"
            }`}
            style={
              isUser
                ? { background: "#2c3fd6", color: "white" }
                : {
                    background: "rgba(255,255,255,0.75)",
                    color: "#1e2a45",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(180,196,230,0.35)",
                  }
            }
          >
            {content === "" ? (
              <span style={{ opacity: 0.4 }}>▌</span>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}*/}


import ReactMarkdown from "react-markdown";
import remarkMath    from "remark-math";
import rehypeKatex   from "rehype-katex";
import remarkGfm     from "remark-gfm";

export default function MessageBubble({ role, content, attachments = [] }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      style={{ animation: "msgIn 0.28s ease both" }}>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
        font-semibold select-none"
        style={
          isUser
            ? { background: "#1c2340", color: "white", fontSize: "0.7rem", fontWeight: 700 }
            : { background: "linear-gradient(135deg,#5b7fff,#3b5bdb)", color: "white",
                fontSize: "0.78rem", fontWeight: 700 }
        }>
        {isUser ? "You" : "N"}
      </div>

      <div className={`flex flex-col gap-2 max-w-[74%] ${isUser ? "items-end" : "items-start"}`}>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {attachments.map((a, i) =>
              a.preview ? (
                <img key={i} src={a.preview} alt={a.name}
                  className="max-w-[200px] max-h-[160px] rounded-2xl object-cover"
                  style={{ boxShadow: "0 4px 16px rgba(59,91,219,0.14)" }}/>
              ) : (
                <div key={i}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: "rgba(59,91,219,0.08)",
                    color: "#3b5bdb",
                    border: "1px solid rgba(59,91,219,0.16)",
                  }}>
                  <span>📎</span>
                  <span className="truncate max-w-[130px]">{a.name}</span>
                </div>
              )
            )}
          </div>
        )}

        {/* Bubble */}
        {content !== undefined && (
          <div
            className={`prose px-4 py-3 ${
              isUser ? "rounded-3xl rounded-br-lg" : "rounded-3xl rounded-bl-lg"
            }`}
            style={
              isUser
                ? {
                    background: "linear-gradient(135deg,#3b5bdb,#5b7fff)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(59,91,219,0.26)",
                  }
                : {
                    background: "rgba(255,255,255,0.88)",
                    color: "#1a2240",
                    border: "1px solid rgba(59,91,219,0.10)",
                    boxShadow: "0 2px 14px rgba(59,91,219,0.06)",
                    backdropFilter: "blur(8px)",
                  }
            }>
            {content === "" ? (
              <span style={{ opacity: 0.3 }}>▌</span>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}