"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Map, Package } from "lucide-react";
import { RouteOptimization } from "./route-optimization";

export default function LogisticsDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="route-optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="route-optimization">
            <Map className="mr-2 h-4 w-4" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger value="delivery-tracking" disabled>
            <Package className="mr-2 h-4 w-4" />
            Delivery Tracking
          </TabsTrigger>
           <TabsTrigger value="fleet-management" disabled>
            <Truck className="mr-2 h-4 w-4" />
            Fleet Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="route-optimization">
          <RouteOptimization />
        </TabsContent>
        <TabsContent value="delivery-tracking">
          {/* Placeholder for Delivery Tracking component */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Delivery tracking functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fleet-management">
           {/* Placeholder for Fleet Management component */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fleet management functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
