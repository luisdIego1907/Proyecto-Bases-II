import { getRoles } from "../auth/sessionAuth";
import {
  permissions,
  type Permissions,
  type Role,
} from "../config/permissions";

const defaultPermissions: Permissions = {
  manageUsers: false,

  readClients: false,
  createClients: false,
  updateClients: false,
  deleteClients: false,

  readProducts: false,
  createProducts: false,
  updateProducts: false,
  deleteProducts: false,

  createReception: false,
  readReception: false,

  createDispatch: false,
  processDispatch: false,
  readDispatch: false,

  readReports: false,

  readAudit: false,
};

export function usePermissions(): Permissions {
  const roles = getRoles();

  const firstRole = roles[0] as Role | undefined;

  if (!firstRole) {
    return defaultPermissions;
  }

  return permissions[firstRole] ?? defaultPermissions;
}