export type ProductFormErrors = {
  codigo?: string;
  nombre?: string;
  detalle?: string;
  stockCritico?: string;
};

export function validateProductForm(data: {
  codigo: string;
  nombre: string;
  detalle: string;
  stockCritico: number;
}): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!data.codigo.trim()) {
    errors.codigo = "El código es obligatorio";
  } else if (data.codigo.trim().length > 50) {
    errors.codigo =
      "El código no puede superar los 50 caracteres";
  }

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (data.nombre.trim().length > 100) {
    errors.nombre =
      "El nombre no puede superar los 100 caracteres";
  }

  if (data.detalle.length > 255) {
    errors.detalle =
      "El detalle no puede superar los 255 caracteres";
  }

  if (
    Number.isNaN(data.stockCritico) ||
    data.stockCritico < 0
  ) {
    errors.stockCritico =
      "El stock crítico debe ser un número mayor o igual a cero";
  }

  return errors;
}