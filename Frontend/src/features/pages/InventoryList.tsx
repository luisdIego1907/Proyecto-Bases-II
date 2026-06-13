import { useEffect, useState } from "react";
import { inventoryMock } from "../../mock/inventario.mock";
import InventoryTable from "../../components/Tables/InventoryTable";

export default function InventoryList() {
  const [inventoryList, setInventoryList] = useState(inventoryMock);

  useEffect(() => {
    setInventoryList(inventoryMock); // cambiar la funcion de service
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Monitoreo de Inventario
        </h1>

        <p className="text-slate-500 mt-1">
          Estado actual de productos en almacén
        </p>
      </div>

      <InventoryTable products={inventoryList} />
    </div>
  );
}
