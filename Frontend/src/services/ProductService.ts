import { config } from "../config";
import type { InventarioData } from "../data/Stock";
import type { Product } from "../data/product";
import { apiClient } from "./apiClient";

const URL_API = `${config.api.url}/api/productos`;

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${URL_API}/inventario`);

    if (!response.ok) {
        throw new Error("Error al cargar productos");
    }

    return await response.json();
}

export async function getProductById(productoId: number): Promise<Product> {
    const response = await fetch(`${URL_API}/${productoId}`);

    if (!response.ok) {
        throw new Error("Error al obtener producto");
    }

    return await response.json();
}

export async function deleteProduct(
    productoResourceId: string
): Promise<void> {
    const response = await fetch(`${URL_API}/${productoResourceId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje);
    }
}

export async function createProduct(product: {
    codigo: string;
    nombre: string;
    detalle?: string;
    stockCritico: number;
    bodega: string;
    pasillo: string;
    estante: string;
}): Promise<void> {
    const response = await fetch(URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            codigo: product.codigo,
            nombre: product.nombre,
            detalle: product.detalle,
            stockCritico: product.stockCritico,
            bodega: product.bodega,
            pasillo: product.pasillo,
            estante: product.estante,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al crear producto");
    }
}

export async function updateProduct(product: Product): Promise<void> {
    const response = await fetch(`${URL_API}/${product.productoResourceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre: product.nombre,
            stockCritico: product.stockCritico,
            ubicacionResourceId: product.ubicacionResourceId,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar producto");
    }
}

//Funcion listar inventario, conecta directo al backend esta lista para no hacerlo despues
export async function getInventory(): Promise<InventarioData[]> {
    try {
        return await apiClient<InventarioData[]>(`${URL_API}/inventario`);
    } catch (error) {
        console.error("Error en StockService:", error);
        throw error;
    }
}
