import nodemailer from "nodemailer";
import type { Order } from "./types";
import { formatDA } from "./format";

// Sends an order email only if SMTP is configured via env vars. Returns true on
// success, false if SMTP is not configured or sending failed (the order is still
// stored server-side and can be recovered from the admin panel / WhatsApp).
export async function sendOrderEmail(order: Order): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_EMAIL_FROM, ORDER_EMAIL_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "email: SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) — " +
        "order was saved but no email was sent. Configure SMTP to receive orders by email."
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // Cart orders put one item per line in `product`; convert newlines to <br>
    // so the itemised list renders across lines in the email.
    const productHtml = order.product.replace(/\n/g, "<br>");

    const rows: [string, string][] = [
      ["Customer", order.customer],
      ["Phone", order.phone],
      ["Wilaya", order.wilaya || "-"],
      ["Address", order.address || "-"],
      ["Product", productHtml],
      ["Color", order.color],
      ["Size", order.size],
      ["Total", formatDA(order.price)],
      ["Date", order.date],
    ];

    const html = `
      <h2 style="font-family:sans-serif">GLITCH 2026 — New Order</h2>
      <table style="font-family:sans-serif;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px;color:#888">${k}</td><td style="padding:6px 12px;font-weight:600">${v}</td></tr>`
          )
          .join("")}
      </table>`;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || SMTP_USER,
      to: ORDER_EMAIL_TO || SMTP_USER,
      subject: `New GLITCH order — ${order.product}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("email: failed to send order", err);
    return false;
  }
}
