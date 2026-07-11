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
              href="https://instagram.com/glitch.007"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-gold"
            >
              <Instagram size={16} /> @glitch.007
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
