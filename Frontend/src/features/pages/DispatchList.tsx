import { useEffect, useState } from "react";

import type { DispatchSummary } from "../../data/dispatch/DispatchResponses";
import DispatchTable from "../../components/Tables/DispatchTable";
import { getDispatches } from "../../services/DispatchService";
import DispatchFilter from "../../components/dispatch/DispatchFilter";

export default function DispatchList() {
  const [dispatches, setDispatches] = useState<DispatchSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    return <p>Cargando...</p>;
  }

  if (error) {
    return (
      <div className="flex justify-center py-24">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            No se pudieron cargar los productos
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/*Barra de filtrado*/}
      <DispatchFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilter={handleFilter}
        onClear={handleClear}
      />
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Despachos</h1>

          <p className="text-gray-500 mt-1">
            Administre las salidas del almacén
          </p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-medium">
          Registrar despacho
        </button>
      </div>
      <DispatchTable dispatches={dispatches} />
    </div>
  );
}
