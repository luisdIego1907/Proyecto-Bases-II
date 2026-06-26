export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = "Ocurrió un error inesperado.";

    try {
      // Si el backend devuelve un JSON como:
      // { "mensaje": "..." }
      const errorData = await response.json();

      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (
        errorData &&
        typeof errorData === "object" &&
        "mensaje" in errorData
      ) {
        errorMessage = String(errorData.mensaje);
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      // Si no es JSON, intenta leerlo como texto
      try {
        errorMessage = await response.text();
      } catch {
        // Mantiene el mensaje por defecto
      }
    }

    console.error("API Error:", errorMessage);

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}