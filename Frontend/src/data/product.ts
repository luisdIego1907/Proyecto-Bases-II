export type Product = {
  productoId: number;
  productoResourceId: string;

  codigo: string;
  nombre: string;
  detalle?: string;

  cantidadInventario: number;
  stockCritico: number;
  activo: boolean;

  ubicacionResourceId: string;

  codigoBodega: string;
  bodega: string;
  pasillo: string;
  estante: string;
};