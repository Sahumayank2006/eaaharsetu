"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Map, Package, RouteIcon } from "lucide-react";
import { RouteOptimization } from "./route-optimization";

export default function LogisticsDashboard() {
  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Logistics Management</h1>
        <p className="text-muted-foreground">
          Optimize routes and track deliveries across your fleet
        </p>
      </div>

      <Tabs defaultValue="route-optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger 
            value="route-optimization"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
          >
            <Map className="mr-2 h-4 w-4" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger 
            value="delivery-tracking" 
            disabled
            className="rounded-lg py-3"
          >
            <Package className="mr-2 h-4 w-4" />
            Delivery Tracking
          </TabsTrigger>
          <TabsTrigger 
            value="fleet-management" 
            disabled
            className="rounded-lg py-3"
          >
            <Truck className="mr-2 h-4 w-4" />
            Fleet Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="route-optimization" className="mt-6">
          <RouteOptimization />
        </TabsContent>
        <TabsContent value="delivery-tracking">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <CardTitle>Delivery Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold">Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-1">Delivery tracking functionality will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fleet-management">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-200">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <CardTitle>Fleet Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold">Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-1">Fleet management functionality will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
