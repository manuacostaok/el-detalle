"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/mock/auth";
import { Container, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const user = useSession();
  const router = useRouter();

  if (!user || user === "loading") return null;

  return (
    <Container className="py-12 max-w-[560px]">
      <Eyebrow>Cuenta</Eyebrow>
      <h1 className="mt-2 text-[26px]">{user.name}</h1>
      <p className="mt-1 text-[14px] text-text-faint">{user.email}</p>

      <div className="mt-8 rounded-[16px] border border-line bg-surface p-5">
        <h3 className="text-[14px] font-semibold text-text-soft">Datos de la cuenta</h3>
        <dl className="mt-4 flex flex-col gap-3 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-text-faint">Miembro desde</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString("es-AR")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-faint">Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-[12px] border border-line px-4 py-3.5 text-[12.5px] text-text-faint">
        Esta cuenta vive en tu navegador (demo funcional, ver <code className="text-text-soft">BACKEND.md</code>).
        Si borrás los datos del sitio, se pierde.
      </div>

      <Button
        variant="ghost"
        className="mt-8"
        onClick={() => {
          signOut();
          router.push("/");
        }}
      >
        Cerrar sesión
      </Button>
    </Container>
  );
}
