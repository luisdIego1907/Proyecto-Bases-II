import { useEffect, useState } from "react";
import type { InventarioData } from "../../data/Stock";
import { getInventory } from "../../services/ProductService";

import PageGreeting from "./PageGreeting";
import QuickActions from "./QuickActions";
import DashboardCards from "./DashboardCards";
import StockCriticalCard from "./StockCriticalCard";

export default function Home() {
  const [inventory, setInventory] = useState<InventarioData[]>([]);

  useEffect(() => {
    getInventory().then(setInventory);
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 space-y-10">
      <PageGreeting />

      <QuickActions />

      <DashboardCards />

      <StockCriticalCard products={inventory} />
    </main>
  );
}