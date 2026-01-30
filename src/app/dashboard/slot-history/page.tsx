
import { FarmerSlotHistory } from "@/components/dashboard/farmer-slot-history";
import { Suspense } from "react";

export default function SlotHistoryPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading slot history...</div>}>
        <FarmerSlotHistory />
      </Suspense>
    </div>
  );
}
