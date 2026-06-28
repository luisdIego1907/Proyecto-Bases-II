import { getToken, clearSession } from "../auth/sessionAuth";

export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers || {}),
  });

  // JWT automático
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 → sesión inválida o expirada
  if (response.status === 401) {
    clearSession();
    throw new Error("Sesión expirada o no autorizada");
  }

  // 403 → policies del backend (roles insuficientes)
  if (response.status === 403) {
    throw new Error("No tiene permisos para realizar esta acción");
  }

  // Errores del backend
  if (!response.ok) {
    let errorMessage = "Ocurrió un error inesperado.";

    try {
      const errorData = await response.json();

      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData?.mensaje) {
        errorMessage = String(errorData.mensaje);
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      try {
        errorMessage = await response.text();
      } catch {
        // fallback silencioso
      }
    }

    throw new Error(errorMessage);
  }

  // 204 → sin contenido (DELETE, UPDATE sin response)
  if (response.status === 204) {
    return undefined as T;
  }

  // Detectar si hay contenido real
  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
