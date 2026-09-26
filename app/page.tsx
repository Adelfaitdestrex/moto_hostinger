import Link from "next/link";
import { demoMotos, demoSettings } from "@/lib/demo-data";
import { MotoCard } from "@/components/moto-card";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFloat } from "@/components/whatsapp-float";

export default function Home() {
  const featured = demoMotos.filter((moto) => moto.featured);
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            CONCESSION MOTO · {demoSettings.wilaya.toUpperCase()}
          </p>
          <h1>
            Votre prochaine
            <br />
            <em>moto</em> commence ici.
          </h1>
          <p className="hero-text">
            Une selection exigeante de machines qui donnent envie de prendre la
            route. Neuve ou d occasion, trouvez celle qui vous ressemble.
          </p>
          <div className="hero-actions">
            <Link className="button button-accent" href="/motos">
              Explorer le catalogue <span>↗</span>
            </Link>
            <a className="button button-ghost" href="#contact">
              Parler a un conseiller
            </a>
          </div>
        </div>
        <div className="hero-bike">
          <img src={featured[0].images[0]} alt="Moto premium" />
          <div className="hero-caption">
            <span>01</span>
            <span>MT-07 · YAMAHA</span>
            <span>→</span>
          </div>
        </div>
        <div className="hero-scroll">
          DEFILER <span>↓</span>
        </div>
      </section>
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LA SELECTION</p>
            <h2>
              Des motos qui ont
              <br />
              <em>du caractere.</em>
            </h2>
          </div>
          <Link className="text-link" href="/motos">
            Voir tout le catalogue <span>↗</span>
          </Link>
        </div>
        <div className="moto-grid">
          {featured.map((moto) => (
            <MotoCard key={moto.id} moto={moto} />
          ))}
        </div>
      </section>
      <section className="manifesto">
        <div className="manifesto-number">01</div>
        <div>
          <p className="eyebrow">POURQUOI ATELIER MOTO</p>
          <h2>
            Pas seulement
            <br />
            une <em>moto.</em>
          </h2>
        </div>
        <p>
          Nous croyons qu une moto doit etre choisie avec autant de soin qu elle
          est conduite. Chaque modele est inspecte, presente avec transparence
          et accompagne de conseils qui comptent.
        </p>
      </section>
      <section id="contact" className="contact-band">
        <div>
          <p className="eyebrow">PRENDRE CONTACT</p>
          <h2>La route vous attend.</h2>
          <p>
            Les coordonnees de la concession seront configurees depuis l espace
            administrateur.
          </p>
        </div>
        <div className="contact-actions">
          <span className="contact-placeholder">Telephone a configurer</span>
          <span className="contact-placeholder">WhatsApp a configurer</span>
        </div>
      </section>
      <footer>
        <span>© 2026 ATELIER MOTO</span>
        <span>Une maison de motos en Algerie</span>
        <Link href="/admin">Acces administration</Link>
      </footer>
      <WhatsappFloat />
    </main>
  );
}
