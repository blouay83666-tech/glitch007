export const formatDA = (num: number): string =>
  new Intl.NumberFormat("en-DZ").format(num) + " DA";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "213781605997";
export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "blouay8366@gmail.com";

interface OrderLike {
  customer: string;
  phone: string;
  wilaya?: string;
  address?: string;
  product: string;
  color: string;
  size: string;
  price: number;
}

export function buildWhatsappMessage(o: OrderLike): string {
  const lines = [
    "🛍️ *GLITCH 2026 — New Order*",
    "",
    `👤 Name: ${o.customer}`,
    `📞 Phone: ${o.phone}`,
    o.wilaya ? `📍 Wilaya: ${o.wilaya}` : "",
    o.address ? `🏠 Address: ${o.address}` : "",
    "",
    `👕 Product: ${o.product}`,
    `🎨 Color: ${o.color}`,
    `📏 Size: ${o.size}`,
    `💰 Total: ${formatDA(o.price)}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildWhatsappUrl(o: OrderLike, number = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(o))}`;
}
