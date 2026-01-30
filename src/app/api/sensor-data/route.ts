import { NextResponse } from 'next/server';
import { readSensorDataFromFile, calculateSensorStats, formatSensorDataForChart } from '@/lib/sensor-data';
import path from 'path';

// Path to your IoT sensor CSV file, now from an environment variable
const SENSOR_DATA_PATH = process.env.SENSOR_DATA_PATH || 'c:\\Users\\Parikshit\\Desktop\\PyGames\\IOT\\SensorData\\W01.csv';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const warehouseId = searchParams.get('warehouse_id') || 'W01';
    
    // Read sensor data from CSV file
    const sensorReadings = await readSensorDataFromFile(SENSOR_DATA_PATH);
    
    // Filter readings by warehouse ID if specified
    const filteredReadings = sensorReadings.filter(reading => 
      reading.warehouse_id === warehouseId
    );
    
    switch (type) {
      case 'stats':
        // Return calculated statistics
        const stats = calculateSensorStats(filteredReadings);
        return NextResponse.json({
          success: true,
          data: stats,
          warehouseId,
          timestamp: new Date().toISOString()
        });
      
      case 'chart':
        // Return formatted data for charts
        const hours = parseInt(searchParams.get('hours') || '12');
        const chartData = formatSensorDataForChart(filteredReadings, hours);
        return NextResponse.json({
          success: true,
          data: chartData,
          warehouseId,
          timestamp: new Date().toISOString()
        });
      
      case 'raw':
        // Return raw sensor readings (limited to last 100 for performance)
        const limit = parseInt(searchParams.get('limit') || '100');
        const rawData = filteredReadings.slice(-limit);
        return NextResponse.json({
          success: true,
          data: rawData,
          warehouseId,
          timestamp: new Date().toISOString()
        });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: stats, chart, or raw'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in sensor data API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read sensor data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
