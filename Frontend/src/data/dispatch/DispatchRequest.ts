export interface DateRangeRequest {
  fechaInicio: string;
  fechaFin: string;
}

export interface CreateDispatchRequest {
  clienteId: number;
  usuarioId: number;
}

export interface ProcessDispatchRequest {
  despachoId: number;
  usuarioId: number;
}
