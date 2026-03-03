"use client";

import { useEffect, useState } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "ok">("checking");

  useEffect(() => {
    if (document.cookie.includes("site-auth=")) {
      setStatus("ok");
    } else {
      setStatus("locked");
    }
  }, []);

  useEffect(() => {
    if (status !== "locked") return;

    const pw = prompt("Parola chiave per accedere:");
    if (!pw) return;

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    }).then((r) => {
      if (r.ok) {
        setStatus("ok");
      } else {
        alert("Parola chiave errata.");
        window.location.reload();
      }
    });
  }, [status]);

  if (status === "ok") return <>{children}</>;

  return null;
}
