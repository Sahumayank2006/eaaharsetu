import { useState, useCallback } from 'react';
import { useSensorData } from './use-sensor-data';
import type { SensorStats } from '@/lib/sensor-data';

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

interface UseWarehouseSensorDataReturn {
  stats: SensorStats | null;
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  warehouseId: string;
  setWarehouseId: (id: string) => void;
  availableWarehouses: string[];
  refetch: () => void;
}

/**
 * Hook for warehouse-specific sensor data
 * Enhances useSensorData with warehouse selection capabilities
 */
export function useWarehouseSensorData(
  refreshInterval: number = 30000,
  initialWarehouseId: string = 'W01'
): UseWarehouseSensorDataReturn {
  const [warehouseId, setWarehouseId] = useState<string>(initialWarehouseId);
  
  // List of available warehouses (could be fetched from an API in a real application)
  const availableWarehouses = ['W01', 'W02', 'W03', 'W04', 'W05'];
  
  // Use the updated useSensorData hook with warehouse selection
  const {
    stats,
    chartData,
    isLoading,
    error,
    refetch: baseRefetch
  } = useSensorData(refreshInterval, warehouseId);

  // Create a setWarehouseId wrapper that updates state and triggers a refetch
  const handleSetWarehouseId = useCallback((id: string) => {
    setWarehouseId(id);
  }, []);

  return {
    stats,
    chartData,
    isLoading,
    error,
    warehouseId,
    setWarehouseId: handleSetWarehouseId,
    availableWarehouses,
    refetch: baseRefetch
  };
}