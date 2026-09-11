"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/mock/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = signIn(email, password);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push(searchParams.get("next") || "/app");
  }

  return (
    <>
      <h1 className="text-[26px]">Iniciar sesión</h1>
      <p className="mt-2 text-[14px] text-text-soft">
        Para ver y editar las páginas que ya creaste.
      </p>
      <form onSubmit={handleSubmit} className="mt-7">
        <Field label="Email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vos@email.com"
          />
        </Field>
        <Field label="Contraseña">
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        {error && <p className="mt-3 text-[13px] text-error">{error}</p>}
        <Button type="submit" block className="mt-7" disabled={loading}>
          {loading ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </form>
      <p className="mt-6 text-center text-[13.5px] text-text-soft">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="text-text underline underline-offset-4">
          Creá una gratis
        </Link>
      </p>
      <p className="mt-8 rounded-[12px] border border-line bg-surface px-4 py-3.5 text-[12.5px] text-text-faint">
        Esto es una demo funcional: la sesión se guarda en tu navegador, no hay servidor de
        autenticación real detrás todavía. Ver <code className="text-text-soft">BACKEND.md</code>.
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
