export type Role = "ADMIN" | "SUPERVISOR" | "OPERARIO";

export interface Permissions {
  // Usuarios
  manageUsers: boolean;

  // Clientes
  readClients: boolean;
  createClients: boolean;
  updateClients: boolean;
  deleteClients: boolean;

  // Productos
  readProducts: boolean;
  createProducts: boolean;
  updateProducts: boolean;
  deleteProducts: boolean;

  // Recepciones
  createReception: boolean;
  readReception: boolean;

  // Despachos
  createDispatch: boolean;
  processDispatch: boolean;
  readDispatch: boolean;

  // Reportes
  readReports: boolean;

  // Auditoría
  readAudit: boolean;
}

export const permissions: Record<Role, Permissions> = {
  ADMIN: {
    // Usuarios
    manageUsers: true,

    // Clientes
    readClients: true,
    createClients: true,
    updateClients: true,
    deleteClients: true,

    // Productos
    readProducts: true,
    createProducts: true,
    updateProducts: true,
    deleteProducts: true,

    // Recepciones
    createReception: true,
    readReception: true,

    // Despachos
    createDispatch: true,
    processDispatch: true,
    readDispatch: true,

    // Reportes
    readReports: true,

    // Auditoría
    readAudit: true,
  },

  SUPERVISOR: {
    // Usuarios
    manageUsers: false,

    // Clientes
    readClients: true,
    createClients: true,
    updateClients: true,
    deleteClients: false,

    // Productos
    readProducts: true,
    createProducts: true,
    updateProducts: true,
    deleteProducts: false,

    // Recepciones
    createReception: true,
    readReception: true,

    // Despachos
    createDispatch: true,
    processDispatch: true,
    readDispatch: true,

    // Reportes
    readReports: true,

    // Auditoría
    readAudit: true,
  },

  OPERARIO: {
    // Usuarios
    manageUsers: false,

    // Clientes
    readClients: true,
    createClients: false,
    updateClients: false,
    deleteClients: false,

    // Productos
    readProducts: true,
    createProducts: false,
    updateProducts: false,
    deleteProducts: false,

    // Recepciones
    createReception: true,
    readReception: false,

    // Despachos
    createDispatch: true,
    processDispatch: true,
    readDispatch: true,

    // Reportes
    readReports: false,

    // Auditoría
    readAudit: false,
  },
};