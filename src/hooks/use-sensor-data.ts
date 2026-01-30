import { useState, useEffect } from 'react';

interface SensorStats {
  avgTemperature: number;
  avgHumidity: number;
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
  totalReadings: number;
  lastReading: {
    timestamp: string;
    temperature: number;
    humidity: number;
    warehouse_id: string;
  } | null;
}

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number | null;
}

interface UseSensorDataReturn {
  stats: SensorStats | null;
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  source: 'adafruit-io' | 'csv-fallback';
}

export function useSensorData(
  refreshInterval: number = 30000,
  warehouseId: string = 'W01'
): UseSensorDataReturn {
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'adafruit-io' | 'csv-fallback'>('adafruit-io');

  const fetchSensorData = async () => {
    try {
      setError(null);

      // Fetch stats and chart data in parallel
      const [statsResponse, chartResponse] = await Promise.all([
        fetch(`/api/sensor-data?type=stats&warehouse_id=${warehouseId}`),
        fetch(`/api/sensor-data?type=chart&hours=12&warehouse_id=${warehouseId}`)
      ]);

      if (!statsResponse.ok || !chartResponse.ok) {
        throw new Error('Failed to fetch sensor data');
      }

      const statsData = await statsResponse.json();
      const chartDataResult = await chartResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
        setSource(statsData.source || 'adafruit-io');
      } else {
        throw new Error(statsData.error || 'Failed to get stats data');
      }

      if (chartDataResult.success) {
        setChartData(chartDataResult.data);
      } else {
        throw new Error(chartDataResult.error || 'Failed to get chart data');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching sensor data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchSensorData();
  };

  useEffect(() => {
    // Initial fetch or re-fetch when warehouseId changes
    fetchSensorData();

    // Set up polling if refreshInterval is provided
    if (refreshInterval > 0) {
      const interval = setInterval(fetchSensorData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, warehouseId]);

  return {
    stats,
    chartData,
    isLoading,
    error,
    refetch,
    source
  };
}