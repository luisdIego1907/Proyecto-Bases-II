export type ClientListItem = {
  clienteResourceId: string;
  nombre: string;
  rol_cliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo: boolean;
};

export type ClientData = {
  nombre: string;
  rol_cliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo?: boolean;
};