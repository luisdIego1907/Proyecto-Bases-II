import { useEffect, useState } from "react";

import type { DispatchSummary } from "../../data/dispatch/DispatchResponses";
import type { DispatchDetail } from "../../data/dispatch/DispatchDetailResponse";

import DispatchTable from "../../components/Tables/DispatchTable";
import DispatchFilter from "../../components/dispatch/DispatchFilter";
import DispatchDetailModal from "../../components/dispatch/DispatchDetailModal";

import { getDispatches } from "../../services/DispatchService";
import { getDispatchDetails } from "../../services/DespachoService";
import { useNavigate } from "react-router-dom";

export default function DispatchList() {
  // Lista principal
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
  async function handleViewDetail(dispatchId: number) {
    try {
      const details = await getDispatchDetails(dispatchId);

      setDispatchDetails(details);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      setError("No se pudo cargar la información del despacho");
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleFilter() {
    console.log("Filtrar");
  }

  function handleClear() {
    setStartDate("");
    setEndDate("");
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getDispatches();
        setDispatches(data);
      } catch (error) {
        console.log(error);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <p className="text-lg text-slate-500">Cargando despachos...</p>
      </div>
    );
  }

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
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          Registrar despacho
        </button>
      </div>

      {/* Filtro */}
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

      {/* Tabla */}
      <DispatchTable dispatches={dispatches} onViewDetail={handleViewDetail} />

      {/* Modal */}
      <DispatchDetailModal
        details={dispatchDetails}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
