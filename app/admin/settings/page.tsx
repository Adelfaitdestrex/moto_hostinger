"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/types";

const defaults: Partial<Settings> = {
  name: "",
  description: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  wilaya: "",
  instagram: "",
  facebook: "",
  openingHours: "",
  accentColor: "#e4492f",
  currency: "DA",
  showPrices: true,
  showSoldMotos: true,
  whatsappBtnText: "Contacter sur WhatsApp",
};
export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Settings>>(defaults);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => {
        if (data) setForm({ ...defaults, ...data });
      });
  }, []);
  function change(key: keyof Settings, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMessage(
      response.ok
        ? "Parametres enregistres."
        : "Impossible d enregistrer les parametres.",
    );
  }
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <strong>
          ATELIER <span>MOTO</span>
        </strong>
        <button className="admin-back" onClick={() => router.push("/admin")}>
          ← Dashboard
        </button>
      </header>
      <section className="admin-content settings-page">
        <p className="eyebrow">CONFIGURATION</p>
        <h1>Les parametres.</h1>
        <form className="settings-form" onSubmit={save}>
          <div className="settings-section">
            <h2>La concession</h2>
            <div className="settings-grid">
              <label>
                Nom
                <input
                  value={form.name ?? ""}
                  onChange={(event) => change("name", event.target.value)}
                />
              </label>
              <label>
                Wilaya
                <input
                  value={form.wilaya ?? ""}
                  onChange={(event) => change("wilaya", event.target.value)}
                />
              </label>
              <label>
                Telephone
                <input
                  value={form.phone ?? ""}
                  onChange={(event) => change("phone", event.target.value)}
                />
              </label>
              <label>
                WhatsApp
                <input
                  value={form.whatsapp ?? ""}
                  onChange={(event) => change("whatsapp", event.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(event) => change("email", event.target.value)}
                />
              </label>
              <label>
                Adresse
                <input
                  value={form.address ?? ""}
                  onChange={(event) => change("address", event.target.value)}
                />
              </label>
              <label>
                Instagram
                <input
                  value={form.instagram ?? ""}
                  onChange={(event) => change("instagram", event.target.value)}
                />
              </label>
              <label>
                Horaires
                <input
                  value={form.openingHours ?? ""}
                  onChange={(event) =>
                    change("openingHours", event.target.value)
                  }
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                value={form.description ?? ""}
                onChange={(event) => change("description", event.target.value)}
              />
            </label>
          </div>
          <div className="settings-section">
            <h2>Affichage</h2>
            <div className="settings-grid">
              <label>
                Devise
                <input
                  value={form.currency ?? "DA"}
                  onChange={(event) => change("currency", event.target.value)}
                />
              </label>
              <label>
                Couleur accent
                <input
                  type="color"
                  value={form.accentColor ?? "#e4492f"}
                  onChange={(event) =>
                    change("accentColor", event.target.value)
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(form.showPrices)}
                  onChange={(event) =>
                    change("showPrices", event.target.checked)
                  }
                />{" "}
                Afficher les prix
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(form.showSoldMotos)}
                  onChange={(event) =>
                    change("showSoldMotos", event.target.checked)
                  }
                />{" "}
                Afficher les motos vendues
              </label>
            </div>
            <label>
              Texte du bouton WhatsApp
              <input
                value={form.whatsappBtnText ?? ""}
                onChange={(event) =>
                  change("whatsappBtnText", event.target.value)
                }
              />
            </label>
          </div>
          <button className="button button-accent" type="submit">
            Enregistrer les parametres ↗
          </button>
          {message && <span className="admin-message">{message}</span>}
        </form>
      </section>
    </main>
  );
}
