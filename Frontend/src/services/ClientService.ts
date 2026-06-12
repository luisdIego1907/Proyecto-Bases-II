import type { ClientListItem } from "../data/client";

export async function getClientes(): Promise<ClientListItem[]> {
  return [
    {
      clienteResourceId: "1",
      nombre: "Cliente A",
      rol_cliente: "ORIGEN",
      telefono: "8888-1111",
      activo: true,
    },
    {
      clienteResourceId: "2",
      nombre: "Cliente B",
      rol_cliente: "DESTINO",
      telefono: "8888-2222",
      activo: false,
    },
    {
      clienteResourceId: "3",
      nombre: "Cliente C",
      rol_cliente: "AMBOS",
      telefono: "8888-3333",
      activo: true,
    },
  ];
}

export async function deleteCliente(id: string): Promise<void> {
  console.log("Mock delete:", id);
}

export async function getClienteById(id: string): Promise<ClientListItem | null> {
  const clientes = await getClientes();
  return clientes.find((c) => c.clienteResourceId === id) ?? null;
}