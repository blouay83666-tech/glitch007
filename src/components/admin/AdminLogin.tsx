"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid access key.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={login}
        className="w-full max-w-sm rounded-2xl border border-neutral-900 bg-panel p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Lock size={20} />
          </div>
          <h1 className="serif-title text-2xl text-white">GLITCH Admin</h1>
          <p className="mt-1 text-xs text-neutral-500">Staff portal — restricted access</p>
        </div>

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Access key"
          className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center text-sm text-white outline-none focus:border-gold"
        />
        {error && <p className="mb-3 text-center text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />} Enter
        </button>
      </form>
    </div>
  );
}
