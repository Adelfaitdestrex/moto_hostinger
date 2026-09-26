import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { phpRequest } from "@/lib/php-api";
import { AdminMotoManager } from "@/components/admin-moto-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");
  const motosResponse = await phpRequest("motos");
  const motos = (await motosResponse.json()) as {
    status: string;
    featured: boolean;
  }[];
  const total = motos.length;
  const available = motos.filter((moto) => moto.status === "available").length;
  const sold = motos.filter((moto) => moto.status === "sold").length;
  const featured = motos.filter((moto) => moto.featured).length;
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <strong>
          ATELIER <span>MOTO</span>
        </strong>
        <a href="/api/auth/signout">Deconnexion</a>
      </header>
      <section className="admin-content">
        <p className="eyebrow">ESPACE ADMINISTRATION</p>
        <h1>Tableau de bord.</h1>
        <p className="admin-welcome">
          Bienvenue, {session.user.name ?? "administrateur"}.
        </p>
        <div className="admin-stats">
          <div>
            <small>Total motos</small>
            <strong>{total}</strong>
          </div>
          <div>
            <small>Disponibles</small>
            <strong>{available}</strong>
          </div>
          <div>
            <small>Vendues</small>
            <strong>{sold}</strong>
          </div>
          <div>
            <small>Mises en avant</small>
            <strong>{featured}</strong>
          </div>
        </div>
        <div className="admin-panel">
          <h2>Gestion du catalogue</h2>
          <p>
            Ajoutez, modifiez et supprimez vos motos depuis votre interface de
            gestion.
          </p>
          <a className="button button-accent" href="/motos">
            Voir le catalogue public
          </a>
          <a className="admin-panel-link" href="/admin/settings">
            Parametres de la concession ↗
          </a>
        </div>
        <AdminMotoManager />
      </section>
    </main>
  );
}
