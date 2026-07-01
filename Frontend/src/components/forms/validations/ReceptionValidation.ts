export type ReceptionFormErrors = {
  lote?: string;
};

export function validateReceptionForm(data: {
  lote: string;
}): ReceptionFormErrors {
  const errors: ReceptionFormErrors = {};

  if (!data.lote.trim()) {
    errors.lote = "El número de lote es obligatorio";
  }

  return errors;
}