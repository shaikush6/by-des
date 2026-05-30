"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <h1
          className="text-4xl font-heading gold-shimmer"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          By Des
        </h1>
        <p className="text-sm text-muted-foreground">הכניסי את קוד הגישה</p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••••"
            className={`w-full text-center text-lg tracking-widest border rounded-2xl px-4 py-4 bg-white outline-none transition-all
              ${error ? "border-red-400 shake" : "border-border focus:border-gold"}`}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500">קוד שגוי — נסי שוב</p>
          )}
          <button
            type="submit"
            disabled={!code || loading}
            className="w-full py-4 rounded-2xl bg-gold text-white font-semibold text-base
                       hover:bg-gold-dark transition-colors disabled:opacity-40"
          >
            {loading ? "..." : "כניסה →"}
          </button>
        </form>
      </div>
    </div>
  );
}
