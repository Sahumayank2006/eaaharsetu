"use client";

import { useState } from "react";
import {
  Package,
  Thermometer,
  Droplets,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useWarehouseSensorData } from "@/hooks/use-warehouse-sensor-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const sensorChartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
};

export function WarehouseSensorMonitor() {
  const {
    stats,
    chartData,
    isLoading,
    error,
    warehouseId,
    setWarehouseId,
    availableWarehouses,
    refetch
  } = useWarehouseSensorData(30000);

  // Render small circles only for last 3 updates to reduce clutter
  const tailDot = (dataLen: number, cssVarColor: string) => (props: any) => {
    const { index, cx, cy } = props;
    const isTail = typeof index === 'number' && index >= Math.max(0, dataLen - 3);
    if (isTail) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={`var(${cssVarColor})`}
          stroke="#ffffff"
          strokeWidth={1}
        />
      );
    }
    // Return an empty SVG group to satisfy type checker (cannot return null)
    return <g />;
  };

  // Helper function to determine temperature status with rim animation
  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { 
      status: "Low", 
      color: "text-blue-600",
      borderClass: "border-2 border-blue-500",
      rimClass: "rim-animation rim-animation-blue"
    };
    if (temp > 25) return { 
      status: "High", 
      color: "text-red-600",
      borderClass: "border-2 border-red-500",
      rimClass: "rim-animation rim-animation-red"
    };
    return { 
      status: "Optimal", 
      color: "text-green-600",
      borderClass: "border-2 border-green-500",
      rimClass: ""
    };
  };

  // Helper function to determine humidity status with rim animation
  const getHumidityStatus = (humidity: number) => {
    if (humidity < 45) return { 
      status: "Low", 
      color: "text-amber-600",
      borderClass: "border-2 border-amber-500",
      rimClass: "rim-animation rim-animation-amber"
    };
    if (humidity > 75) return { 
      status: "High", 
      color: "text-red-600",
      borderClass: "border-2 border-red-500",
      rimClass: "rim-animation rim-animation-red"
    };
    return { 
      status: "Stable", 
      color: "text-green-600",
      borderClass: "border-2 border-green-500",
      rimClass: ""
    };
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Failed to load sensor data: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 mt-2 sm:mt-0">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Warehouse Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Warehouse Sensor Monitoring</h2>
          <p className="text-sm text-muted-foreground">Real-time IoT sensor data from selected warehouse</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Warehouse:</span>
            <Select
              value={warehouseId}
              onValueChange={(value) => {
                setWarehouseId(value);
                refetch();
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {availableWarehouses.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Readings
            </CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.totalReadings || 0}</div>
            )}
            <p className="text-sm text-gray-500">
              From warehouse {warehouseId}
            </p>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-all duration-300 ${stats ? getTemperatureStatus(stats.avgTemperature).borderClass : 'border-2 border-gray-200'} ${stats ? getTemperatureStatus(stats.avgTemperature).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Avg. Temperature</CardTitle>
            <Thermometer className={`h-5 w-5 ${stats ? getTemperatureStatus(stats.avgTemperature).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgTemperature || 0} °C</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getTemperatureStatus(stats.avgTemperature).color}`}>
                {getTemperatureStatus(stats.avgTemperature).status} range
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-all duration-300 ${stats ? getHumidityStatus(stats.avgHumidity).borderClass : 'border-2 border-gray-200'} ${stats ? getHumidityStatus(stats.avgHumidity).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Avg. Humidity
            </CardTitle>
            <Droplets className={`h-5 w-5 ${stats ? getHumidityStatus(stats.avgHumidity).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgHumidity || 0} %</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getHumidityStatus(stats.avgHumidity).color}`}>
                {getHumidityStatus(stats.avgHumidity).status} conditions
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              Last Update
            </CardTitle>
            <RefreshCw className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              <div className="text-lg font-bold text-gray-900">
                {stats?.lastReading 
                  ? new Date(stats.lastReading.timestamp).toLocaleTimeString() 
                  : 'No data'}
              </div>
            )}
            <p className="text-sm text-gray-500">
              {stats?.lastReading 
                ? new Date(stats.lastReading.timestamp).toLocaleDateString() 
                : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Chart */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Warehouse {warehouseId} Sensor Data
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Temperature and humidity over last 12 hours
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 0 ? (
            <ChartContainer config={sensorChartConfig} className="h-[300px] w-full">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  fontSize={10}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="hsl(var(--chart-1))" 
                  fontSize={10}
                  width={40}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="hsl(var(--chart-2))" 
                  fontSize={10}
                  width={40}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend fontSize={10} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="var(--color-temperature)" 
                  strokeWidth={2} 
                  dot={tailDot(chartData.length, '--color-temperature') as any}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="var(--color-humidity)" 
                  strokeWidth={2} 
                  dot={tailDot(chartData.length, '--color-humidity') as any}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sensor data available for Warehouse {warehouseId}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}