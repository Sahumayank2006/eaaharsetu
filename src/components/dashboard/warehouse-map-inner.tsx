"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Thermometer, 
  Droplets, 
  Package, 
  User, 
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Info,
} from "lucide-react";

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
  stockLevel: number;
  capacity: number;
  currentStock: number;
  efficiency: number;
  lastUpdate: string;
  recentPerformance: 'up' | 'down' | 'stable';
  performanceChange: number;
}

interface WarehouseMapInnerProps {
  warehouses: WarehouseData[];
  onWarehouseClick: (warehouse: WarehouseData) => void;
}

// Status color mapping
const getStatusColor = (status: WarehouseStatus): string => {
  switch (status) {
    case 'normal':
      return '#22c55e';
    case 'warning':
      return '#f59e0b';
    case 'critical':
      return '#ef4444';
    default:
      return '#6b7280';
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

// Popup HTML
const createPopupHTML = (warehouse: WarehouseData) => {
  return `
    <div class="p-3 min-w-[320px] text-xs sm:text-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm sm:text-base">${warehouse.name}</h3>
        <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">${warehouse.status.toUpperCase()}</span>
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span>Owner: ${warehouse.owner}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div><span>🌡️ ${warehouse.temperature}°C</span></div>
          <div><span>💧 ${warehouse.humidity}%</span></div>
        </div>
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <span>Stock Level: ${warehouse.stockLevel}%</span>
          </div>
          <div class="text-xs text-gray-600">
            ${warehouse.currentStock} / ${warehouse.capacity} tons
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span>Efficiency: ${warehouse.efficiency}%</span>
          <span class="text-xs font-medium ${warehouse.performanceChange > 0 ? 'text-green-600' : 'text-red-600'}">${warehouse.performanceChange > 0 ? '+' : ''}${warehouse.performanceChange}%</span>
        </div>
        ${warehouse.alertCount > 0 ? `<div class="p-2 bg-red-50 rounded text-red-700">⚠️ ${warehouse.alertCount} Active Alerts</div>` : ''}
        <div class="text-xs text-gray-600">Last updated: ${warehouse.lastUpdate}</div>
      </div>
    </div>
  `;
};

export default function WarehouseMapInner({ warehouses, onWarehouseClick }: WarehouseMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !containerRef.current) return;

    try {
      // Ensure container is clean by checking if it's already initialized by Leaflet
      const container = containerRef.current as any;
      if (container._leaflet_id) {
        return; // Map already initialized, skip
      }

      // Create map instance
      const map = L.map(containerRef.current, {
        center: [25.8, 77.8],
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
      });

      // Add tile layer
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      // Don't remove on unmount, let the cleanup in the other effect handle it
    };
  }, []);

  // Update markers when warehouses change
  useEffect(() => {
    if (!mapInstanceRef.current || !isInitializedRef.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        // Marker might already be removed
      }
    });
    markersRef.current = [];

    // Add new markers
    warehouses.forEach((warehouse) => {
      try {
        const marker = L.circleMarker(
          [warehouse.lat, warehouse.lng],
          {
            radius: 12,
            fillColor: getStatusColor(warehouse.status),
            color: getStatusColor(warehouse.status),
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8,
          }
        ).addTo(mapInstanceRef.current!);

        // Bind popup
        marker.bindPopup(createPopupHTML(warehouse));

        // Bind tooltip
        marker.bindTooltip(
          `<div><div class="font-semibold text-sm">${warehouse.name}</div><div class="text-xs text-gray-600">Status: ${warehouse.status}</div></div>`,
          {
            direction: 'top',
            offset: [0, -10],
            opacity: 1,
          }
        );

        // Handle click
        marker.on('click', () => {
          onWarehouseClick(warehouse);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Failed to add marker:', error);
      }
    });
  }, [warehouses, onWarehouseClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        markersRef.current = [];
        isInitializedRef.current = false;
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
