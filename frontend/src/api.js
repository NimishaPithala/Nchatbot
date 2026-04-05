const BASE = import.meta.env.VITE_API_URL;

// Each browser gets a permanent random ID stored in localStorage
function getBrowserId() {
  let id = localStorage.getItem("browser_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("browser_id", id);
  }
  return id;
}

function headers(extra = {}) {
  return {
    "x-browser-id": getBrowserId(),
    ...extra,
  };
}

export async function apiGetSessions() {
  const res = await fetch(`${BASE}/sessions`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function apiNewSession() {
  const res = await fetch(`${BASE}/sessions`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function apiDeleteSession(sessionId) {
  await fetch(`${BASE}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: headers(),
  });
}

export async function apiGetMessages(sessionId) {
  const res = await fetch(`${BASE}/sessions/${sessionId}/messages`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function apiChat(sessionId, message, file, onChunk) {
  const form = new FormData();
  form.append("session_id", sessionId);
  form.append("message", message || "");
  if (file) form.append("file", file);

  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: headers(), // no Content-Type — FormData sets it automatically
    body: form,
  });

  if (!res.ok) throw new Error(await res.text() || "Chat failed");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value || new Uint8Array()));
  }
}