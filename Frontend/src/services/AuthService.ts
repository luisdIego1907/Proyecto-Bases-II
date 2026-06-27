import { config } from "../config";
import { apiClient } from "./apiClient";
import { saveSession } from "../auth/sessionAuth";
import type { LoginRequest, LoginResponse } from "../data/auth";

const AUTH_URL = `${config.api.url}/api/authentication`;

export async function loginUser(request: LoginRequest): Promise<void> {
  const response = await apiClient<LoginResponse>(`${AUTH_URL}/login`, {
    method: "POST",
    body: JSON.stringify(request),
  });

  saveSession(response.bearerToken);
}
