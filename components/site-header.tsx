"use client";
import Link from "next/link";
import { useState } from "react";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={() => setOpen(false)}>
        <span className="brand-mark">A</span>
        <span>
          ATELIER <b>MOTO</b>
        </span>
      </Link>
      <button
        className="menu-button"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <Link href="/" onClick={() => setOpen(false)}>
          Accueil
        </Link>
        <Link href="/motos" onClick={() => setOpen(false)}>
          Le catalogue
        </Link>
        <a href="#contact" onClick={() => setOpen(false)}>
          Nous trouver
        </a>
        <Link className="nav-cta" href="/motos" onClick={() => setOpen(false)}>
          Voir les motos <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
