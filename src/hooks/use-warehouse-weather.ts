import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/warehouse-predictions';

interface WarehouseWeatherReturn {
  isLoading: boolean;
  error: string | null;
  weatherData: WeatherData | null;
  refetch: () => void;
}

export function useWarehouseWeather(warehouseId: string): WarehouseWeatherReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?warehouseId=${warehouseId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Optional: Set up polling to refresh data periodically
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000); // Every 30 minutes
    
    return () => {
      clearInterval(intervalId);
    };
  }, [warehouseId]);

  return {
    isLoading,
    error,
    weatherData,
    refetch: fetchWeatherData
  };
}
