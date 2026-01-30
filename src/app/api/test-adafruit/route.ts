import { NextResponse } from 'next/server';
import { adafruitIOService } from '@/lib/adafruit-io';

export async function GET() {
  try {
    // Test Adafruit IO connection by getting latest temperature
    const temperature = await adafruitIOService.getLatestData('temperature');
    const deviceStatus = await adafruitIOService.getDeviceStatus();

    return NextResponse.json({
      success: true,
      message: 'Adafruit IO connection successful',
      data: {
        temperature,
        deviceStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Adafruit IO test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Adafruit IO connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}