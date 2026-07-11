"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "./MusicProvider";

const links = [
  { href: "#collections", label: "Collections" },
  { href: "#broderie", label: "Broderie" },
  { href: "#about", label: "The House" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { playing, toggle } = useMusic();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 z-40 w-full border-b px-4 py-4 transition-all duration-300 md:px-8 ${
        scrolled ? "glass border-neutral-900" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="serif-title text-xl font-medium tracking-[0.3em] text-white md:text-2xl">
          GLITCH <span className="font-sans text-[10px] tracking-normal text-neutral-500">2026</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggle}
            aria-label={playing ? "Mute music" : "Play music"}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-gold"
          >
            {playing ? (
              <>
                <span>Audio</span>
                <Volume2 size={15} className="text-gold" />
              </>
            ) : (
              <>
                <span>Muted</span>
                <VolumeX size={15} />
              </>
            )}
          </button>
          <a
            href="#collections"
            className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
          >
            <ShoppingBag size={14} /> Shop
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggle}
            aria-label={playing ? "Mute music" : "Play music"}
            className="text-neutral-300 hover:text-gold"
          >
            {playing ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} />}
          </button>
          <button
            className="text-white"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-4 border-t border-neutral-900 pt-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-neutral-300 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
