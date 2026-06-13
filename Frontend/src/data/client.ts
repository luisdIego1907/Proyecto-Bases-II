export type ClientListItem = {
  clienteId: number;
  clienteResourceId: string;
  nombre: string;
  rolCliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo: boolean;
};

export type ClientData = {
  nombre: string;
  rolCliente: "ORIGEN" | "DESTINO" | "AMBOS";
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo?: boolean;
};