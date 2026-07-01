import { config } from "../config";
import type { ProductAudit } from "../data/audit/ProductAudit";
import type { ProductMovement } from "../data/audit/ProductMovement";
import type { DateRangeRequest } from "../data/dispatch/DispatchRequest";
import { apiClient } from "./apiClient";

const PRODUCT_URL = `${config.api.url}/api/productos`;
const AUDIT_URL = `${config.api.url}/api/auditoria-productos`;

//Obtener los movimientos del producto
export async function getProductMovements(
  productId: number,
  body: DateRangeRequest,
): Promise<ProductMovement[]> {
  return apiClient<ProductMovement[]>(
    `${PRODUCT_URL}/${productId}/movimientos`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

//Obtener la auditoria del producto
export async function getProductAudit(
  productId: number,
  body: DateRangeRequest,
): Promise<ProductAudit[]> {
  return apiClient<ProductAudit[]>(`${AUDIT_URL}/producto/${productId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
