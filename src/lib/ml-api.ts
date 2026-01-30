// ML Model API Integration
const ML_API_BASE_URL = 'http://172.22.40.105:5000';

export interface SensorDataInput {
  temperature: number;
  humidity: number;
  warehouse_id?: string;
  crop_type?: string;
}

export interface MLPredictionResponse {
  prediction?: number;
  spoilage_risk?: number;
  status?: string;
  timestamp?: string;
  recommendations?: string;
  received_at?: string;
  alert?: boolean;
  success?: boolean;
  spoilage_time_days?: number;
  risk_level?: number;
  final_moisture_content?: number;
  yield_loss_percentage?: number;
  safe_storage_temp?: number;
  self_heating_risk?: number;
  time_to_critical_moisture?: number;
  recommended_action?: string;
  recommendation_message?: string;
  [key: string]: any;
}

/**
 * Send sensor data to ML model for prediction
 */
export async function sendSensorDataToML(
  data: SensorDataInput
): Promise<MLPredictionResponse> {
  try {
    const response = await fetch(`${ML_API_BASE_URL}/iot/sensor-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling ML model API:', error);
    throw error;
  }
}

/**
 * Batch predict for multiple sensor readings
 */
export async function batchPredictSpoilage(
  readings: SensorDataInput[]
): Promise<MLPredictionResponse[]> {
  try {
    const predictions = await Promise.all(
      readings.map(reading => sendSensorDataToML(reading))
    );
    return predictions;
  } catch (error) {
    console.error('Error in batch prediction:', error);
    throw error;
  }
}

/**
 * Get prediction with fallback to mock data
 */
export async function getPredictionWithFallback(
  data: SensorDataInput
): Promise<MLPredictionResponse> {
  try {
    return await sendSensorDataToML(data);
  } catch (error) {
    console.warn('ML API unavailable, using fallback prediction');
    // Fallback logic based on simple rules
    return generateFallbackPrediction(data);
  }
}

function generateFallbackPrediction(data: SensorDataInput): MLPredictionResponse {
  const { temperature, humidity } = data;
  
  // Simple rule-based prediction
  let spoilage_risk = 0;
  
  if (temperature > 30 || temperature < 5) spoilage_risk += 40;
  if (humidity > 80 || humidity < 30) spoilage_risk += 30;
  if (temperature > 35) spoilage_risk += 20;
  if (humidity > 90) spoilage_risk += 10;
  
  spoilage_risk = Math.min(100, spoilage_risk);
  
  let recommendations = '';
  if (spoilage_risk > 70) {
    recommendations = 'Critical: Immediate action required. Adjust storage conditions immediately.';
  } else if (spoilage_risk > 40) {
    recommendations = 'Warning: Monitor closely. Consider adjusting temperature/humidity.';
  } else {
    recommendations = 'Optimal: Current conditions are good for storage.';
  }
  
  return {
    prediction: spoilage_risk,
    spoilage_risk,
    status: 'fallback',
    timestamp: new Date().toISOString(),
    recommendations,
  };
}
