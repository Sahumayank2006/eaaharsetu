// Utility functions for handling sensor data
import fs from 'fs';
import path from 'path';

export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  warehouse_id: string;
}

export interface SensorStats {
  avgTemperature: number;
  avgHumidity: number;
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
  totalReadings: number;
  lastReading: SensorReading | null;
}

/**
 * Parse CSV data string into sensor readings
 * Expected CSV format: timestamp,temperature,humidity,warehouse_id
 */
export function parseSensorCSV(csvData: string): SensorReading[] {
  const lines = csvData.trim().split('\n');
  const readings: SensorReading[] = [];
  
  // Skip header row (assuming first line is header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [timestamp, temperature, humidity, warehouse_id] = line.split(',');
    
    if (timestamp && temperature && humidity) {
      readings.push({
        timestamp: timestamp.trim(),
        temperature: parseFloat(temperature.trim()),
        humidity: parseFloat(humidity.trim()),
        warehouse_id: warehouse_id?.trim() || 'W01'
      });
    }
  }
  
  return readings;
}

/**
 * Calculate statistics from sensor readings
 */
export function calculateSensorStats(readings: SensorReading[]): SensorStats {
  if (readings.length === 0) {
    return {
      avgTemperature: 0,
      avgHumidity: 0,
      minTemperature: 0,
      maxTemperature: 0,
      minHumidity: 0,
      maxHumidity: 0,
      totalReadings: 0,
      lastReading: null
    };
  }

  const temperatures = readings.map(r => r.temperature);
  const humidities = readings.map(r => r.humidity);
  
  // Sort readings by timestamp to get the latest
  const sortedReadings = [...readings].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    avgTemperature: parseFloat((temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(1)),
    avgHumidity: parseFloat((humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length).toFixed(1)),
    minTemperature: Math.min(...temperatures),
    maxTemperature: Math.max(...temperatures),
    minHumidity: Math.min(...humidities),
    maxHumidity: Math.max(...humidities),
    totalReadings: readings.length,
    lastReading: sortedReadings[0] || null
  };
}

/**
 * Read sensor data from CSV file
 * This will be used server-side to read your IoT CSV file
 */
export async function readSensorDataFromFile(filePath: string): Promise<SensorReading[]> {
  try {
    // For development, return sample data if file doesn't exist
    if (!fs.existsSync(filePath)) {
      console.warn(`Sensor data file not found at ${filePath}, using sample data`);
      return generateSampleSensorData();
    }
    
    const csvData = fs.readFileSync(filePath, 'utf-8');
    return parseSensorCSV(csvData);
  } catch (error) {
    console.error('Error reading sensor data file:', error);
    return generateSampleSensorData();
  }
}

/**
 * Generate sample sensor data for development/fallback with multiple warehouse IDs
 */
function generateSampleSensorData(): SensorReading[] {
  const now = new Date();
  const readings: SensorReading[] = [];
  
  // Available warehouse IDs 
  const warehouseIds = ['W01', 'W02', 'W03', 'W04', 'W05'];
  
  // Generate data for each warehouse
  warehouseIds.forEach(warehouseId => {
    // Temperature baseline varies per warehouse for demo purposes
    const tempBaseline = warehouseId === 'W01' ? 19 : 
                        warehouseId === 'W02' ? 17 : 
                        warehouseId === 'W03' ? 21 :
                        warehouseId === 'W04' ? 24 : 18;
    
    // Humidity baseline varies per warehouse for demo purposes  
    const humidityBaseline = warehouseId === 'W01' ? 60 : 
                            warehouseId === 'W02' ? 45 : 
                            warehouseId === 'W03' ? 70 :
                            warehouseId === 'W04' ? 50 : 55;
    
    // Generate 24 hours of sample data (every 30 minutes)
    for (let i = 0; i < 48; i++) {
      const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000));
      
      // Add some randomness and a daily cycle pattern
      const hourFactor = Math.sin((timestamp.getHours() / 24) * Math.PI * 2);
      const tempCycle = 2 * hourFactor; // +/- 2°C daily cycle
      const humidityCycle = -5 * hourFactor; // +/- 5% inverse cycle
      
      readings.push({
        timestamp: timestamp.toISOString(),
        temperature: parseFloat((tempBaseline + tempCycle + Math.random() * 2).toFixed(1)),
        humidity: parseFloat((humidityBaseline + humidityCycle + Math.random() * 10).toFixed(1)),
        warehouse_id: warehouseId
      });
    }
  });
  
  return readings.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ); // Return in chronological order
}

/**
 * Format sensor data for charts (last 12 hours)
 */
export function formatSensorDataForChart(
  readings: SensorReading[], 
  hours: number = 12,
  maxPoints: number = 500
): Array<{
  time: string;
  temperature: number;
  humidity: number;
}> {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - (hours * 60 * 60 * 1000));

  // Filter to the requested time window
  const points = readings
    .filter(reading => new Date(reading.timestamp) >= cutoffTime)
    .map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperature: reading.temperature,
      humidity: reading.humidity
    }));

  // If there are too many points, downsample evenly to ~maxPoints
  if (points.length > maxPoints) {
    const step = Math.ceil(points.length / maxPoints);
    const sampled: typeof points = [];
    for (let i = 0; i < points.length; i += step) {
      sampled.push(points[i]);
    }
    // Ensure the last point is included for the most recent reading
    if (sampled[sampled.length - 1] !== points[points.length - 1]) {
      sampled.push(points[points.length - 1]);
    }
    return sampled;
  }

  return points;
}