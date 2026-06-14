import type { DispatchDetail } from "../data/dispatch/DispatchDetailResponse";
import { dispatchDetailMock } from "../mock/detalleDespacho.mock";

export async function getDispatchDetails(
  dispatchId: number,
): Promise<DispatchDetail[]> {
  return Promise.resolve(dispatchDetailMock);
}
