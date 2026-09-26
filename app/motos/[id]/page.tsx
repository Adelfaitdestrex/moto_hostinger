import Link from "next/link";
import { notFound } from "next/navigation";
import { demoMotos, formatPrice, statusLabel } from "@/lib/demo-data";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFloat } from "@/components/whatsapp-float";

export function generateStaticParams() {
  return demoMotos.map((moto) => ({ id: String(moto.id) }));
}
export default async function MotoDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moto = demoMotos.find((item) => item.id === Number(id));
  if (!moto) notFound();
  const message = encodeURIComponent(
    `Bonjour, je vous contacte concernant la ${moto.brand} ${moto.model} a ${formatPrice(moto.price)}. Est-elle toujours disponible ?`,
  );
  return (
    <main>
      <SiteHeader />
      <section className="detail">
        <Link className="back-link" href="/motos">
          ← Retour au catalogue
        </Link>
        <div className="detail-layout">
          <div className="detail-gallery">
            <img src={moto.images[0]} alt={`${moto.brand} ${moto.model}`} />
          </div>
          <div className="detail-copy">
            <div className="moto-meta">
              <span>{moto.category}</span>
              <span>{moto.year}</span>
            </div>
            <h1>
              {moto.brand}
              <br />
              <em>{moto.model}</em>
            </h1>
            <div className={`status status-${moto.status}`}>
              <i />
              {statusLabel(moto.status)}
            </div>
            <strong className="detail-price">{formatPrice(moto.price)}</strong>
            <p className="detail-description">{moto.description}</p>
            <div className="detail-spec-grid">
              <span>
                <b>Cylindree</b>
                {moto.engine}
              </span>
              <span>
                <b>Kilometrage</b>
                {moto.mileage.toLocaleString("fr-DZ")} km
              </span>
              <span>
                <b>Transmission</b>
                {moto.transmission}
              </span>
              <span>
                <b>Carburant</b>
                {moto.fuel}
              </span>
              <span>
                <b>Couleur</b>
                {moto.color}
              </span>
              <span>
                <b>Etat</b>
                {moto.condition === "new" ? "Neuve" : "Occasion"}
              </span>
            </div>
            <div className="detail-actions">
              <a
                className="button button-whatsapp"
                href={`https://wa.me/?text=${message}`}
              >
                WhatsApp <span>↗</span>
              </a>
              <a className="button button-dark" href="tel:">
                Appeler
              </a>
            </div>
          </div>
        </div>
      </section>
      <WhatsappFloat />
    </main>
  );
}
