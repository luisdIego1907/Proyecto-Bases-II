export interface CartItem {
  productoId: number;
  nombre: string;
  cantidad: number;
}

export interface AddCartItemRequest {
  despachoId: number;
  productoId: number;
  cantidadSolicitada: number;
}

export interface AddCartItemResponse {
  mensaje: string;
  despachoId: number;
  productoId: number;
  cantidadAgregada: number;
}

export interface CarritoDespachoResponse {
  carritoId: number;
  productoId: number;
  codigo: string;
  nombre: string;
  cantidadSolicitada: number;
}
