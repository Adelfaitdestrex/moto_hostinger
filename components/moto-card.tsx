import Link from "next/link";
import type { Moto } from "@/types";
import { formatPrice, statusLabel } from "@/lib/demo-data";
export function MotoCard({ moto }: { moto: Moto }) {
  return (
    <article className="moto-card">
      <Link href={`/motos/${moto.id}`} className="moto-image-wrap">
        <img
          src={moto.images[0]}
          alt={`${moto.brand} ${moto.model}`}
          className="moto-image"
        />
        <span className={`status status-${moto.status}`}>
          <i />
          {statusLabel(moto.status)}
        </span>
        <span className="view-arrow">↗</span>
      </Link>
      <div className="moto-card-body">
        <div className="moto-meta">
          <span>{moto.category}</span>
          <span>{moto.year}</span>
        </div>
        <h3>
          {moto.brand} <strong>{moto.model}</strong>
        </h3>
        <div className="moto-specs">
          <span>{moto.engine}</span>
          <span>
            {moto.mileage
              ? `${moto.mileage.toLocaleString("fr-DZ")} km`
              : "Neuve"}
          </span>
        </div>
        <div className="moto-card-footer">
          <strong>{formatPrice(moto.price, moto.currency)}</strong>
          <Link href={`/motos/${moto.id}`}>
            Details <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
