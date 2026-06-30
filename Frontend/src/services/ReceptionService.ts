import { config } from "../config";
import type { RecepcionProducto } from "../data/reception";
import { apiClient } from "./apiClient";

const URL_API = `${config.api.url}/api/recepciones`;

export async function registrarRecepcion(data: {
  productoId: number;
  cantidad: number;
  clienteId: number;
  numeroLote: string;
  usuarioId: number;
}): Promise<void> {
  try {
    await apiClient<void>(URL_API, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error en ReceptionService:", error);
    throw error;
  }
}

export async function getRecepcionesProducto(
  productoId: number,
): Promise<RecepcionProducto[]> {
  try {
    return await apiClient<RecepcionProducto[]>(
      `${URL_API}/producto/${productoId}`,
    );
  } catch (error) {
    console.error("Error en ReceptionService:", error);
    throw error;
  }
}
