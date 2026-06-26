export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  console.log("BODY ENVIADO:", options?.body);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();

    console.log("ERROR BACKEND:", error);

    throw new Error(error);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
