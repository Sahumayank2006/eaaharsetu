import { useState, useEffect } from 'react';
import { SpoilagePrediction } from '@/lib/warehouse-predictions';

interface WarehousePredictionsReturn {
  isLoading: boolean;
  error: string | null;
  predictions: SpoilagePrediction[];
  refetch: () => void;
}

export function useWarehousePredictions(warehouseId: string, temperature?: number, humidity?: number): WarehousePredictionsReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<SpoilagePrediction[]>([]);

  const fetchPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('warehouseId', warehouseId);
      if (temperature !== undefined) params.append('temperature', temperature.toString());
      if (humidity !== undefined) params.append('humidity', humidity.toString());
      
      const response = await fetch(`/api/predictions?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch predictions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching predictions');
      console.error('Error fetching predictions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
    
    // Set up polling to refresh data periodically
    const intervalId = setInterval(fetchPredictions, 15 * 60 * 1000); // Every 15 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, [warehouseId, temperature, humidity]);

  return {
    isLoading,
    error,
    predictions,
    refetch: fetchPredictions
  };
}