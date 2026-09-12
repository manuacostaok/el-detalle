import { Container, Eyebrow } from "@/components/ui/container";
import { adminSummary, ADMIN_PAGES } from "@/lib/mock/admin";
import { getOccasion } from "@/lib/domain";

export default function AdminOverview() {
  const summary = adminSummary();
  const recent = [...ADMIN_PAGES].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const tiles = [
    { label: "Usuarios", value: summary.totalUsers },
    { label: "Páginas creadas", value: summary.totalPages },
    { label: "Edición Especial", value: summary.premiumPages },
    { label: "Vistas totales", value: summary.totalViews.toLocaleString("es-AR") },
  ];

  return (
    <Container className="py-10">
      <Eyebrow>Resumen</Eyebrow>
      <h1 className="mt-2 text-[26px]">Estado general</h1>

      <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-[14px] border border-line bg-surface p-5">
            <div className="font-mono text-[28px] text-text">{t.value}</div>
            <div className="mt-1 text-[12.5px] text-text-faint">{t.label}</div>
          </div>
        ))}
      </div>

      {summary.flagged > 0 && (
        <div className="mt-6 rounded-[12px] border border-error/30 bg-error/10 px-4 py-3 text-[13px] text-error">
          {summary.flagged} página{summary.flagged > 1 ? "s" : ""} marcada{summary.flagged > 1 ? "s" : ""} para
          revisión.
        </div>
      )}

      <h2 className="mt-10 text-[16px] font-semibold text-text-soft">Últimas páginas creadas</h2>
      <div className="mt-4 overflow-x-auto rounded-[14px] border border-line">
        <table className="w-full min-w-[520px] text-[13.5px]">
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="py-3 px-4 text-text">{p.ownerName}</td>
                <td className="py-3 px-4 text-text-soft">
                  {getOccasion(p.occasion).emoji} {getOccasion(p.occasion).label}
                </td>
                <td className="py-3 px-4 text-text-faint">{p.createdAt}</td>
                <td className="py-3 px-4 text-text-faint text-right">{p.viewCount} vistas</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
