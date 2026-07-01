const TOKEN_KEY = "auth_token";

/**
 * Guarda una nueva sesión reemplazando la anterior.
 */
export function saveSession(token: string) {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Obtiene el token actual.
 */
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Cierra sesión completamente.
 */
export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Decodifica el payload del JWT.
 */
function decodePayload(): any | null {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * Verifica expiración del token.
 */
export function isTokenExpired(): boolean {
  const payload = decodePayload();
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Usuario autenticado válido.
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token && !isTokenExpired();
}

/**
 * Roles del usuario.
 */
export function getRoles(): string[] {
  const payload = decodePayload();

  const roleClaim =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!roleClaim) return [];

  return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
}

/**
 * ID del usuario autenticado.
 */
export function getUserId(): number | null {
  const payload = decodePayload();
  if (!payload?.usuarioId) return null;

  const id = Number(payload.usuarioId);
  return Number.isFinite(id) ? id : null;
}

/**
 * Verifica si el usuario tiene al menos uno de los roles permitidos.
 */
export function hasRole(allowedRoles: string[]): boolean {
  const userRoles = getRoles();

  return allowedRoles.some((role) => userRoles.includes(role));
}
