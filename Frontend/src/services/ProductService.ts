import { config } from "../config";
import type { InventarioData } from "../data/Stock";

//url - probablemente se ocupe hacer esto reutilizable
const URL_API = `${config.api.url}/api/productos/inventario`;

//Funcion listar inventario, conecta directo al backend esta lista para no hacerlo despues
export async function getInventory(): Promise<InventarioData[]> {
  try {
    const response = await fetch(URL_API);

    if (!response.ok) throw new Error("Error al cargar el inventario");
    return await response.json();
  } catch (error) {
    console.error("Error en StockService: ", error);
    throw error;
  }
}
