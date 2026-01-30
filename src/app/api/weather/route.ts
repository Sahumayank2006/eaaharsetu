
import { NextResponse } from 'next/server';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  condition: string;
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

const cityToCoords: { [key: string]: { lat: number; lon: number } } = {
  'W01': { lat: 26.2183, lon: 78.1828 }, // Gwalior
  'W02': { lat: 26.65, lon: 77.99 }, // Morena
  'W03': { lat: 26.54, lon: 78.78 }, // Bhind
  'W04': { lat: 25.43, lon: 77.61 }, // Shivpuri
  'W05': { lat: 25.68, lon: 78.46 }, // Datia
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const warehouseId = searchParams.get('warehouseId') || 'W01';
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return NextResponse.json(
      { error: 'OpenWeatherMap API key is not configured. Please add it to your .env file.' },
      { status: 500 }
    );
  }

  const coords = cityToCoords[warehouseId];
  if (!coords) {
    return NextResponse.json({ error: 'Invalid warehouse ID' }, { status: 400 });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch weather data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const formattedData: WeatherData = {
      location: data.timezone.split('/')[1].replace('_', ' '),
      temperature: data.current.temp,
      humidity: data.current.humidity,
      condition: data.current.weather[0].main,
      icon: data.current.weather[0].icon,
      forecast: data.daily.slice(1, 4).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        temperature: {
          min: day.temp.min,
          max: day.temp.max,
        },
        humidity: day.humidity,
        condition: day.weather[0].main,
        icon: day.weather[0].icon,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data from OpenWeatherMap' },
      { status: 500 }
    );
  }
}
