// Types for weather and predictions
export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  condition: string; // sunny, rainy, cloudy, etc.
  icon: string;
  forecast: {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    humidity: number;
    condition: string;
    icon: string;
  }[];
}

export interface StorageItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  storageDate: string;
  expiryDate: string;
  optimalConditions: {
    temperature: {
      min: number;
      max: number;
    };
    humidity: {
      min: number;
      max: number;
    };
  };
}

export interface AlertInfo {
  type: 'temperature' | 'humidity' | 'spoilage' | 'weather' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  warehouseId: string;
  affectedItems?: string[];
  suggestedAction?: string;
  acknowledged?: boolean;
}

export interface SpoilagePrediction {
  itemId: string;
  itemName: string;
  category: string;
  currentShelfLife: number; // Days remaining
  originalShelfLife: number; // Original expected days
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedByTemperature: boolean;
  affectedByHumidity: boolean;
  affectedByWeather: boolean;
  recommendation: string;
}

// Constants for storage condition thresholds
export const STORAGE_CONDITIONS = {
  GRAINS: {
    temperature: { min: 10, max: 25 },
    humidity: { min: 35, max: 60 },
    baseShelfLife: 180 // days in optimal conditions
  },
  // Kept for type safety but not used in new mock data
  VEGETABLES: {
    temperature: { min: 4, max: 10 },
    humidity: { min: 80, max: 95 },
    baseShelfLife: 14 // days in optimal conditions
  },
  FRUITS: {
    temperature: { min: 7, max: 12 },
    humidity: { min: 85, max: 95 },
    baseShelfLife: 21 // days in optimal conditions
  },
  DAIRY: {
    temperature: { min: 1, max: 5 },
    humidity: { min: 70, max: 80 },
    baseShelfLife: 10 // days in optimal conditions
  }
};

/**
 * Calculates risk level based on current conditions compared to optimal
 */
export function calculateRiskLevel(
  currentTemp: number,
  currentHumidity: number,
  optimal: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
  }
): 'low' | 'medium' | 'high' | 'critical' {
  // Temperature deviation calculation
  const tempRange = optimal.temperature.max - optimal.temperature.min;
  const tempDeviation = Math.max(
    0,
    optimal.temperature.min - currentTemp,
    currentTemp - optimal.temperature.max
  );
  const tempDeviationPercent = (tempDeviation / tempRange) * 100;

  // Humidity deviation calculation
  const humidityRange = optimal.humidity.max - optimal.humidity.min;
  const humidityDeviation = Math.max(
    0,
    optimal.humidity.min - currentHumidity,
    currentHumidity - optimal.humidity.max
  );
  const humidityDeviationPercent = (humidityDeviation / humidityRange) * 100;

  // Combined risk calculation
  const combinedRisk = (tempDeviationPercent + humidityDeviationPercent) / 2;

  if (combinedRisk < 10) return 'low';
  if (combinedRisk < 30) return 'medium';
  if (combinedRisk < 50) return 'high';
  return 'critical';
}

/**
 * Predicts shelf life impact based on current conditions
 */
export function predictShelfLifeImpact(
  item: StorageItem,
  currentTemp: number,
  currentHumidity: number,
  weatherForecast: WeatherData['forecast']
): SpoilagePrediction {
  // Get base shelf life for category
  const categoryData = STORAGE_CONDITIONS[item.category as keyof typeof STORAGE_CONDITIONS] || 
                      STORAGE_CONDITIONS.GRAINS; // Default to grains
  
  // Calculate days since storage
  const storageDate = new Date(item.storageDate);
  const today = new Date();
  const daysSinceStorage = Math.round((today.getTime() - storageDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Base shelf life from the category
  const baseShelfLife = categoryData.baseShelfLife;
  
  // Calculate condition factors
  const tempFactor = getTemperatureImpactFactor(currentTemp, item.optimalConditions.temperature);
  const humidityFactor = getHumidityImpactFactor(currentHumidity, item.optimalConditions.humidity);
  
  // Weather impact calculation (simplified - would be more complex in real system)
  const weatherImpact = calculateWeatherImpact(weatherForecast);
  
  // Final shelf life calculation with all factors
  const remainingLifePercent = Math.max(0, 100 - (daysSinceStorage / baseShelfLife * 100));
  const adjustedLifePercent = remainingLifePercent * tempFactor * humidityFactor * weatherImpact;
  
  // Convert percent to days
  const remainingDays = Math.round((adjustedLifePercent / 100) * baseShelfLife);
  
  // Risk level based on current conditions
  const riskLevel = calculateRiskLevel(
    currentTemp,
    currentHumidity,
    item.optimalConditions
  );
  
  // Create recommendation based on factors
  const recommendation = generateRecommendation(
    item.category,
    riskLevel,
    remainingDays,
    tempFactor < 0.9,
    humidityFactor < 0.9,
    weatherImpact < 0.9
  );
  
  return {
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    currentShelfLife: remainingDays,
    originalShelfLife: baseShelfLife,
    riskLevel,
    affectedByTemperature: tempFactor < 0.9,
    affectedByHumidity: humidityFactor < 0.9,
    affectedByWeather: weatherImpact < 0.9,
    recommendation
  };
}

// Helper functions
function getTemperatureImpactFactor(
  current: number,
  optimal: { min: number; max: number }
): number {
  if (current >= optimal.min && current <= optimal.max) {
    return 1.0; // No negative impact
  }
  
  // How far outside optimal range
  const deviation = current < optimal.min ? optimal.min - current : current - optimal.max;
  const range = optimal.max - optimal.min;
  
  // Each degree outside range reduces shelf life by up to 20%
  return Math.max(0.4, 1 - (deviation / range) * 0.2);
}

function getHumidityImpactFactor(
  current: number,
  optimal: { min: number; max: number }
): number {
  if (current >= optimal.min && current <= optimal.max) {
    return 1.0; // No negative impact
  }
  
  // How far outside optimal range
  const deviation = current < optimal.min ? optimal.min - current : current - optimal.max;
  const range = optimal.max - optimal.min;
  
  // Each percentage point outside range reduces shelf life by up to 15%
  return Math.max(0.5, 1 - (deviation / range) * 0.15);
}

function calculateWeatherImpact(forecast: WeatherData['forecast']): number {
  // Just check the next 3 days in forecast
  const nextDays = forecast.slice(0, 3);
  
  // Check for extreme temperature swings
  const tempSwings = nextDays.some(day => {
    return day.temperature.max - day.temperature.min > 15;
  });
  
  // Check for rain/humidity spikes
  const humidityIssues = nextDays.some(day => {
    return day.humidity > 85 || day.condition.toLowerCase().includes('rain');
  });
  
  // Return impact factor
  if (tempSwings && humidityIssues) return 0.8; // Both issues
  if (tempSwings || humidityIssues) return 0.9; // One issue
  return 1.0; // No weather impact
}

function generateRecommendation(
  category: string,
  risk: 'low' | 'medium' | 'high' | 'critical',
  daysRemaining: number,
  tempIssue: boolean,
  humidityIssue: boolean,
  weatherIssue: boolean
): string {
  if (risk === 'low') {
    return `Storage conditions are optimal. Expected shelf life: ${daysRemaining} days.`;
  }
  
  if (risk === 'medium') {
    const issue = tempIssue ? 'temperature' : humidityIssue ? 'humidity' : 'weather forecast';
    return `Monitor ${issue} closely. Consider adjusting storage conditions to extend shelf life beyond ${daysRemaining} days.`;
  }
  
  if (risk === 'high') {
    let recommendation = `Urgent: `;
    if (tempIssue) recommendation += `Temperature is outside optimal range. `;
    if (humidityIssue) recommendation += `Humidity is outside optimal range. `;
    if (weatherIssue) recommendation += `Upcoming weather may affect storage conditions. `;
    recommendation += `Consider relocating or processing within ${daysRemaining} days.`;
    return recommendation;
  }
  
  // Critical
  return `CRITICAL: Storage conditions are severely compromised. ${category} may spoil within ${daysRemaining} days. Immediate action required.`;
}

/**
 * Generates alerts based on current conditions and predictions
 */
export function generateAlerts(
  warehouseId: string,
  currentTemp: number,
  currentHumidity: number,
  predictions: SpoilagePrediction[]
): AlertInfo[] {
  const alerts: AlertInfo[] = [];
  const now = new Date().toISOString();
  
  // Temperature alert
  if (currentTemp > 30 || currentTemp < 0) {
    alerts.push({
      type: 'temperature',
      severity: currentTemp > 35 || currentTemp < -5 ? 'critical' : 'high',
      title: `Extreme Temperature Detected`,
      message: `Warehouse ${warehouseId} temperature at ${currentTemp}°C is outside safe range.`,
      timestamp: now,
      warehouseId,
      suggestedAction: `Check cooling/heating system immediately.`
    });
  } else if (currentTemp > 25 || currentTemp < 5) {
    alerts.push({
      type: 'temperature',
      severity: 'medium',
      title: `Temperature Alert`,
      message: `Warehouse ${warehouseId} temperature at ${currentTemp}°C is suboptimal.`,
      timestamp: now,
      warehouseId,
      suggestedAction: `Monitor cooling/heating system.`
    });
  }
  
  // Humidity alert
  if (currentHumidity > 90 || currentHumidity < 20) {
    alerts.push({
      type: 'humidity',
      severity: currentHumidity > 95 || currentHumidity < 15 ? 'critical' : 'high',
      title: `Extreme Humidity Detected`,
      message: `Warehouse ${warehouseId} humidity at ${currentHumidity}% is outside safe range.`,
      timestamp: now,
      warehouseId,
      suggestedAction: `Check dehumidifier/humidifier system immediately.`
    });
  } else if (currentHumidity > 80 || currentHumidity < 30) {
    alerts.push({
      type: 'humidity',
      severity: 'medium',
      title: `Humidity Alert`,
      message: `Warehouse ${warehouseId} humidity at ${currentHumidity}% is suboptimal.`,
      timestamp: now,
      warehouseId,
      suggestedAction: `Monitor humidity control system.`
    });
  }
  
  // Spoilage alerts from predictions
  const criticalItems = predictions.filter(p => p.riskLevel === 'critical');
  const highRiskItems = predictions.filter(p => p.riskLevel === 'high');
  
  if (criticalItems.length > 0) {
    alerts.push({
      type: 'spoilage',
      severity: 'critical',
      title: `Critical Spoilage Risk`,
      message: `${criticalItems.length} items at critical spoilage risk in warehouse ${warehouseId}.`,
      timestamp: now,
      warehouseId,
      affectedItems: criticalItems.map(item => item.itemName),
      suggestedAction: `Immediate action required - prioritize for dispatch or processing.`
    });
  }
  
  if (highRiskItems.length > 0) {
    alerts.push({
      type: 'spoilage',
      severity: 'high',
      title: `High Spoilage Risk`,
      message: `${highRiskItems.length} items at high spoilage risk in warehouse ${warehouseId}.`,
      timestamp: now,
      warehouseId,
      affectedItems: highRiskItems.map(item => item.itemName),
      suggestedAction: `Consider expediting dispatch or improving storage conditions.`
    });
  }
  
  return alerts;
}

/**
 * Sample storage items for testing predictions
 */
export const SAMPLE_STORAGE_ITEMS: StorageItem[] = [
  {
    id: 'grain-001',
    name: 'Wheat',
    category: 'GRAINS',
    quantity: 5000,
    unit: 'kg',
    storageDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(), // 150 days from now
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 35, max: 60 }
    }
  },
  {
    id: 'grain-002',
    name: 'Rice',
    category: 'GRAINS',
    quantity: 8000,
    unit: 'kg',
    storageDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 35, max: 60 }
    }
  },
  {
    id: 'grain-003',
    name: 'Maize',
    category: 'GRAINS',
    quantity: 4000,
    unit: 'kg',
    storageDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
    optimalConditions: {
      temperature: { min: 10, max: 25 },
      humidity: { min: 40, max: 65 }
    }
  }
];

/**
 * Sample weather data for testing
 */
export const SAMPLE_WEATHER_DATA: Record<string, WeatherData> = {
  'W01': {
    location: 'Gwalior, MP',
    temperature: 32,
    humidity: 65,
    condition: 'Sunny',
    icon: 'sun',
    forecast: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 28, max: 35 },
        humidity: 70,
        condition: 'Sunny',
        icon: 'sun'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 27, max: 34 },
        humidity: 75,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 26, max: 33 },
        humidity: 80,
        condition: 'Rain',
        icon: 'cloud-rain'
      }
    ]
  },
  'W02': {
    location: 'Morena, MP',
    temperature: 29,
    humidity: 85,
    condition: 'Rainy',
    icon: 'cloud-rain',
    forecast: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 26, max: 30 },
        humidity: 90,
        condition: 'Heavy Rain',
        icon: 'cloud-rain'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 25, max: 29 },
        humidity: 88,
        condition: 'Light Rain',
        icon: 'cloud-drizzle'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 26, max: 30 },
        humidity: 85,
        condition: 'Cloudy',
        icon: 'cloud'
      }
    ]
  },
  'W03': {
    location: 'Bhind, MP',
    temperature: 24,
    humidity: 60,
    condition: 'Cloudy',
    icon: 'cloud',
    forecast: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 22, max: 26 },
        humidity: 65,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 21, max: 27 },
        humidity: 60,
        condition: 'Sunny',
        icon: 'sun'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 20, max: 25 },
        humidity: 70,
        condition: 'Light Rain',
        icon: 'cloud-drizzle'
      }
    ]
  },
  'W04': {
    location: 'Shivpuri, MP',
    temperature: 31,
    humidity: 75,
    condition: 'Humid',
    icon: 'droplets',
    forecast: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 28, max: 33 },
        humidity: 80,
        condition: 'Humid',
        icon: 'droplets'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 27, max: 32 },
        humidity: 78,
        condition: 'Humid',
        icon: 'droplets'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 28, max: 34 },
        humidity: 75,
        condition: 'Sunny',
        icon: 'sun'
      }
    ]
  },
  'W05': {
    location: 'Datia, MP',
    temperature: 30,
    humidity: 80,
    condition: 'Overcast',
    icon: 'cloud',
    forecast: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 27, max: 32 },
        humidity: 85,
        condition: 'Rain',
        icon: 'cloud-rain'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 26, max: 31 },
        humidity: 83,
        condition: 'Heavy Rain',
        icon: 'cloud-rain'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: { min: 27, max: 30 },
        humidity: 80,
        condition: 'Cloudy',
        icon: 'cloud'
      }
    ]
  }
};
