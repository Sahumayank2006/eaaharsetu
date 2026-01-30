
import { RouteOptimization } from "@/components/dashboard/route-optimization";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function RouteOptimizationPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <RouteOptimization />
      </Suspense>
    </div>
  );
}
