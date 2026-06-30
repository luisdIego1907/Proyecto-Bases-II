import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  DispatchDetail,
  DispatchSummary,
} from "../../data/dispatch/DispatchResponses";
import DispatchTable from "../../components/Tables/DispatchTable";
import DispatchFilter from "../../components/dispatch/DispatchFilter";
import DispatchDetailModal from "../../components/dispatch/DispatchDetailModal";

import {
  getDispatches,
  getDispatchDetails,
  filterDispatches,
  processDispatch,
} from "../../services/DispatchService";
import FeedbackModal from "../../shared/FeedbackModal";

export default function DispatchList() {
  // Lista principal de despachos
  const [dispatches, setDispatches] = useState<DispatchSummary[]>([]);

  // Estados de pantalla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal detalle
  const [dispatchDetails, setDispatchDetails] = useState<DispatchDetail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false,
    type: "success" as "success" | "error" | "warning",
    message: "",
  });

  function showMessage(type: "success" | "error" | "warning", message: string) {
    setModal({
      open: true,
      type,
      message,
    });
  }

  async function handleViewDetail(dispatchId: number) {
    try {
      const dispatchDetail = await getDispatchDetails(dispatchId);

      setDispatchDetails(dispatchDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar la información del despacho");
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setDispatchDetails([]);
  }

  //Procesar despacho
  async function handleProcessDispatch(dispatchId: number) {
    try {
      const response = await processDispatch({
        despachoId: dispatchId,
        usuarioId: 1,
      });

      showMessage("success", response.mensaje);

      const data = await getDispatches();
      setDispatches(data);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        showMessage("error", error.message);
      }
    }
  }

  // Filtro de fechas
  async function handleFilter() {
    if (!startDate || !endDate) {
      showMessage("warning", "Debe seleccionar ambas fechas");
      return;
    }

    //La fecha en que empieza no se puede ser mayor a la final
    if (new Date(startDate) > new Date(endDate)) {
      showMessage("warning", "La fecha de inicio no puede mayor a la final");
      return;
    }

    try {
      setLoading(true);
      const data = await filterDispatches({
        fechaInicio: `${startDate}T00:00:00`,
        fechaFin: `${endDate}T23:59:59`,
      });

      setDispatches(data);
    } catch (error) {
      console.error(error);
      showMessage("error", "No se pudo aplicar el filtro");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    setStartDate("");
    setEndDate("");

    try {
      setLoading(true);
      const data = await getDispatches();

      setDispatches(data);
    } catch (error) {
      console.error(error);
      showMessage("error", "No se pudo cargar la informaciòn");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getDispatches();

        setDispatches(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />

        <h2 className="mt-6 text-xl font-semibold text-slate-700">
          Cargando despachos
        </h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center py-24">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Gestión de Despachos
          </h1>

          <p className="mt-1 text-slate-500">
            Administre las salidas del almacén
          </p>
        </div>

        <button
          onClick={() => navigate("/dispatch/create")}
          className="rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700"
        >
          Registrar despacho
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <DispatchFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onFilter={handleFilter}
          onClear={handleClear}
        />
      </div>

      {/* Tabla o Empty State */}
      {dispatches.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="max-w-lg rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-700">
              No hay despachos registrados
            </h2>
          </div>
        </div>
      ) : (
        <DispatchTable
          dispatches={dispatches}
          onViewDetail={handleViewDetail}
          onProcess={handleProcessDispatch}
        />
      )}

      {/* Modal detalle */}
      <DispatchDetailModal
        details={dispatchDetails}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <FeedbackModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={() =>
          setModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}
