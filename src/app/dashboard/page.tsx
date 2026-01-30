"use client";

import { useSearchParams } from "next/navigation";
import type { Role } from "@/lib/types";

import FarmerDashboard from "@/components/dashboard/farmer-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import DealerDashboard from "@/components/dashboard/dealer-dashboard";
import GreenGuardianDashboard from "@/components/dashboard/green-guardian-dashboard";
import LogisticsDashboard from "@/components/dashboard/logistics-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as Role | null;

  if (!role) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  switch (role) {
    case "farmer":
      return <FarmerDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "dealer":
      return <DealerDashboard />;
    case "green-guardian":
      return <GreenGuardianDashboard />;
    case "logistics":
      return <LogisticsDashboard />;
    default:
      return <div>Invalid role selected.</div>;
  }
}

export default function DashboardPage() {
    return <DashboardPageContent />;
}
