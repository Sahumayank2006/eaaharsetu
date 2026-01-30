"use client";

import { useEffect, useState } from "react";
import { Bell, AlertTriangle, Clock, ThermometerSun, Droplets } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehouseAlerts } from "@/components/dashboard/warehouse-alerts";
import { ProductShelfLife } from "@/components/dashboard/product-shelf-life";
import { WarehouseWeatherCard } from "@/components/dashboard/warehouse-weather-card";
import { useSensorData } from "@/hooks/use-sensor-data";

export default function AlertsPage() {
  const { stats, isLoading, error, refetch } = useSensorData(30000);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Failed to load alert data: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 mt-2 sm:mt-0">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Conditions Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Current Temperature
            </CardTitle>
            <ThermometerSun className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgTemperature || 0}°C</div>
            )}
            <p className="text-sm text-muted-foreground">Warehouse average</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Current Humidity
            </CardTitle>
            <Droplets className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgHumidity || 0}%</div>
            )}
            <p className="text-sm text-muted-foreground">Warehouse average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Alerts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Warehouse Alerts */}
        <div className="space-y-6">
          <WarehouseAlerts 
            warehouseId="W01"
            temperature={stats?.avgTemperature || 22}
            humidity={stats?.avgHumidity || 60}
            refreshing={isLoading}
            className="h-fit"
          />
          
          <WarehouseWeatherCard 
            warehouseId="W01"
            className="h-fit"
          />
        </div>

        {/* Right Column - Product Shelf Life */}
        <div className="space-y-6">
          <ProductShelfLife 
            warehouseId="W01"
            temperature={stats?.avgTemperature || 22}
            humidity={stats?.avgHumidity || 60}
            className="h-fit"
          />
        </div>
      </div>
    </div>
  );
}
