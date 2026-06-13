export interface InventarioData {
  productoId: number;
  codigo: string;
  nombre: string;
  bodega: string;
  pasillo: string;
  estante: string;
  cantidadInventario: number;
  stockCritico: number;
  estadoStock: string;
  ultimoIngreso?: string;
  ultimoDespacho?: string;
}
