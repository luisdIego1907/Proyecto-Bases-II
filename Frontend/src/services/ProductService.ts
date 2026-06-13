import type { Product } from "../data/product";

let products: Product[] = [
  {
    productoId: 1,
    productoResourceId: "uuid-1",
    codigo: "PRD-001",
    nombre: "Laptop Ultrabook",
    detalle: "Laptop liviana empresarial",
    stockCritico: 10,
    cantidadInventario: 25,
    ubicacionId: 1,
    activo: true,
  },
  {
    productoId: 2,
    productoResourceId: "uuid-2",
    codigo: "PRD-002",
    nombre: "Mouse Inalámbrico",
    detalle: "Mouse ergonómico",
    stockCritico: 15,
    cantidadInventario: 40,
    ubicacionId: 2,
    activo: true,
  },
];

export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...products]), 300);
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      products = products.filter((p) => p.productoId !== id);
      resolve();
    }, 300);
  });
}

export async function createProduct(
  product: Omit<Product, "productoId" | "productoResourceId">
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      products.push({
        ...product,
        productoId: Date.now(),
        productoResourceId: crypto.randomUUID(),
      });
      resolve();
    }, 300);
  });
}

export async function updateProduct(updated: Product): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      products = products.map((p) =>
        p.productoId === updated.productoId ? updated : p
      );
      resolve();
    }, 300);
  });
}