"use client";
import { FormEvent, useEffect, useState } from "react";
import type { Moto } from "@/types";

const empty = {
  brand: "",
  model: "",
  category: "Naked",
  year: "2026",
  price: "",
  status: "available",
};
export function AdminMotoManager() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch("/api/motos", { cache: "no-store" });
    if (response.ok) setMotos(await response.json());
  }
  useEffect(() => {
    void load();
  }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const input = event.currentTarget.elements.namedItem("images");
    const files = input instanceof HTMLInputElement ? input.files : null;
    let images: string[] = [];
    if (files?.length) {
      const uploadData = new FormData();
      Array.from(files).forEach((file) => uploadData.append("files", file));
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!uploadResponse.ok) {
        setMessage("Upload refuse : JPG, PNG ou WEBP de 8 Mo maximum.");
        return;
      }
      images = (await uploadResponse.json()).urls;
    }
    const response = await fetch("/api/motos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images }),
    });
    if (response.ok) {
      setForm(empty);
      event.currentTarget.reset();
      setMessage("Moto ajoutee.");
      void load();
    } else setMessage("Impossible d ajouter la moto.");
  }
  async function updateStatus(id: number, status: string) {
    const response = await fetch(`/api/motos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) void load();
  }
  async function remove(id: number) {
    if (!window.confirm("Supprimer cette moto ?")) return;
    const response = await fetch(`/api/motos/${id}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Moto supprimee.");
      void load();
    }
  }
  return (
    <div className="admin-manager">
      <div className="admin-manager-form">
        <h2>Ajouter une moto</h2>
        <form onSubmit={create}>
          <div className="admin-form-grid">
            <input
              required
              placeholder="Marque"
              value={form.brand}
              onChange={(event) =>
                setForm({ ...form, brand: event.target.value })
              }
            />
            <input
              required
              placeholder="Modele"
              value={form.model}
              onChange={(event) =>
                setForm({ ...form, model: event.target.value })
              }
            />
            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              <option>Naked</option>
              <option>Sportive</option>
              <option>Scooter</option>
              <option>Trail</option>
              <option>Custom</option>
              <option>Enduro</option>
              <option>Touring</option>
            </select>
            <input
              required
              type="number"
              placeholder="Annee"
              value={form.year}
              onChange={(event) =>
                setForm({ ...form, year: event.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Prix en DA"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
            >
              <option value="available">Disponible</option>
              <option value="reserved">Reservee</option>
              <option value="sold">Vendue</option>
            </select>
          </div>
          <label className="admin-upload">
            Photos
            <input
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
            />
          </label>
          <button className="button button-accent" type="submit">
            Ajouter la moto ↗
          </button>
          {message && <span className="admin-message">{message}</span>}
        </form>
      </div>
      <div className="admin-manager-list">
        <h2>
          Motos du catalogue <small>{motos.length}</small>
        </h2>
        {motos.length === 0 ? (
          <p className="admin-muted">
            Aucune moto en base. Ajoutez votre premiere moto ci-dessus.
          </p>
        ) : (
          motos.map((moto) => (
            <div className="admin-moto-row" key={moto.id}>
              <div>
                <strong>
                  {moto.brand} {moto.model}
                </strong>
                <small>
                  {moto.year} · {moto.price.toLocaleString("fr-DZ")} DA
                </small>
              </div>
              <select
                value={moto.status}
                onChange={(event) =>
                  void updateStatus(moto.id, event.target.value)
                }
              >
                <option value="available">Disponible</option>
                <option value="reserved">Reservee</option>
                <option value="sold">Vendue</option>
              </select>
              <button
                className="admin-delete"
                onClick={() => void remove(moto.id)}
                aria-label={`Supprimer ${moto.brand} ${moto.model}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
