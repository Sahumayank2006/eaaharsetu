import { NextResponse } from 'next/server';
import { adafruitIOService, type WarehouseSensorData, type AdafruitDataPoint, type DeviceStatus } from '@/lib/adafruit-io';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const warehouseId = searchParams.get('warehouse_id') || 'W01';

    // For now, we only support W01 warehouse with Adafruit IO
    if (warehouseId !== 'W01') {
      return NextResponse.json({
        success: false,
        error: 'Only warehouse W01 is currently supported with Adafruit IO integration'
      }, { status: 400 });
    }

    switch (type) {
      case 'stats':
        // Return calculated statistics from Adafruit IO
        try {
          const data: WarehouseSensorData = await adafruitIOService.getAllWarehouseData();

          // Calculate additional stats for compatibility
          const stats = {
            avgTemperature: data.current.temperature,
            avgHumidity: data.current.humidity,
            minTemperature: data.extremes.temperature.min,
            maxTemperature: data.extremes.temperature.max,
            minHumidity: data.extremes.humidity.min,
            maxHumidity: data.extremes.humidity.max,
            totalReadings: 1, // Adafruit IO gives us current values
            lastReading: {
              timestamp: data.current.timestamp,
              temperature: data.current.temperature,
              humidity: data.current.humidity,
              warehouse_id: warehouseId
            }
          };

          return NextResponse.json({
            success: true,
            data: stats,
            warehouseId,
            source: 'adafruit-io',
            timestamp: new Date().toISOString()
          });
        } catch (adafruitError) {
          console.error('Adafruit IO error:', adafruitError);
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch data from Adafruit IO',
            details: adafruitError instanceof Error ? adafruitError.message : 'Unknown error'
          }, { status: 503 });
        }

      case 'chart':
        // Return formatted data for charts from Adafruit IO
        try {
          const hours = parseInt(searchParams.get('hours') || '12');

          // Get historical data for both temperature and humidity
          const [tempData, humData] = await Promise.all([
            adafruitIOService.getHistoricalData('temperature', hours),
            adafruitIOService.getHistoricalData('humidity', hours)
          ]);

          // Format for chart (combine and sort by time)
          // Sort by timestamp ascending (oldest first) for left-to-right display
          const sortedTempData = tempData.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const chartData = sortedTempData.map(tempPoint => {
            const humPoint = humData.find(h => h.timestamp === tempPoint.timestamp);
            return {
              time: new Date(tempPoint.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              timestamp: tempPoint.timestamp, // Keep full timestamp for debugging
              temperature: Number.isFinite(tempPoint.value) ? tempPoint.value : null,
              humidity: humPoint && Number.isFinite(humPoint.value) ? humPoint.value : null
            };
          });

          return NextResponse.json({
            success: true,
            data: chartData,
            warehouseId,
            source: 'adafruit-io',
            timestamp: new Date().toISOString()
          });
        } catch (adafruitError) {
          console.error('Adafruit IO chart error:', adafruitError);
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch chart data from Adafruit IO'
          }, { status: 503 });
        }

      case 'raw':
        // Return raw sensor readings from Adafruit IO
        try {
          const limit = parseInt(searchParams.get('limit') || '100');
          const hours = 24; // Get last 24 hours of data

          const [tempData, humData] = await Promise.all([
            adafruitIOService.getHistoricalData('temperature', hours),
            adafruitIOService.getHistoricalData('humidity', hours)
          ]);

          // Combine temperature and humidity readings
          const rawData: any[] = [];
          tempData.slice(0, limit).forEach(tempPoint => {
            const humPoint = humData.find(h => h.timestamp === tempPoint.timestamp);
            rawData.push({
              timestamp: tempPoint.timestamp,
              temperature: tempPoint.value,
              humidity: humPoint ? humPoint.value : null,
              warehouse_id: warehouseId
            });
          });

          return NextResponse.json({
            success: true,
            data: rawData,
            warehouseId,
            source: 'adafruit-io',
            timestamp: new Date().toISOString()
          });
        } catch (adafruitError) {
          console.error('Adafruit IO raw data error:', adafruitError);
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch raw data from Adafruit IO'
          }, { status: 503 });
        }

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
      error: 'Failed to process sensor data request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
