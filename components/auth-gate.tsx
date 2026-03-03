"use client";

import { useEffect, useState, FormEvent } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "ok">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.cookie.includes("site-auth=")) {
      setStatus("ok");
    } else {
      setStatus("locked");
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setStatus("ok");
    } else {
      setError(true);
      setPassword("");
      setLoading(false);
    }
  }

  if (status === "checking") return null;
  if (status === "ok") return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f3" }}>
      <div
        className="w-full max-w-sm rounded-lg p-8"
        style={{ background: "#ffffff", border: "1px solid #e8e8e6" }}
      >
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: "#111" }}>
            TEDx<span style={{ color: "#E62B1E" }}>Conegliano</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "#666" }}>
            Social Copy Agent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parola chiave"
              autoFocus
              className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
              style={{
                border: error ? "1px solid #E62B1E" : "1px solid #e8e8e6",
                color: "#222",
              }}
            />
            {error && (
              <p className="text-xs mt-1.5" style={{ color: "#E62B1E" }}>
                Parola chiave errata. Riprova.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: "#E62B1E" }}
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
