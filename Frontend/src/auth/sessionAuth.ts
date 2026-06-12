const TOKEN_KEY = "auth_token";
const ROLES_KEY = "roles";

export function saveSession(token: string, roles: string[]) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  window.dispatchEvent(new Event("auth-change"));
}

export function getRoles() {
  const data = sessionStorage.getItem(ROLES_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLES_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export function isAuthenticated() {
  return !!sessionStorage.getItem(TOKEN_KEY);
}