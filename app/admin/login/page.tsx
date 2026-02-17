"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? "Invalid credentials");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full space-y-4 rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          placeholder="Username"
          className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/20 px-4 py-2 text-fuchsia-200 disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
