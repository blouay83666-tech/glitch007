"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload, Plus } from "lucide-react";
import type { SliderSlide } from "@/lib/types";
import { processImageFile } from "@/lib/clientImage";

export default function SliderAdmin() {
  const [slides, setSlides] = useState<SliderSlide[]>([]);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const data = await fetch("/api/slider").then((r) => r.json());
    setSlides(data.slider || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImage(await processImageFile(file, 1600, 0.75));
    } catch {
      setErr("Could not process image.");
    } finally {
      setUploading(false);
    }
  }

  async function add() {
    setErr("");
    if (!image || !title.trim()) {
      setErr("Image and title are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, title, subtitle }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Failed.");
        return;
      }
      setSlides(data.slider);
      setImage("");
      setTitle("");
      setSubtitle("");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this slide?")) return;
    const res = await fetch(`/api/slider?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await res.json();
    setSlides(data.slider || []);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="serif-title text-3xl text-white">Hero slider</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage the campaign slides shown on the homepage banner.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-fit rounded-2xl border border-neutral-900 bg-panel p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">Add slide</h2>

          <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-900 p-4 text-xs text-neutral-400 hover:border-gold hover:text-gold">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "Processing…" : "Upload image"}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>

          {image && (
            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg border border-neutral-800">
              <Image src={image} alt="" fill className="object-cover" unoptimized={image.startsWith("data:")} />
            </div>
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. HAUTE COUTURE)"
            className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (e.g. Capsule // 04)"
            className="mb-4 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
          />

          {err && <p className="mb-2 text-xs text-red-500">{err}</p>}
          <button
            onClick={add}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add slide
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-900 bg-panel p-3"
            >
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-800">
                <Image src={s.image} alt="" fill className="object-cover" unoptimized={s.image.startsWith("data:")} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="serif-title truncate text-sm text-white">{s.title}</div>
                <div className="text-[11px] text-neutral-500">{s.subtitle}</div>
              </div>
              <button
                onClick={() => remove(s.id)}
                className="rounded border border-neutral-700 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {slides.length === 0 && <p className="text-xs text-neutral-600">No slides.</p>}
        </div>
      </div>
    </div>
  );
}
