import { config } from "../config";
import type { RecepcionProducto } from "../data/reception";

const URL_API = `${config.api.url}/api/recepciones`;

export async function registrarRecepcion(data: {
    productoId: number;
    cantidad: number;
    clienteId: number;
    numeroLote: string;
    usuarioId: number;
}): Promise<void> {
    const response = await fetch(URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

}

export async function getRecepcionesProducto(
        productoId: number
    ): Promise<RecepcionProducto[]> {
        const response = await fetch(
            `${URL_API}/producto/${productoId}`
        );

        if (!response.ok) {
            throw new Error("Error al cargar las recepciones.");
        }

        return await response.json();
    }