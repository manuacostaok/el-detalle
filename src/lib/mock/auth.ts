"use client";

import { useSyncExternalStore } from "react";
import { newId, readJSON, writeJSON } from "./storage";
import type { MockUser } from "./types";

const USERS_KEY = "soulmates:users";
const SESSION_KEY = "soulmates:session";

type StoredUser = MockUser & { password: string };
type Session = { userId: string } | null;

function getUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(USERS_KEY, []);
}

function getSession(): Session {
  return readJSON<Session>(SESSION_KEY, null);
}

function setSession(session: Session) {
  writeJSON(SESSION_KEY, session);
  window.dispatchEvent(new Event("soulmates:session-changed"));
}

function toPublicUser(user: StoredUser): MockUser {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export function signUp(name: string, email: string, password: string): MockUser | { error: string } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "Ya existe una cuenta con ese email." };
  }
  const user: StoredUser = { id: newId("user"), name, email, password, createdAt: new Date().toISOString() };
  writeJSON(USERS_KEY, [...users, user]);
  setSession({ userId: user.id });
  return toPublicUser(user);
}

export function signIn(email: string, password: string): MockUser | { error: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { error: "Email o contraseña incorrectos." };
  }
  setSession({ userId: user.id });
  return toPublicUser(user);
}

export function signOut() {
  setSession(null);
}

// useSyncExternalStore requires a stable reference when nothing changed, so we cache
// the last snapshot by user id instead of building a fresh object on every call.
let cachedUserId: string | null = null;
let cachedUser: MockUser | null = null;

function currentUser(): MockUser | null {
  const session = getSession();
  const userId = session?.userId ?? null;
  if (userId === cachedUserId) return cachedUser;
  cachedUserId = userId;
  const user = userId ? getUsers().find((u) => u.id === userId) : undefined;
  cachedUser = user ? toPublicUser(user) : null;
  return cachedUser;
}

function subscribe(callback: () => void) {
  window.addEventListener("soulmates:session-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("soulmates:session-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

/** Sincroniza con la sesión mock en localStorage (ver BACKEND.md para auth real). */
export function useSession(): MockUser | null | "loading" {
  return useSyncExternalStore<MockUser | null | "loading">(
    subscribe,
    currentUser,
    () => "loading",
  );
}
