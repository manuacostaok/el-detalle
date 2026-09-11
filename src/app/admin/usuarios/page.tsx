import { Container, Eyebrow } from "@/components/ui/container";
import { ADMIN_USERS } from "@/lib/mock/admin";

export default function AdminUsers() {
  return (
    <Container className="py-10">
      <Eyebrow>Usuarios</Eyebrow>
      <h1 className="mt-2 text-[26px]">{ADMIN_USERS.length} cuentas registradas</h1>

      <div className="mt-7 overflow-x-auto rounded-[14px] border border-line">
        <table className="w-full min-w-[560px] text-[13.5px]">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.06em] text-text-faint">
              <th className="text-left py-3 px-4 font-semibold">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Plan</th>
              <th className="text-left py-3 px-4 font-semibold">Alta</th>
              <th className="text-right py-3 px-4 font-semibold">Páginas</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="py-3 px-4 text-text">{u.name}</td>
                <td className="py-3 px-4 text-text-soft">{u.email}</td>
                <td className="py-3 px-4">
                  {u.plan === "premium" ? (
                    <span className="text-gold-soft">Premium</span>
                  ) : (
                    <span className="text-text-soft">Básico</span>
                  )}
                </td>
                <td className="py-3 px-4 text-text-faint">{u.createdAt}</td>
                <td className="py-3 px-4 text-text-faint text-right">{u.pagesCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
