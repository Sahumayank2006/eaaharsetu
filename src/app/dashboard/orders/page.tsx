
import { DealerOrders } from "@/components/dashboard/dealer-orders";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading orders...</div>}>
        <DealerOrders />
      </Suspense>
    </div>
  );
}
