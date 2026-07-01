export interface ProductAudit {
  auditoriaId: number;

  auditoriaResourceId: string;

  fechaCambio: string;

  codigoProducto: string;

  producto: string;

  cantidadAnterior: number;

  cantidadNueva: number;

  tipoMovimiento: string;

  usuario: string;
}
