"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
      callbackUrl: "/admin",
    });
    if (result?.ok) window.location.href = "/admin";
    else setError(true);
  }
  return (
    <main className="login-shell">
      <div className="login-card">
        <a className="brand" href="/">
          <span className="brand-mark">A</span>
          <span>
            ATELIER <b>MOTO</b>
          </span>
        </a>
        <p className="eyebrow">ESPACE PRIVE</p>
        <h1>Connexion.</h1>
        <form onSubmit={submit}>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Mot de passe
            <input name="password" type="password" required />
          </label>
          {error && <p className="login-error">Identifiants incorrects.</p>}
          <button className="button button-accent" type="submit">
            Ouvrir le tableau de bord ↗
          </button>
        </form>
        <a className="back-link" href="/">
          ← Retour au site
        </a>
      </div>
    </main>
  );
}
