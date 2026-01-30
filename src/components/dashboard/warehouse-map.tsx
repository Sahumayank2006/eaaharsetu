"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Warehouse, 
  AlertTriangle, 
  CheckCircle, 
  Thermometer, 
  Droplets, 
  Package, 
  User, 
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Activity,
  Info,
  Building2,
  Search,
  X,
  Filter
} from "lucide-react";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

type WarehouseStatus = 'normal' | 'warning' | 'critical';

interface WarehouseData {
  id: string;
  name: string;
  owner: string;
  lat: number;
  lng: number;
  status: WarehouseStatus;
  alertCount: number;
  temperature: number;
  humidity: number;
  stockLevel: number; // percentage
  capacity: number; // in tons
  currentStock: number; // in tons
  efficiency: number; // percentage
  lastUpdate: string;
  recentPerformance: 'up' | 'down' | 'stable';
  performanceChange: number; // percentage
}

// Sample warehouse data for Gwalior region with city-specific clusters
const gwaliorWarehouses: WarehouseData[] = [
  // Gwalior City Warehouses (4 warehouses)
  {
    id: "GWL001",
    name: "Gwalior Central Storage Hub",
    owner: "Rajesh Kumar",
    lat: 26.2183,
    lng: 78.1828,
    status: "normal",
    alertCount: 0,
    temperature: 24,
    humidity: 58,
    stockLevel: 85,
    capacity: 1000,
    currentStock: 850,
    efficiency: 92,
    lastUpdate: "2 minutes ago",
    recentPerformance: "up",
    performanceChange: 5.2
  },
  {
    id: "GWL002",
    name: "Gwalior North Warehouse",
    owner: "Anita Verma",
    lat: 26.2350,
    lng: 78.1950,
    status: "warning",
    alertCount: 2,
    temperature: 28,
    humidity: 72,
    stockLevel: 92,
    capacity: 850,
    currentStock: 782,
    efficiency: 88,
    lastUpdate: "4 minutes ago",
    recentPerformance: "down",
    performanceChange: -1.8
  },
  {
    id: "GWL003",
    name: "Gwalior East Agricultural Hub",
    owner: "Suresh Gupta",
    lat: 26.2100,
    lng: 78.2100,
    status: "normal",
    alertCount: 1,
    temperature: 25,
    humidity: 61,
    stockLevel: 78,
    capacity: 950,
    currentStock: 741,
    efficiency: 94,
    lastUpdate: "3 minutes ago",
    recentPerformance: "stable",
    performanceChange: 1.2
  },
  {
    id: "GWL004",
    name: "Gwalior South Cold Storage",
    owner: "Kavita Sharma",
    lat: 26.1950,
    lng: 78.1700,
    status: "critical",
    alertCount: 5,
    temperature: 31,
    humidity: 80,
    stockLevel: 96,
    capacity: 1100,
    currentStock: 1056,
    efficiency: 76,
    lastUpdate: "1 minute ago",
    recentPerformance: "down",
    performanceChange: -6.4
  },
  
  // Morena City Warehouses (3 warehouses)
  {
    id: "MOR001",
    name: "Morena Main Cold Storage",
    owner: "Amit Patel",
    lat: 26.5019,
    lng: 78.0011,
    status: "warning",
    alertCount: 3,
    temperature: 29,
    humidity: 75,
    stockLevel: 89,
    capacity: 1200,
    currentStock: 1068,
    efficiency: 82,
    lastUpdate: "2 minutes ago",
    recentPerformance: "down",
    performanceChange: -4.2
  },
  {
    id: "MOR002",
    name: "Morena Grain Terminal",
    owner: "Deepak Singh",
    lat: 26.4850,
    lng: 78.0200,
    status: "normal",
    alertCount: 0,
    temperature: 26,
    humidity: 64,
    stockLevel: 73,
    capacity: 900,
    currentStock: 657,
    efficiency: 96,
    lastUpdate: "5 minutes ago",
    recentPerformance: "up",
    performanceChange: 4.8
  },
  {
    id: "MOR003",
    name: "Morena Agricultural Complex",
    owner: "Rekha Agarwal",
    lat: 26.5150,
    lng: 77.9850,
    status: "normal",
    alertCount: 1,
    temperature: 24,
    humidity: 59,
    stockLevel: 81,
    capacity: 800,
    currentStock: 648,
    efficiency: 91,
    lastUpdate: "3 minutes ago",
    recentPerformance: "up",
    performanceChange: 2.7
  },

  // Bhind City Warehouses (3 warehouses)
  {
    id: "BHD001",
    name: "Bhind Central Warehouse",
    owner: "Priya Sharma",
    lat: 26.5645,
    lng: 78.7789,
    status: "critical",
    alertCount: 4,
    temperature: 32,
    humidity: 83,
    stockLevel: 98,
    capacity: 800,
    currentStock: 784,
    efficiency: 74,
    lastUpdate: "1 minute ago",
    recentPerformance: "down",
    performanceChange: -9.1
  },
  {
    id: "BHD002",
    name: "Bhind Storage Facility",
    owner: "Ramesh Yadav",
    lat: 26.5500,
    lng: 78.7650,
    status: "warning",
    alertCount: 2,
    temperature: 27,
    humidity: 69,
    stockLevel: 87,
    capacity: 700,
    currentStock: 609,
    efficiency: 85,
    lastUpdate: "4 minutes ago",
    recentPerformance: "stable",
    performanceChange: 0.5
  },
  {
    id: "BHD003",
    name: "Bhind Logistics Hub",
    owner: "Sunita Jain",
    lat: 26.5800,
    lng: 78.7900,
    status: "normal",
    alertCount: 0,
    temperature: 25,
    humidity: 63,
    stockLevel: 69,
    capacity: 650,
    currentStock: 448,
    efficiency: 97,
    lastUpdate: "2 minutes ago",
    recentPerformance: "up",
    performanceChange: 6.3
  },

  // Datia City Warehouses (2 warehouses)
  {
    id: "DAT001",
    name: "Datia Grain Terminal",
    owner: "Sunita Singh",
    lat: 25.6675,
    lng: 78.4614,
    status: "normal",
    alertCount: 1,
    temperature: 25,
    humidity: 62,
    stockLevel: 72,
    capacity: 900,
    currentStock: 648,
    efficiency: 95,
    lastUpdate: "3 minutes ago",
    recentPerformance: "stable",
    performanceChange: 0.8
  },
  {
    id: "DAT002",
    name: "Datia Distribution Center",
    owner: "Manoj Kumar",
    lat: 25.6550,
    lng: 78.4750,
    status: "warning",
    alertCount: 3,
    temperature: 28,
    humidity: 71,
    stockLevel: 91,
    capacity: 750,
    currentStock: 682,
    efficiency: 81,
    lastUpdate: "6 minutes ago",
    recentPerformance: "down",
    performanceChange: -3.5
  },

  // Shivpuri City Warehouses (2 warehouses)
  {
    id: "SHV001",
    name: "Shivpuri Storage Complex",
    owner: "Vikram Chouhan",
    lat: 25.4236,
    lng: 77.6581,
    status: "normal",
    alertCount: 0,
    temperature: 23,
    humidity: 57,
    stockLevel: 76,
    capacity: 1100,
    currentStock: 836,
    efficiency: 93,
    lastUpdate: "4 minutes ago",
    recentPerformance: "up",
    performanceChange: 3.2
  },
  {
    id: "SHV002",
    name: "Shivpuri Cold Chain Hub",
    owner: "Geeta Malhotra",
    lat: 25.4100,
    lng: 77.6400,
    status: "warning",
    alertCount: 2,
    temperature: 29,
    humidity: 74,
    stockLevel: 88,
    capacity: 850,
    currentStock: 748,
    efficiency: 86,
    lastUpdate: "5 minutes ago",
    recentPerformance: "down",
    performanceChange: -2.9
  },

  // Guna City Warehouses (2 warehouses)
  {
    id: "GUN001",
    name: "Guna Distribution Center",
    owner: "Meera Agarwal",
    lat: 24.6507,
    lng: 77.3117,
    status: "normal",
    alertCount: 0,
    temperature: 23,
    humidity: 55,
    stockLevel: 67,
    capacity: 750,
    currentStock: 502,
    efficiency: 98,
    lastUpdate: "1 minute ago",
    recentPerformance: "up",
    performanceChange: 7.1
  },
  {
    id: "GUN002",
    name: "Guna Agricultural Storage",
    owner: "Harish Patel",
    lat: 24.6350,
    lng: 77.2950,
    status: "normal",
    alertCount: 1,
    temperature: 24,
    humidity: 58,
    stockLevel: 70,
    capacity: 650,
    currentStock: 455,
    efficiency: 92,
    lastUpdate: "7 minutes ago",
    recentPerformance: "stable",
    performanceChange: 1.8
  }
];

// Status color mapping
const getStatusColor = (status: WarehouseStatus): string => {
  switch (status) {
    case 'normal':
      return '#22c55e'; // green
    case 'warning':
      return '#f59e0b'; // amber
    case 'critical':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

const getStatusIcon = (status: WarehouseStatus) => {
  switch (status) {
    case 'normal':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'critical':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getPerformanceIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable':
      return <Activity className="h-4 w-4 text-blue-500" />;
  }
};

interface WarehouseMapProps {
  onWarehouseSelect?: (warehouse: WarehouseData) => void;
}

export function WarehouseMap({ onWarehouseSelect }: WarehouseMapProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleWarehouseClick = (warehouse: WarehouseData) => {
    setSelectedWarehouse(warehouse);
    onWarehouseSelect?.(warehouse);
  };

  // Filter warehouses based on search and filters
  const filteredWarehouses = gwaliorWarehouses.filter(warehouse => {
    const matchesSearch = searchQuery === "" || 
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || warehouse.status === statusFilter;
    
    const warehouseCity = warehouse.id.startsWith('GWL') ? 'gwalior' :
                         warehouse.id.startsWith('MOR') ? 'morena' :
                         warehouse.id.startsWith('BHD') ? 'bhind' :
                         warehouse.id.startsWith('DAT') ? 'datia' :
                         warehouse.id.startsWith('SHV') ? 'shivpuri' :
                         warehouse.id.startsWith('GUN') ? 'guna' : '';
    
    const matchesCity = cityFilter === "all" || warehouseCity === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCityFilter("all");
  };

  // Summary statistics (using filtered warehouses)
  const totalWarehouses = filteredWarehouses.length;
  const normalWarehouses = filteredWarehouses.filter(w => w.status === 'normal').length;
  const warningWarehouses = filteredWarehouses.filter(w => w.status === 'warning').length;
  const criticalWarehouses = filteredWarehouses.filter(w => w.status === 'critical').length;
  const totalAlerts = filteredWarehouses.reduce((sum, w) => sum + w.alertCount, 0);
  
  // Overall statistics (for reference)
  const totalAllWarehouses = gwaliorWarehouses.length;

  // City-wise statistics (using filtered warehouses)
  const cityStats = {
    Gwalior: filteredWarehouses.filter(w => w.id.startsWith('GWL')).length,
    Morena: filteredWarehouses.filter(w => w.id.startsWith('MOR')).length,
    Bhind: filteredWarehouses.filter(w => w.id.startsWith('BHD')).length,
    Datia: filteredWarehouses.filter(w => w.id.startsWith('DAT')).length,
    Shivpuri: filteredWarehouses.filter(w => w.id.startsWith('SHV')).length,
    Guna: filteredWarehouses.filter(w => w.id.startsWith('GUN')).length,
  };

  if (!isClient) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gwalior Region Warehouses
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading map...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Warehouses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by warehouse name, owner, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="w-full md:w-48">
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="gwalior">Gwalior</SelectItem>
                  <SelectItem value="morena">Morena</SelectItem>
                  <SelectItem value="bhind">Bhind</SelectItem>
                  <SelectItem value="datia">Datia</SelectItem>
                  <SelectItem value="shivpuri">Shivpuri</SelectItem>
                  <SelectItem value="guna">Guna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || statusFilter !== "all" || cityFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {totalWarehouses} of {totalAllWarehouses} warehouses
            </span>
            {(searchQuery || statusFilter !== "all" || cityFilter !== "all") && (
              <Badge variant="secondary">
                <Filter className="h-3 w-3 mr-1" />
                Filtered
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Warehouses</p>
                <p className="text-2xl font-bold">{totalWarehouses}</p>
              </div>
              <Warehouse className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Normal</p>
                <p className="text-2xl font-bold text-green-600">{normalWarehouses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-amber-600">{warningWarehouses}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalWarehouses}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City-wise Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            City-wise Warehouse Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(cityStats).map(([city, count]) => (
              <div key={city} className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-muted-foreground">{city}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Component */}
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <MapPin className="h-5 w-5" />
            Multi-City Warehouse Network
            <Badge variant="outline" className="ml-2">
              {totalWarehouses} Warehouses
            </Badge>
            {totalAlerts > 0 && (
              <Badge variant="destructive">
                {totalAlerts} Active Alerts
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[400px]">
          {filteredWarehouses.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No warehouses found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[25.8, 77.8]} // Adjusted center to show all cities
              zoom={8}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredWarehouses.map((warehouse) => (
              <CircleMarker
                key={warehouse.id}
                center={[warehouse.lat, warehouse.lng]}
                radius={12}
                pathOptions={{
                  color: getStatusColor(warehouse.status),
                  fillColor: getStatusColor(warehouse.status),
                  fillOpacity: 0.8,
                  weight: 3,
                }}
                eventHandlers={{
                  click: () => handleWarehouseClick(warehouse),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-sm">
                    <div className="font-semibold">{warehouse.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Status: {warehouse.status}
                    </div>
                  </div>
                </Tooltip>
                
                <Popup>
                  <div className="p-2 min-w-[280px]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{warehouse.name}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(warehouse.status)}
                        <Badge 
                          variant={warehouse.status === 'normal' ? 'default' : 
                                  warehouse.status === 'warning' ? 'secondary' : 'destructive'}
                        >
                          {warehouse.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Owner */}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Owner: {warehouse.owner}</span>
                      </div>

                      {/* Environmental Conditions */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{warehouse.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{warehouse.humidity}%</span>
                        </div>
                      </div>

                      {/* Stock Level */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Stock Level</span>
                          </div>
                          <span className="text-sm font-medium">{warehouse.stockLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              warehouse.stockLevel > 90 ? 'bg-red-500' :
                              warehouse.stockLevel > 70 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${warehouse.stockLevel}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {warehouse.currentStock} / {warehouse.capacity} tons
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPerformanceIcon(warehouse.recentPerformance)}
                          <span className="text-sm">Efficiency: {warehouse.efficiency}%</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          warehouse.performanceChange > 0 ? 'text-green-600' :
                          warehouse.performanceChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {warehouse.performanceChange > 0 ? '+' : ''}{warehouse.performanceChange}%
                        </span>
                      </div>

                      {/* Alerts */}
                      {warehouse.alertCount > 0 && (
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700">Active Alerts</span>
                          </div>
                          <Badge variant="destructive">{warehouse.alertCount}</Badge>
                        </div>
                      )}

                      {/* Last Update */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Last updated: {warehouse.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Status Legend</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Critical</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}