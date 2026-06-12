import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ClientListItem } from "../data/client";

import ClientTable from "../features/ClientTable";
import { deleteCliente, getClientes } from "../services/ClientService";
import { PermissionDenied } from "../shared/PermissionDenied";
import DeleteButton from "../shared/DeleteButton";

export default function ClientList() {
  const navigate = useNavigate();

  const [clientList, setClientList] = useState<ClientListItem[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClientes();
        setClientList(data);
      } catch {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  const handleSelectClient = (id: string) => {
    setSuccessMessage("");

    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteClients = async () => {
    if (selectedClients.length === 0) return;

    try {
      setSuccessMessage("");
      setDeleteError("");

      await Promise.all(selectedClients.map((id) => deleteCliente(id)));

      setClientList((prev) =>
        prev.filter((c) => !selectedClients.includes(c.clienteResourceId))
      );

      setSelectedClients([]);
      setSuccessMessage("Cliente(s) eliminado(s) correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";

      if (message.includes("permisos")) {
        setPermissionDenied(true);
        return;
      }

      setDeleteError("No se pudieron eliminar los clientes.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
        <h2 className="mt-6 text-xl font-semibold text-slate-700">
          Cargando clientes
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-24">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            No se pudieron cargar los clientes
          </h2>
        </div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <PermissionDenied
        title="No puede eliminar clientes"
        message="Su usuario puede consultar clientes, pero no tiene permisos para eliminarlos."
      />
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Lista de Clientes
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona los clientes registrados en el sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DeleteButton
            label="Eliminar clientes"
            loadingLabel="Eliminando..."
            disabled={selectedClients.length === 0}
            confirmMessage={`¿Está seguro de eliminar ${selectedClients.length} cliente(s)?`}
            onDelete={handleDeleteClients}
          />

          <Link
            to="/clients/register"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Registrar Cliente
          </Link>
        </div>
      </div>

      {selectedClients.length > 0 && (
        <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
          {selectedClients.length} cliente(s) seleccionado(s)
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {deleteError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      {clientList.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="bg-white border border-slate-200 rounded-3xl px-10 py-12 shadow-sm text-center max-w-lg">
            <h2 className="text-2xl font-bold text-slate-700">
              No hay clientes registrados
            </h2>
          </div>
        </div>
      ) : (
        <ClientTable
          clients={clientList}
          selectedClients={selectedClients}
          onSelect={handleSelectClient}
          onEdit={(id) => navigate(`/clients/${id}`)}
        />
      )}
    </div>
  );
}