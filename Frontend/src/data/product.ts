export type Product = {
  productoId: number;
  productoResourceId: string;

  codigo: string;
  nombre: string;
  detalle?: string;

  stockCritico: number;
  cantidadInventario: number;

  ubicacionId: number;
  activo: boolean;
};