import { MessageCircle, Mail, Instagram, Lock } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_NUMBER, STORE_EMAIL } from "@/lib/format";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-neutral-900 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3 md:px-8">
        <div>
          <div className="serif-title text-2xl tracking-[0.3em] text-white">
            GLITCH <span className="font-sans text-[10px] text-neutral-500">2026</span>
          </div>
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-neutral-500">
            Neo-street luxury and hand-finished broderie. Designed for those who wear the future.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-gold">Order &amp; Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-neutral-400">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <MessageCircle size={16} /> WhatsApp order
            </a>
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <Mail size={16} /> {STORE_EMAIL}
            </a>
            <a
              href="https://instagram.com/glitch_club_007"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <Instagram size={16} /> @glitch_club_007
            </a>
            <a
              href="https://www.tiktok.com/@.glitch007"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <TikTokIcon size={16} /> @.glitch007
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-gold">House</h4>
          <div className="flex flex-col gap-3 text-sm text-neutral-400">
            <a href="#collections" className="transition-colors hover:text-gold">Collections</a>
            <Link href="/admin" className="flex items-center gap-2 transition-colors hover:text-gold">
              <Lock size={13} /> Staff portal
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900 py-6 text-center text-[11px] tracking-widest text-neutral-600">
        &copy; 2026 GLITCH GLOBAL. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}

// lucide-react has no TikTok glyph, so we use an inline SVG matching the icon size.
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 3c.3 2.2 1.6 3.6 3.7 3.8v2.4c-1.2.1-2.3-.2-3.6-.9v5.9c0 3.4-2.5 5.8-5.8 5.8-2.8 0-5.1-2-5.1-4.9 0-3 2.4-5 5.4-4.7v2.6c-.4-.1-.8-.2-1.2-.1-1.2.1-2 .9-1.9 2.1.1 1.1 1 1.9 2.1 1.8 1.3-.1 2-1 2-2.4V3h3.4z" />
    </svg>
  );
}
