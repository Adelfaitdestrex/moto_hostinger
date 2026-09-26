"use client";
import { useMemo, useState } from "react";
import { demoMotos, formatPrice } from "@/lib/demo-data";
import { MotoCard } from "@/components/moto-card";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFloat } from "@/components/whatsapp-float";

export default function MotosPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [sort, setSort] = useState("recent");
  const motos = useMemo(
    () =>
      demoMotos
        .filter((moto) => {
          const text = `${moto.brand} ${moto.model}`.toLowerCase();
          return (
            (category === "Toutes" || moto.category === category) &&
            text.includes(query.toLowerCase())
          );
        })
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : b.year - a.year,
        ),
    [category, query, sort],
  );
  return (
    <main>
      <SiteHeader />
      <section className="catalogue-head">
        <p className="eyebrow">LE GARAGE DIGITAL</p>
        <h1>
          Le catalogue
          <br />
          <em>Atelier Moto.</em>
        </h1>
        <p>
          Des motos choisies pour leur caractere, leur fiabilite et le plaisir
          qu elles promettent.
        </p>
      </section>
      <section className="catalogue">
        <div className="catalogue-toolbar">
          <label className="search-field">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une marque ou un modele"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Toutes</option>
            <option>Naked</option>
            <option>Sportive</option>
            <option>Scooter</option>
            <option>Trail</option>
            <option>Touring</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="recent">Plus recentes</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix decroissant</option>
          </select>
        </div>
        <div className="catalogue-count">
          <span>{motos.length} motos trouvees</span>
          <span>Prix en dinars algeriens</span>
        </div>
        {motos.length ? (
          <div className="moto-grid catalogue-grid">
            {motos.map((moto) => (
              <MotoCard key={moto.id} moto={moto} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Aucune moto ne correspond a votre recherche.
          </div>
        )}
      </section>
      <WhatsappFloat />
    </main>
  );
}
