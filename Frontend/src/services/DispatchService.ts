import { dispatchMock } from "../mock/despacho.mock";

export async function getDispatches() {
  return Promise.resolve(dispatchMock);
}
