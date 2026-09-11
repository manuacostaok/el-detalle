/**
 * Datos de ejemplo fijos para dar forma al panel de admin. NO son usuarios reales —
 * no hay usuarios que moderar todavía porque no hay backend (ver BACKEND.md). Esto
 * existe para mostrar la arquitectura de la pantalla, honestamente marcada como demo
 * en la UI que la consume.
 */
import type { OccasionKey, PlanKey, ThemeKey } from "../domain";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  plan: PlanKey;
  pagesCount: number;
};

export type AdminPageRow = {
  id: string;
  ownerName: string;
  occasion: OccasionKey;
  theme: ThemeKey;
  plan: PlanKey;
  createdAt: string;
  viewCount: number;
  flagged: boolean;
};

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Camila Reyes", email: "camila@example.com", createdAt: "2026-08-02", plan: "premium", pagesCount: 3 },
  { id: "u2", name: "Tomás Ibarra", email: "tomas@example.com", createdAt: "2026-08-10", plan: "free", pagesCount: 1 },
  { id: "u3", name: "Julieta Moreno", email: "julieta@example.com", createdAt: "2026-08-14", plan: "premium", pagesCount: 2 },
  { id: "u4", name: "Bruno Acosta", email: "bruno@example.com", createdAt: "2026-08-19", plan: "free", pagesCount: 1 },
  { id: "u5", name: "Valentina Díaz", email: "valentina@example.com", createdAt: "2026-08-25", plan: "premium", pagesCount: 4 },
  { id: "u6", name: "Nicolás Paz", email: "nicolas@example.com", createdAt: "2026-09-01", plan: "free", pagesCount: 1 },
  { id: "u7", name: "Martina Luna", email: "martina@example.com", createdAt: "2026-09-05", plan: "premium", pagesCount: 2 },
];

export const ADMIN_PAGES: AdminPageRow[] = [
  { id: "p1", ownerName: "Camila Reyes", occasion: "pareja", theme: "romantico", plan: "premium", createdAt: "2026-08-03", viewCount: 214, flagged: false },
  { id: "p2", ownerName: "Camila Reyes", occasion: "amistad", theme: "divertido", plan: "premium", createdAt: "2026-08-12", viewCount: 58, flagged: false },
  { id: "p3", ownerName: "Tomás Ibarra", occasion: "mascota", theme: "minimal", plan: "free", createdAt: "2026-08-11", viewCount: 33, flagged: false },
  { id: "p4", ownerName: "Julieta Moreno", occasion: "aniversario", theme: "nocturno", plan: "premium", createdAt: "2026-08-15", viewCount: 401, flagged: false },
  { id: "p5", ownerName: "Bruno Acosta", occasion: "familia", theme: "boho", plan: "free", createdAt: "2026-08-20", viewCount: 19, flagged: false },
  { id: "p6", ownerName: "Valentina Díaz", occasion: "pareja", theme: "nocturno", plan: "premium", createdAt: "2026-08-26", viewCount: 512, flagged: true },
  { id: "p7", ownerName: "Nicolás Paz", occasion: "amistad", theme: "minimal", plan: "free", createdAt: "2026-09-02", viewCount: 12, flagged: false },
  { id: "p8", ownerName: "Martina Luna", occasion: "pareja", theme: "romantico", plan: "premium", createdAt: "2026-09-06", viewCount: 87, flagged: false },
];

export function adminSummary() {
  const totalUsers = ADMIN_USERS.length;
  const totalPages = ADMIN_PAGES.length;
  const premiumPages = ADMIN_PAGES.filter((p) => p.plan === "premium").length;
  const totalViews = ADMIN_PAGES.reduce((sum, p) => sum + p.viewCount, 0);
  const flagged = ADMIN_PAGES.filter((p) => p.flagged).length;
  return { totalUsers, totalPages, premiumPages, totalViews, flagged };
}
