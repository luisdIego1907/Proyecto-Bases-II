import type { DispatchSummary } from "../data/dispatch/DispatchResponses";

export const dispatchMock: DispatchSummary[] = [
  {
    despachoId: 1,

    despachoResourceId: "abc-123",

    fechaDespacho: "2026-06-13T09:00:00",

    cliente: "Intel Costa Rica",

    estado: "PROCESADO",

    operario: "Carlos Mora",
  },

  {
    despachoId: 2,

    despachoResourceId: "def-456",

    fechaDespacho: "2026-06-12T14:30:00",

    cliente: "Cisco LATAM",

    estado: "PENDIENTE",

    operario: "Andrea Ruiz",
  },

  {
    despachoId: 3,

    despachoResourceId: "ghi-789",

    fechaDespacho: "2026-06-11T11:15:00",

    cliente: "HP Enterprise",

    estado: "CANCELADO",

    operario: "Luis Gómez",
  },
];
