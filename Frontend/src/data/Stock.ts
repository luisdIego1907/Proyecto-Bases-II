export interface InventarioData {
  productoId: number;
  productoResourceId?: string;

  codigo: string;
  nombre: string;
  detalle?: string;

  codigoBodega?: string;
  bodega: string;
  pasillo: string;
  estante: string;

  ubicacionResourceId?: string;

  cantidadInventario: number;
  stockCritico: number;

  estadoStock: string;

  ultimoIngreso?: string;
  ultimoDespacho?: string;
}
