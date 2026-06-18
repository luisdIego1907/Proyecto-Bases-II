import { useEffect, useState } from "react";

import type { ProductMovement } from "../../data/audit/ProductMovement";
import type { ProductAudit } from "../../data/audit/ProductAudit";
import type { InventarioData } from "../../data/Stock";

import {
  getProductAudit,
  getProductMovements,
} from "../../services/AuditService";

import { formatLocalDate } from "../../utils/dateHelper";

import AuditFilter from "../../components/audit/AuditFilter";
import MovementTable from "../../components/Tables/MovementTable";
import AuditTable from "../../components/Tables/AuditTable";
import { getInventory } from "../../services/ProductService";

export default function AuditPage() {
  // Fecha hoy
  const today = new Date();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // Productos para dropdown
  const [products, setProducts] = useState<InventarioData[]>([]);

  // Estados filtros
  const [productId, setProductId] = useState<number | null>(null);

  const [startDate, setStartDate] = useState(formatLocalDate(oneMonthAgo));

  const [endDate, setEndDate] = useState(formatLocalDate(today));

  // Resultados
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [audits, setAudits] = useState<ProductAudit[]>([]);

  // Estados pantalla
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Cargar inventario al entrar
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getInventory();
        setProducts(data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el inventario");
      }
    }

    loadProducts();
  }, []);

  async function handleSearch() {
    if (!productId) {
      alert("Debe seleccionar un producto");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La fecha inicial no puede ser mayor");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fechaInicio: `${startDate}T00:00:00`,
        fechaFin: `${endDate}T23:59:59`,
      };

      const [movementsData, auditsData] = await Promise.all([
        getProductMovements(productId, payload),
        getProductAudit(productId, payload),
      ]);

      setMovements(movementsData);
      setAudits(auditsData);
      setSearched(true);
    } catch (error) {
      console.error(error);
      alert("No se pudo obtener la información");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setProductId(null);
    setMovements([]);
    setAudits([]);
    setSearched(false);

    setStartDate(formatLocalDate(oneMonthAgo));
    setEndDate(formatLocalDate(today));
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Auditoría y Trazabilidad
        </h1>

        <p className="mt-1 text-slate-500">
          Consulte movimientos y auditoría histórica de productos
        </p>
      </div>

      {/* Filtro */}
      <div className="mb-8">
        <AuditFilter
          products={products}
          selectedProduct={productId}
          startDate={startDate}
          endDate={endDate}
          onProductChange={(value) =>
            setProductId(value ? Number(value) : null)
          }
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-slate-500">
          Consultando información...
        </div>
      )}

      {/* Resultados */}
      {!loading && searched && (
        <div className="space-y-8">
          <MovementTable movements={movements} />

          <AuditTable audits={audits} />
        </div>
      )}
    </div>
  );
}
