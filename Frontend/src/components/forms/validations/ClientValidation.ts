export type ClientFormErrors = {
  nombre?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
};

export function validateClientForm(data: {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}): ClientFormErrors {
  const errors: ClientFormErrors = {};


  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } 
  
  if (data.telefono.trim()) {
    const telefono = data.telefono.replace(/\D/g, "");

    if (telefono.length !== 8) {
      errors.telefono = "El teléfono debe contener 8 dígitos";
    }
  }

  if (data.correo.trim()) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(data.correo)) {
      errors.correo = "Ingrese un correo electrónico válido";
    } 
  }


  return errors;
}