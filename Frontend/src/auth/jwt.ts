import { getToken } from "./sessionAuth";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function base64UrlDecode(str: string) {
  const base64 = str
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");

  return JSON.parse(atob(base64));
}

function decodeToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return base64UrlDecode(token.split(".")[1]);
  } catch {
    return null;
  }
}

export function getRoles(): string[] {
  const payload = decodeToken();
  if (!payload) return [];

  const roles = payload[ROLE_CLAIM];

  if (!roles) return [];

  return Array.isArray(roles) ? roles : [roles];
}
