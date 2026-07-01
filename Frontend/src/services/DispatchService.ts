import { config } from "../config";
import type {
  AddCartItemRequest,
  AddCartItemResponse,
  CarritoDespachoResponse,
} from "../data/dispatch/CartItem";
import type {
  CreateDispatchRequest,
  DateRangeRequest,
  ProcessDispatchRequest,
} from "../data/dispatch/DispatchRequest";
import type {
  CreateDispatchResponse,
  DispatchDetail,
  DispatchSummary,
  ProcessDispatchResponse,
} from "../data/dispatch/DispatchResponses";

import { apiClient } from "./apiClient";

const URL_API = `${config.api.url}/api/despachos`;

//Listar despachos de la ultima semana
export async function getDispatches(): Promise<DispatchSummary[]> {
  return apiClient<DispatchSummary[]>(`${URL_API}/ultima-semana`);
}

//Ver el detalle de los despachos
export async function getDispatchDetails(
  dispatchId: number,
): Promise<DispatchDetail[]> {
  return apiClient<DispatchDetail[]>(`${URL_API}/${dispatchId}/detalle`);
}

//Para filtrar por fechas
export async function filterDispatches(
  body: DateRangeRequest,
): Promise<DispatchSummary[]> {
  return apiClient<DispatchSummary[]>(`${URL_API}/por-fecha`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Crear despacho
export async function createDispatch(
  body: CreateDispatchRequest,
): Promise<CreateDispatchResponse> {
  return apiClient<CreateDispatchResponse>(`${URL_API}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

//Agregar producto al carrito
export async function addCartItem(
  body: AddCartItemRequest,
): Promise<AddCartItemResponse> {
  return apiClient<AddCartItemResponse>(`${URL_API}/carrito`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Procesar despacho
export async function processDispatch(
  body: ProcessDispatchRequest,
): Promise<ProcessDispatchResponse> {
  return apiClient<ProcessDispatchResponse>(`${URL_API}/procesar`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

//Ver carrito de despacho
export async function getDispatchCart(
  dispatchId: number,
): Promise<CarritoDespachoResponse[]> {
  return apiClient<CarritoDespachoResponse[]>(
    `${URL_API}/${dispatchId}/carrito`,
  );
}
