'use client';

import { useState } from 'react';
import { sendSensorDataToML, getPredictionWithFallback } from '@/lib/ml-api';
import type { MLPredictionResponse } from '@/lib/ml-api';

export function useMLPrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<MLPredictionResponse | null>(null);

  const predict = async (temperature: number, humidity: number, options?: {
    warehouse_id?: string;
    crop_type?: string;
    use_fallback?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = options?.use_fallback 
        ? await getPredictionWithFallback({ temperature, humidity, ...options })
        : await sendSensorDataToML({ temperature, humidity, ...options });
      
      setPrediction(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const predictViaAPI = async (temperature: number, humidity: number, options?: {
    warehouse_id?: string;
    crop_type?: string;
    use_fallback?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ml-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, humidity, ...options }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPrediction(null);
    setError(null);
    setLoading(false);
  };

  return {
    predict,
    predictViaAPI,
    prediction,
    loading,
    error,
    reset,
  };
}
