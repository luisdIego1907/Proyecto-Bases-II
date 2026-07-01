import { useEffect, useState } from "react";

import type { RecepcionProducto } from "../../data/reception";

import { getRecepcionesProducto } from "../../services/ReceptionService";
import ReceptionTable from "../../components/Tables/ReceptionTable";

type ReceptionListProps = {
  productoId: number;
};

export default function ReceptionList({
  productoId,
}: ReceptionListProps) {

  const [recepciones, setRecepciones] = useState<RecepcionProducto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getRecepcionesProducto(productoId);

        setRecepciones(data);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar las recepciones.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [productoId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-lg text-slate-500">
          Cargando recepciones...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        
        <h3 className="text-2xl font-bold text-slate-800">
          Historial de Recepciones
        </h3>

        <p className="mt-1 text-slate-500">
          Recepciones registradas para este producto
        </p>
      </div>

      <ReceptionTable recepciones={recepciones} />
    </div>
  );
}