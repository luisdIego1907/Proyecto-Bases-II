import { config } from "../config";
import type {
  ClientData,
  ClientListItem,
} from "../data/client";
import { apiClient } from "./apiClient";

const API_URL = `${config.api.url}/api/clientes`;

export async function getClientes(): Promise<ClientListItem[]> {
  try {
    return await apiClient<ClientListItem[]>(API_URL);
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    throw error;
  }
}

export async function getClienteById(
  id: string
): Promise<ClientListItem> {
  try {
    return await apiClient<ClientListItem>(
      `${API_URL}/${id}`
    );
  } catch (error) {
    console.error("Error obteniendo cliente:", error);
    throw error;
  }
}

export async function createCliente(
  clientData: ClientData
): Promise<ClientListItem> {
  try {
    return await apiClient<ClientListItem>(API_URL, {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  } catch (error) {
    console.error("Error creando cliente:", error);
    throw error;
  }
}

export async function updateCliente(
  id: string,
  clientData: ClientData
): Promise<void> {
  try {
    await apiClient<void>(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    throw error;
  }
}

export async function deleteCliente(
  id: string
): Promise<void> {
  try {
    await apiClient<void>(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    throw error;
  }
}