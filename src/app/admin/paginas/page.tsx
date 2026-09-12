import { Container, Eyebrow } from "@/components/ui/container";
import { ADMIN_PAGES } from "@/lib/mock/admin";
import { getOccasion, getTheme } from "@/lib/domain";

export default function AdminPages() {
  return (
    <Container className="py-10">
      <Eyebrow>Páginas</Eyebrow>
      <h1 className="mt-2 text-[26px]">{ADMIN_PAGES.length} páginas creadas</h1>

      <div className="mt-7 overflow-x-auto rounded-[14px] border border-line">
        <table className="w-full min-w-[720px] text-[13.5px]">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[0.06em] text-text-faint">
              <th className="text-left py-3 px-4 font-semibold">Autor</th>
              <th className="text-left py-3 px-4 font-semibold">Ocasión</th>
              <th className="text-left py-3 px-4 font-semibold">Tema</th>
              <th className="text-left py-3 px-4 font-semibold">Plan</th>
              <th className="text-left py-3 px-4 font-semibold">Creada</th>
              <th className="text-right py-3 px-4 font-semibold">Vistas</th>
              <th className="text-right py-3 px-4 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_PAGES.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="py-3 px-4 text-text">{p.ownerName}</td>
                <td className="py-3 px-4 text-text-soft">
                  {getOccasion(p.occasion).emoji} {getOccasion(p.occasion).label}
                </td>
                <td className="py-3 px-4 text-text-soft">{getTheme(p.theme).label}</td>
                <td className="py-3 px-4 text-text-soft">
                  {p.plan === "premium" ? (
                    <span className="text-gold-soft">Edición Especial</span>
                  ) : (
                    "Clásico"
                  )}
                </td>
                <td className="py-3 px-4 text-text-faint">{p.createdAt}</td>
                <td className="py-3 px-4 text-text-faint text-right">{p.viewCount}</td>
                <td className="py-3 px-4 text-right">
                  {p.flagged ? (
                    <span className="rounded-full bg-error/15 px-2.5 py-1 font-mono text-[10.5px] text-error">
                      Revisar
                    </span>
                  ) : (
                    <span className="rounded-full bg-success/15 px-2.5 py-1 font-mono text-[10.5px] text-success">
                      OK
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
