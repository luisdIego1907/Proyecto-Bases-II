import type { DispatchDetail } from "../data/dispatch/DispatchDetailResponse";
import { dispatchMock } from "../mock/despacho.mock";
import { dispatchDetailMock } from "../mock/detalleDespacho.mock";

export async function getDispatches() {
  return Promise.resolve(dispatchMock);
}

export async function getDispatchDetails(
  dispatchId: number,
): Promise<DispatchDetail[]> {
  return Promise.resolve(dispatchDetailMock);
}
