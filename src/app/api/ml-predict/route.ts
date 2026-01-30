import { NextRequest, NextResponse } from 'next/server';
import { sendSensorDataToML, getPredictionWithFallback } from '@/lib/ml-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temperature, humidity, warehouse_id, crop_type, use_fallback } = body;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: 'Temperature and humidity are required' },
        { status: 400 }
      );
    }

    // Choose prediction method based on use_fallback flag
    const prediction = use_fallback 
      ? await getPredictionWithFallback({ temperature, humidity, warehouse_id, crop_type })
      : await sendSensorDataToML({ temperature, humidity, warehouse_id, crop_type });

    return NextResponse.json({
      success: true,
      data: prediction,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML Prediction API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get ML prediction',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ML Prediction API is running',
    endpoint: '/api/ml-predict',
    methods: ['POST'],
    example: {
      temperature: 30,
      humidity: 70,
      warehouse_id: 'W01',
      crop_type: 'wheat',
      use_fallback: false
    }
  });
}
