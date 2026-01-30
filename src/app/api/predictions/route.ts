// Mock API for product lifetime prediction
import { NextResponse } from 'next/server';
import {
  SAMPLE_STORAGE_ITEMS,
  SAMPLE_WEATHER_DATA,
  predictShelfLifeImpact,
  generateAlerts
} from '@/lib/warehouse-predictions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId') || 'W01';
    
    // Get temperature and humidity from query params or use default from weather data
    const weatherData = SAMPLE_WEATHER_DATA[warehouseId] || SAMPLE_WEATHER_DATA.W01;
    const temperature = parseFloat(searchParams.get('temperature') || `${weatherData.temperature}`);
    const humidity = parseFloat(searchParams.get('humidity') || `${weatherData.humidity}`);

    // Filter storage items for the requested warehouse
    // In a real app, this would come from a database
    const storageItems = SAMPLE_STORAGE_ITEMS.slice(0, 4); // Just use a few items for the mock
    
    // Generate predictions
    const predictions = storageItems.map(item => 
      predictShelfLifeImpact(
        item,
        temperature,
        humidity,
        weatherData.forecast
      )
    );
    
    // Generate alerts based on conditions
    const alerts = generateAlerts(warehouseId, temperature, humidity, predictions);
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      warehouseId,
      temperature,
      humidity,
      predictions,
      alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating predictions:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}