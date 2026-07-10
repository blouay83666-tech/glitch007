export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  colors: string[];
  description: string;
  images: string[];
  featured?: boolean;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  phone: string;
  wilaya?: string;
  address?: string;
  product: string;
  color: string;
  size: string;
  price: number;
  channel: "whatsapp" | "email";
  status: "new" | "confirmed" | "delivered" | "cancelled";
}

export interface StoreData {
  categories: Category[];
  products: Product[];
  orders: Order[];
  slider: SliderSlide[];
}

export interface SliderSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}
