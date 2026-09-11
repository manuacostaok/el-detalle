"use client";

import type { GiftPagePayload } from "../domain";
import { newId, readJSON, writeJSON } from "./storage";
import type { SavedPage } from "./types";

const PAGES_KEY = "soulmates:pages";

function getAll(): SavedPage[] {
  return readJSON<SavedPage[]>(PAGES_KEY, []);
}

function saveAll(pages: SavedPage[]) {
  writeJSON(PAGES_KEY, pages);
}

export function listPagesForUser(userId: string): SavedPage[] {
  return getAll()
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPage(id: string): SavedPage | null {
  return getAll().find((p) => p.id === id) ?? null;
}

export function createPage(userId: string, payload: GiftPagePayload): SavedPage {
  const page: SavedPage = {
    id: newId("page"),
    userId,
    payload,
    createdAt: new Date().toISOString(),
    viewCount: 0,
  };
  saveAll([...getAll(), page]);
  return page;
}

export function deletePage(id: string) {
  saveAll(getAll().filter((p) => p.id !== id));
}

export function updatePagePayload(id: string, payload: GiftPagePayload) {
  saveAll(getAll().map((p) => (p.id === id ? { ...p, payload } : p)));
}
