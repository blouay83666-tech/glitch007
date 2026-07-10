"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import type { Category } from "@/lib/types";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const data = await fetch("/api/categories").then((r) => r.json());
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    setErr("");
    if (!id.trim() || !name.trim()) {
      setErr("Both fields are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Failed.");
        return;
      }
      setCategories(data.categories);
      setId("");
      setName("");
    } finally {
      setSaving(false);
    }
  }

  async function remove(catId: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories?id=${encodeURIComponent(catId)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      alert(data.error || "Failed to delete.");
      return;
    }
    setCategories(data.categories);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="serif-title text-3xl text-white">Categories</h1>
        <p className="mt-1 text-sm text-neutral-500">Organise your collections (e.g. broderie, hoodies).</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-fit rounded-2xl border border-neutral-900 bg-panel p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Add category</h2>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-neutral-500">
            ID (e.g. hoodie)
          </label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs lowercase text-white outline-none focus:border-gold"
          />
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-neutral-500">
            Name (e.g. Winter Hoodies)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
          />
          {err && <p className="mb-2 text-xs text-red-500">{err}</p>}
          <button
            onClick={add}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add category
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-900 bg-panel p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Current</h2>
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-xs"
              >
                <span>
                  <span className="mr-2 text-gold">[{c.id}]</span>
                  {c.name}
                </span>
                <button
                  onClick={() => remove(c.id)}
                  className="text-neutral-500 transition-colors hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-xs text-neutral-600">No categories.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
