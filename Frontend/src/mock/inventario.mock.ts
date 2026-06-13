//Recordar eliminar esta carpeta

import type { InventarioData } from "../data/Stock";

//Datos de prueba para mostrar el modelo de como se veria la pantalla para el avance 3

export const inventoryMock: InventarioData[] = [
  {
    productoId: 1,
    codigo: "PRD-001",
    nombre: "Laptop Dell XPS",

    bodega: "BOD-01",
    pasillo: "PAS-01",
    estante: "EST-01",

    cantidadInventario: 20,
    stockCritico: 10,

    estadoStock: "OK",

    ultimoIngreso: "2026-06-12T10:30:00",
    ultimoDespacho: "2026-06-13T09:00:00",
  },

  {
    productoId: 2,
    codigo: "PRD-002",
    nombre: "Mouse Logitech MX",

    bodega: "BOD-01",
    pasillo: "PAS-02",
    estante: "EST-04",

    cantidadInventario: 4,
    stockCritico: 10,

    estadoStock: "REORDEN",

    ultimoIngreso: "2026-06-10T14:00:00",
    ultimoDespacho: "2026-06-13T08:20:00",
  },

  {
    productoId: 3,
    codigo: "PRD-003",
    nombre: "Monitor Samsung 27",

    bodega: "BOD-02",
    pasillo: "PAS-03",
    estante: "EST-02",

    cantidadInventario: 50,
    stockCritico: 12,

    estadoStock: "OK",

    ultimoIngreso: "2026-06-11T16:00:00",
    ultimoDespacho: "2026-06-12T15:30:00",
  },
];
