const TOKEN_KEY = "auth_token";

export function saveSession(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth-change"));
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Decodifica el payload del JWT
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
 * Verifica si el token está expirado
 */
export function isTokenExpired(): boolean {
  const payload = decodePayload();
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Usuario autenticado = existe token y NO está expirado
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired();
}

/**
 * Obtiene los roles del usuario autenticado desde el JWT.
 */
export function getRoles(): string[] {
  const payload = decodePayload();

  if (!payload) {
    return [];
  }

  const roleClaim =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!roleClaim) {
    return [];
  }

  return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
}

/**
 * Verifica si el usuario tiene al menos uno de los roles permitidos.
 */
export function hasRole(allowedRoles: string[]): boolean {
  const userRoles = getRoles();

  return allowedRoles.some((role) => userRoles.includes(role));
}

/** Obtiene el id del usuario para ciertas acciones como despacho */
export function getUserId(): number | null {
  const payload = decodePayload();
  if (!payload) return null;

  const id = payload.usuarioId;

  if (!id) return null;

  return Number(id);
}
