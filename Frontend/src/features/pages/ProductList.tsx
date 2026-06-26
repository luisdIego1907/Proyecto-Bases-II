import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../../data/product";

import ProductTable from "../../components/Tables/ProductTable";

import {
  getProducts,
  deleteProduct,
  getProductById,
} from "../../services/ProductService";

import DeleteButton from "../../shared/DeleteButton";
import ReceptionList from "./ReceptionList";

export default function ProductList() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "productos" | "recepciones"
  >("productos");

  const [productList, setProductList] = useState<Product[]>([]);

  // Producto seleccionado para consultar recepciones
  const [selectedProductId, setSelectedProductId] =
    useState<number>();

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const inventoryProducts = await getProducts();

        const completeProducts = await Promise.all(
          inventoryProducts.map((p) =>
            getProductById(p.productoId)
          )
        );

        setProductList(completeProducts);

        if (completeProducts.length > 0) {
          setSelectedProductId(
            completeProducts[0].productoId
          );
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const handleSelectCheckbox = (id: number) => {
    setSuccessMessage("");

    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleDeleteProducts = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setSuccessMessage("");
      setDeleteError("");

      const productsToDelete = productList.filter((p) =>
        selectedProducts.includes(p.productoId)
      );

      await Promise.all(
        productsToDelete.map((p) =>
          deleteProduct(p.productoResourceId)
        )
      );

      setProductList((prev) =>
        prev.filter(
          (p) => !selectedProducts.includes(p.productoId)
        )
      );

      setSelectedProducts([]);

      setSuccessMessage(
        "Producto(s) eliminado(s) correctamente."
      );
    } catch (err) {
      console.error(err);

      setDeleteError(
        "No se pudieron eliminar los productos."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
        <h2 className="mt-6 text-xl font-semibold text-slate-700">
          Cargando productos
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-24">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
  <div className="container mx-auto px-6 py-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Gestión de Productos
        </h1>

        <p className="text-slate-500 mt-1">
          Administra los productos y consulta sus recepciones
        </p>
      </div>

      {activeTab === "productos" && (
        <div className="flex items-center gap-3">
          <DeleteButton
            label="Eliminar productos"
            loadingLabel="Eliminando..."
            disabled={selectedProducts.length === 0}
            confirmMessage={`¿Eliminar ${selectedProducts.length} producto(s)?`}
            onDelete={handleDeleteProducts}
          />

          <button
            onClick={() => navigate("/products/register")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium"
          >
            + Nuevo Producto
          </button>
        </div>
      )}
    </div>

    // Tabs
    <div className="mb-8 border-b border-slate-200">
      <div className="flex gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("productos")}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === "productos"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Productos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recepciones")}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === "recepciones"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Recepciones
        </button>
      </div>
    </div>

    {activeTab === "productos" ? (
      <>
        {selectedProducts.length > 0 && (
          <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            {selectedProducts.length} producto(s) seleccionado(s)
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

        {productList.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="bg-white border border-slate-200 rounded-3xl px-10 py-12 shadow-sm text-center max-w-lg">
              <h2 className="text-2xl font-bold text-slate-700">
                No hay productos registrados
              </h2>
            </div>
          </div>
        ) : (
          <ProductTable
            products={productList}
            selectedProducts={selectedProducts}
            onSelect={handleSelectCheckbox}
            onEdit={(id) => navigate(`/products/${id}`)}
            onSelectProduct={(id) =>
              navigate(`/products/${id}/reception`)
            }
          />
        )}
      </>
    ) : (
      <div className="space-y-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Producto
          </label>

          <select
            value={selectedProductId}
            onChange={(e) =>
              setSelectedProductId(Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {productList.map((product) => (
              <option
                key={product.productoId}
                value={product.productoId}
              >
                {product.codigo} - {product.nombre}
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <ReceptionList
            productoId={selectedProductId}
          />
        )}
      </div>
    )}
  </div>
);
}