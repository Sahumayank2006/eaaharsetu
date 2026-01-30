"use client";

import { useSearchParams } from "next/navigation";
import { InventoryManagement } from "@/components/dashboard/inventory-management";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "farmer";

  if (role !== "green-guardian") {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">This page is only available for warehouse managers.</p>
        </div>
      </div>
    );
  }

  return <InventoryManagement />;
}
