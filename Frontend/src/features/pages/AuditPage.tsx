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
import BackButton from "../../shared/BackButton";

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

  // Producto seleccionado (para resumen)
  const selectedProduct = products.find(
    (product) => product.productoId === productId,
  );

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
      <div className="mb-5">
        <BackButton />
        
        <h1 className="text-2xl font-bold text-slate-800">
          Auditoría y Trazabilidad
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulte movimientos y auditoría histórica de productos
        </p>
      </div>

      {/* Filtro */}
      <div className="mb-6">
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">Consultando información...</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && searched && (
        <div className="space-y-6">
          {/* Resumen */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 font-semibold text-slate-700">
              Resultado de búsqueda
            </h3>

            <div className="space-y-1 text-sm text-slate-600">
              <p>
                Producto:{" "}
                <span className="font-medium">
                  {selectedProduct?.nombre ?? "No disponible"}
                </span>
              </p>

              <p>
                Movimientos encontrados:{" "}
                <span className="font-medium">{movements.length}</span>
              </p>

              <p>
                Registros de auditoría:{" "}
                <span className="font-medium">{audits.length}</span>
              </p>
            </div>
          </div>

          {/* Tabla movimientos */}
          <MovementTable movements={movements} maxHeight="320px" />

          {/* Tabla auditoría */}
          <AuditTable audits={audits} maxHeight="320px" />
        </div>
      )}
    </div>
  );
}
