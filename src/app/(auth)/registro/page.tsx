"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/mock/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = signUp(name, email, password);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push("/app");
  }

  return (
    <>
      <h1 className="text-[26px]">Creá tu cuenta</h1>
      <p className="mt-2 text-[14px] text-text-soft">
        Gratis, y solo para guardar tus páginas en un solo lugar — nunca hizo falta para crear
        y compartir una página.
      </p>
      <form onSubmit={handleSubmit} className="mt-7">
        <Field label="Nombre">
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vos@email.com"
          />
        </Field>
        <Field label="Contraseña" hint="Mínimo 6 caracteres.">
          <Input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        {error && <p className="mt-3 text-[13px] text-error">{error}</p>}
        <Button type="submit" block className="mt-7" disabled={loading}>
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[13.5px] text-text-soft">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-text underline underline-offset-4">
          Iniciá sesión
        </Link>
      </p>
      <p className="mt-8 rounded-[12px] border border-line bg-surface px-4 py-3.5 text-[12.5px] text-text-faint">
        Esto es una demo funcional: la cuenta se guarda en tu navegador, no hay servidor de
        autenticación real detrás todavía. Ver <code className="text-text-soft">BACKEND.md</code>.
      </p>
    </>
  );
}
