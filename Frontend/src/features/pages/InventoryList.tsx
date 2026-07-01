import { useEffect, useState } from "react";

import type { InventarioData } from "../../data/Stock";

import InventoryTable from "../../components/Tables/InventoryTable";
import { getInventory } from "../../services/ProductService";
import BackButton from "../../shared/BackButton";

export default function InventoryList() {
  // Obtener lista inventario
  const [inventoryList, setInventoryList] = useState<InventarioData[]>([]);

  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getInventory();

        setInventoryList(data);
      } catch (error) {
        console.log(error);

        setError("No se pudo cargar el inventario");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <p className="text-lg text-slate-500">Cargando inventario...</p>
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
      <div className="mb-8">
        <BackButton />
        
        <h1 className="text-3xl font-bold text-slate-800">
          Monitoreo de Inventario
        </h1>

        <p className="mt-1 text-slate-500">
          Estado actual de productos en almacén
        </p>
      </div>

      <InventoryTable products={inventoryList} />
    </div>
  );
}
