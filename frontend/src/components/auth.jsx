import { useState } from "react";
import { apiLogin, apiRegister } from "../api";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");   // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await apiLogin(username.trim().toLowerCase(), password)
          : await apiRegister(username.trim().toLowerCase(), password);
      onAuth(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(160deg,#e8eef8,#f0f4fc,#e4ecf7)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-xl"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(180,196,230,0.45)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: "#2c3fd6" }}>
            Nchat
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#5a6580" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            className="rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: "rgba(240,244,252,0.8)",
              border: "1px solid rgba(180,196,230,0.5)",
              color: "#1e2a45",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            className="rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: "rgba(240,244,252,0.8)",
              border: "1px solid rgba(180,196,230,0.5)",
              color: "#1e2a45",
            }}
          />

          {error && (
            <p className="text-xs text-red-500 px-1">{error}</p>
          )}

          <button
            onClick={handle}
            disabled={loading}
            className="mt-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity"
            style={{
              background: "#2c3fd6",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Toggle */}
        <p className="mt-5 text-center text-xs" style={{ color: "#5a6580" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="font-semibold underline"
            style={{ color: "#2c3fd6" }}
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}