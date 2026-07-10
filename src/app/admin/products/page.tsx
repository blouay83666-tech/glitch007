"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { formatDA } from "@/lib/format";
import { processImageFile } from "@/lib/clientImage";

interface Draft {
  id?: number;
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  colors: string;
  sizes: string;
  description: string;
  featured: boolean;
  images: string[];
}

const emptyDraft = (category: string): Draft => ({
  name: "",
  category,
  price: "",
  oldPrice: "",
  colors: "",
  sizes: "S, M, L, XL",
  description: "",
  featured: false,
  images: [],
});

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft(""));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setProducts(p.products || []);
    setCategories(c.categories || []);
    setDraft((d) => ({ ...d, category: d.category || c.categories?.[0]?.id || "" }));
  }

  useEffect(() => {
    load();
  }, []);

  function editProduct(p: Product) {
    setDraft({
      id: p.id,
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      colors: (p.colors || []).join(", "),
      sizes: (p.sizes || []).join(", "),
      description: p.description || "",
      featured: !!p.featured,
      images: p.images || [],
    });
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setDraft(emptyDraft(categories[0]?.id || ""));
    setMsg("");
    setErr("");
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const imgs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        imgs.push(await processImageFile(files[i]));
      }
      setDraft((d) => ({ ...d, images: [...d.images, ...imgs].slice(0, 8) }));
    } catch {
      setErr("Could not process one of the images.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(idx: number) {
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));
  }

  async function save() {
    setErr("");
    setMsg("");
    if (!draft.name.trim() || !draft.price) {
      setErr("Name and price are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          name: draft.name,
          category: draft.category,
          price: parseInt(draft.price, 10),
          oldPrice: draft.oldPrice ? parseInt(draft.oldPrice, 10) : null,
          colors: draft.colors.split(",").map((s) => s.trim()).filter(Boolean),
          sizes: draft.sizes.split(",").map((s) => s.trim()).filter(Boolean),
          description: draft.description,
          images: draft.images,
          featured: draft.featured,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Save failed.");
        return;
      }
      setMsg(draft.id ? "Product updated." : "Product added.");
      await load();
      if (!draft.id) resetForm();
      else setDraft((d) => ({ ...d, id: data.product.id }));
    } catch {
      setErr("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (draft.id === id) resetForm();
    load();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="serif-title text-3xl text-white">Products</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Add or edit pieces — including new <span className="text-gold">broderie</span> designs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 rounded-2xl border border-neutral-900 bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gold">
                {draft.id ? "Edit product" : "New product"}
              </h2>
              {draft.id && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[10px] font-bold text-white hover:text-gold"
                >
                  <Plus size={11} /> New
                </button>
              )}
            </div>

            <Label>Name</Label>
            <Input value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />

            <Label>Category</Label>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (DA)</Label>
                <Input value={draft.price} onChange={(v) => setDraft({ ...draft, price: v })} type="number" />
              </div>
              <div>
                <Label>Old price (opt.)</Label>
                <Input value={draft.oldPrice} onChange={(v) => setDraft({ ...draft, oldPrice: v })} type="number" />
              </div>
            </div>

            <Label>Colors (comma separated)</Label>
            <Input value={draft.colors} onChange={(v) => setDraft({ ...draft, colors: v })} />

            <Label>Sizes (comma separated)</Label>
            <Input value={draft.sizes} onChange={(v) => setDraft({ ...draft, sizes: v })} />

            <Label>Description</Label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="mb-3 h-20 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
            />

            <label className="mb-3 flex items-center gap-2 text-xs text-neutral-400">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                className="accent-gold"
              />
              Mark as signature / featured
            </label>

            <Label>Images</Label>
            <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-900 p-3 text-xs text-neutral-400 hover:border-gold hover:text-gold">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Processing…" : "Upload images"}
              <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </label>

            {draft.images.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {draft.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-800">
                    <Image src={img} alt="" fill className="object-cover" unoptimized={img.startsWith("data:")} />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white hover:text-red-400"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {err && <p className="mb-2 text-xs text-red-500">{err}</p>}
            {msg && <p className="mb-2 text-xs text-emerald-500">{msg}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {draft.id ? "Save changes" : "Add product"}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-neutral-900 bg-panel p-4"
            >
              <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                {p.images?.[0] && (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={p.images[0].startsWith("data:")}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="serif-title truncate text-sm text-white">{p.name}</h4>
                <div className="text-[11px] text-neutral-500">
                  <span className="text-gold">{formatDA(p.price)}</span> ·{" "}
                  {categories.find((c) => c.id === p.category)?.name || p.category}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => editProduct(p)}
                  className="rounded border border-neutral-700 p-1.5 text-neutral-300 hover:border-gold hover:text-gold"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded border border-neutral-700 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-xs text-neutral-600">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[10px] uppercase tracking-widest text-neutral-500">{children}</label>;
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none focus:border-gold"
    />
  );
}
