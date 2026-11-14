import type { AuthSession } from "@/shared/types/session";

const SESSION_KEY = "session_key";
const SESSION_LIMIT = 2 * 60 * 60 * 1000; // 2 tieng

// kiem tra phien hien tai hp le hay ko và get
export function checkAndGetSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session.username || !session.reLoginCode || session.expiresAt <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

// luu session vao local storage
export function saveSession(username: string, reLoginCode: string, expiresAt?: number) {
  const session: AuthSession = {
    username,
    reLoginCode,
    expiresAt: expiresAt ?? Date.now() + SESSION_LIMIT,
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// xoa session
export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
