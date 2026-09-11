"use client";

import { useCallback, useEffect, useState } from "react";
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

export function signUp(name: string, email: string, password: string): MockUser | { error: string } {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "Ya existe una cuenta con ese email." };
  }
  const user: StoredUser = { id: newId("user"), name, email, password, createdAt: new Date().toISOString() };
  writeJSON(USERS_KEY, [...users, user]);
  setSession({ userId: user.id });
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}

export function signIn(email: string, password: string): MockUser | { error: string } {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { error: "Email o contraseña incorrectos." };
  }
  setSession({ userId: user.id });
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}

export function signOut() {
  setSession(null);
}

function currentUser(): MockUser | null {
  const session = getSession();
  if (!session) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  if (!user) return null;
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}

export function useSession() {
  const [user, setUser] = useState<MockUser | null | "loading">("loading");

  const refresh = useCallback(() => {
    setUser(currentUser());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("soulmates:session-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("soulmates:session-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return user;
}
