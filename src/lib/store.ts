import { promises as fs } from "fs";
import path from "path";
import type { StoreData, Product, Category, Order, SliderSlide } from "./types";
import { supabaseAdmin, isSupabaseEnabled } from "./supabase";

// Data access layer. When Supabase is configured (production) all reads/writes
// go to Postgres so data persists durably. Otherwise it falls back to a local
// JSON file so `npm run dev` works with zero setup.

/* -------------------------------------------------------------------------- */
/*  Supabase row <-> app type mapping                                          */
/* -------------------------------------------------------------------------- */

type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  sizes: string[] | null;
  colors: string[] | null;
  description: string | null;
  images: string[] | null;
  featured: boolean | null;
};

const rowToProduct = (r: ProductRow): Product => ({
  id: r.id,
  name: r.name,
  category: r.category,
  price: r.price,
  oldPrice: r.old_price,
  sizes: r.sizes ?? [],
  colors: r.colors ?? [],
  description: r.description ?? "",
  images: r.images ?? [],
  featured: r.featured ?? false,
});

const productToRow = (p: Product): ProductRow => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  old_price: p.oldPrice,
  sizes: p.sizes,
  colors: p.colors,
  description: p.description,
  images: p.images,
  featured: p.featured ?? false,
});

type OrderRow = {
  id: string;
  created_at: string;
  customer: string;
  phone: string;
  wilaya: string | null;
  address: string | null;
  product: string;
  color: string;
  size: string;
  price: number;
  channel: Order["channel"];
  status: Order["status"];
};

const rowToOrder = (r: OrderRow): Order => ({
  id: r.id,
  date: r.created_at,
  customer: r.customer,
  phone: r.phone,
  wilaya: r.wilaya ?? "",
  address: r.address ?? "",
  product: r.product,
  color: r.color,
  size: r.size,
  price: r.price,
  channel: r.channel,
  status: r.status,
});

/* -------------------------------------------------------------------------- */
/*  JSON file fallback (local dev)                                             */
/* -------------------------------------------------------------------------- */

const DATA_FILE = path.join(process.cwd(), "data", "store.json");
let cache: StoreData | null = null;
const EMPTY: StoreData = { categories: [], products: [], orders: [], slider: [] };

async function readFile(): Promise<StoreData> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    cache = {
      categories: parsed.categories ?? [],
      products: parsed.products ?? [],
      orders: parsed.orders ?? [],
      slider: parsed.slider ?? [],
    };
  } catch {
    cache = { ...EMPTY };
  }
  return cache;
}

async function writeFile(data: StoreData): Promise<void> {
  cache = data;
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("store: could not persist to disk", err);
  }
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }
  return (await readFile()).products;
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Category[];
  }
  return (await readFile()).categories;
}

export async function getSlider(): Promise<SliderSlide[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("slider")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw error;
    return (data as (SliderSlide & { position: number })[]).map(({ id, image, title, subtitle }) => ({
      id,
      image,
      title,
      subtitle,
    }));
  }
  return (await readFile()).slider;
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as OrderRow[]).map(rowToOrder);
  }
  return (await readFile()).orders;
}

/** Insert or update a product; returns the saved product. */
export async function upsertProduct(product: Product): Promise<Product> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .upsert(productToRow(product))
      .select()
      .single();
    if (error) throw error;
    return rowToProduct(data as ProductRow);
  }
  const store = await readFile();
  const exists = store.products.some((p) => p.id === product.id);
  const products = exists
    ? store.products.map((p) => (p.id === product.id ? product : p))
    : [product, ...store.products];
  await writeFile({ ...store, products });
  return product;
}

export async function deleteProduct(id: number): Promise<void> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const store = await readFile();
  await writeFile({ ...store, products: store.products.filter((p) => p.id !== id) });
}

export async function addCategory(category: Category): Promise<Category[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("categories").insert(category);
    if (error) throw error;
    return getCategories();
  }
  const store = await readFile();
  const categories = [...store.categories, category];
  await writeFile({ ...store, categories });
  return categories;
}

export async function deleteCategory(id: string): Promise<Category[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw error;
    return getCategories();
  }
  const store = await readFile();
  const categories = store.categories.filter((c) => c.id !== id);
  await writeFile({ ...store, categories });
  return categories;
}

export async function categoryExists(id: string): Promise<boolean> {
  return (await getCategories()).some((c) => c.id === id);
}

export async function categoryHasProducts(id: string): Promise<boolean> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { count, error } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }
  return (await getProducts()).some((p) => p.category === id);
}

export async function addSlide(slide: SliderSlide): Promise<SliderSlide[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("slider").insert({ ...slide, position: Date.now() });
    if (error) throw error;
    return getSlider();
  }
  const store = await readFile();
  const slider = [...store.slider, slide];
  await writeFile({ ...store, slider });
  return slider;
}

export async function deleteSlide(id: string): Promise<SliderSlide[]> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("slider").delete().eq("id", id);
    if (error) throw error;
    return getSlider();
  }
  const store = await readFile();
  const slider = store.slider.filter((s) => s.id !== id);
  await writeFile({ ...store, slider });
  return slider;
}

export async function addOrder(order: Order): Promise<void> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("orders").insert({
      id: order.id,
      created_at: order.date,
      customer: order.customer,
      phone: order.phone,
      wilaya: order.wilaya,
      address: order.address,
      product: order.product,
      color: order.color,
      size: order.size,
      price: order.price,
      channel: order.channel,
      status: order.status,
    });
    if (error) throw error;
    return;
  }
  const store = await readFile();
  await writeFile({ ...store, orders: [order, ...store.orders] });
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  if (isSupabaseEnabled && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
    return;
  }
  const store = await readFile();
  const orders = store.orders.map((o) => (o.id === id ? { ...o, status } : o));
  await writeFile({ ...store, orders });
}
