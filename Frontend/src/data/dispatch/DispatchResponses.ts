export interface DispatchSummary {
  despachoId: number;
  despachoResourceId: string;
  fechaDespacho: string;
  cliente: string;
  estado: string;
  operario: string;
}

export interface CreateDispatchResponse {
  mensaje: string;
  despachoId: number;
}

export interface ProcessDispatchResponse {
  mensaje: string;
  despachoId: number;
}

export interface DispatchDetail {
  despachoId: number;
  codigo: string;
  producto: string;
  cantidadDespachada: number;
}
