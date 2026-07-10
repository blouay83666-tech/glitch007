import { promises as fs } from "fs";
import path from "path";
import type { StoreData, Product, Category, Order, SliderSlide } from "./types";

// File-based JSON store. On serverless/ephemeral hosts the filesystem may be
// read-only or reset between deploys — writes are best-effort and mirrored in
// memory so the running instance stays consistent.
const DATA_FILE = path.join(process.cwd(), "data", "store.json");

let cache: StoreData | null = null;

const EMPTY: StoreData = { categories: [], products: [], orders: [], slider: [] };

async function readFromDisk(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    return {
      categories: parsed.categories ?? [],
      products: parsed.products ?? [],
      orders: parsed.orders ?? [],
      slider: parsed.slider ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

export async function getStore(): Promise<StoreData> {
  if (!cache) {
    cache = await readFromDisk();
  }
  return cache;
}

async function persist(data: StoreData): Promise<void> {
  cache = data;
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Read-only FS (e.g. serverless): keep the in-memory copy for this instance.
    console.warn("store: could not persist to disk", err);
  }
}

export async function getProducts(): Promise<Product[]> {
  return (await getStore()).products;
}

export async function getCategories(): Promise<Category[]> {
  return (await getStore()).categories;
}

export async function getSlider(): Promise<SliderSlide[]> {
  return (await getStore()).slider;
}

export async function getOrders(): Promise<Order[]> {
  return (await getStore()).orders;
}

export async function saveProducts(products: Product[]): Promise<void> {
  const data = await getStore();
  await persist({ ...data, products });
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const data = await getStore();
  await persist({ ...data, categories });
}

export async function saveSlider(slider: SliderSlide[]): Promise<void> {
  const data = await getStore();
  await persist({ ...data, slider });
}

export async function addOrder(order: Order): Promise<void> {
  const data = await getStore();
  await persist({ ...data, orders: [order, ...data.orders] });
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const data = await getStore();
  const orders = data.orders.map((o) => (o.id === id ? { ...o, status } : o));
  await persist({ ...data, orders });
}
