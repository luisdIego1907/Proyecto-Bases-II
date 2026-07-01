import { config } from "../config";
import type { InventarioData } from "../data/Stock";
import type { Product } from "../data/product";
import { apiClient } from "./apiClient";

const URL_API = `${config.api.url}/api/productos`;

export async function getProducts(): Promise<Product[]> {
  try {
    return await apiClient<Product[]>(`${URL_API}/inventario`);
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
  }
}

export async function getProductById(productoId: number): Promise<Product> {
  try {
    return await apiClient<Product>(`${URL_API}/${productoId}`);
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
  }
}

export async function deleteProduct(productoResourceId: string): Promise<void> {
  try {
    await apiClient<void>(`${URL_API}/${productoResourceId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
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
  try {
    await apiClient<void>(URL_API, {
      method: "POST",
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
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
  }
}

export async function updateProduct(product: Product): Promise<void> {
  try {
    await apiClient<void>(`${URL_API}/${product.productoResourceId}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: product.nombre,
        stockCritico: product.stockCritico,
        ubicacionResourceId: product.ubicacionResourceId,
      }),
    });
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
  }
}

// Función listar inventario
export async function getInventory(): Promise<InventarioData[]> {
  try {
    return await apiClient<InventarioData[]>(`${URL_API}/inventario`);
  } catch (error) {
    console.error("Error en ProductService:", error);
    throw error;
  }
}
