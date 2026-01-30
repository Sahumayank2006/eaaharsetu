"use client";

import { Droplets, Thermometer, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WeatherData } from "@/lib/warehouse-predictions";
import { useWarehouseWeather } from "@/hooks/use-warehouse-weather";
import { Skeleton } from "@/components/ui/skeleton";

interface WarehouseWeatherCardProps {
  warehouseId: string;
  className?: string;
}

export function WarehouseWeatherCard({ warehouseId, className = "" }: WarehouseWeatherCardProps) {
  const { weatherData, isLoading, error } = useWarehouseWeather(warehouseId);
  
  // Weather condition icon mapping
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition?.toLowerCase() || '';
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return '🌧️';
    } else if (lowerCondition.includes('cloud')) {
      return '☁️';
    } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return '☀️';
    } else if (lowerCondition.includes('snow')) {
      return '❄️';
    } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
      return '🌫️';
    }
    return '🌤️'; // Default
  };
  
  // Temperature color
  const getTempColor = (temp: number) => {
    if (temp > 30) return 'text-red-500';
    if (temp > 25) return 'text-orange-400';
    if (temp < 5) return 'text-blue-500';
    if (temp < 10) return 'text-blue-400';
    return 'text-green-500';
  };
  
  // Humidity color
  const getHumidityColor = (humidity: number) => {
    if (humidity > 80) return 'text-blue-500';
    if (humidity < 30) return 'text-orange-400';
    return 'text-green-500';
  };
  
  // Weather trend analysis
  const getWeatherTrend = (weather: WeatherData | null) => {
    if (!weather || !weather.forecast || !weather.forecast.length) return null;
    
    const today = weather.temperature;
    const tomorrow = weather.forecast[0]?.temperature.max;
    
    if (tomorrow && Math.abs(tomorrow - today) > 5) {
      return {
        direction: tomorrow > today ? 'warmer' : 'cooler',
        difference: Math.abs(tomorrow - today).toFixed(1)
      };
    }
    
    return null;
  };
  
  const weatherTrend = weatherData ? getWeatherTrend(weatherData) : null;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">Local Weather</CardTitle>
            <CardDescription>
              {isLoading ? (
                <Skeleton className="h-4 w-32 mt-1" />
              ) : error ? (
                <span className="text-red-500">Error loading weather</span>
              ) : (
                weatherData?.location || "Unknown location"
              )}
            </CardDescription>
          </div>
          
          {!isLoading && !error && weatherData && (
            <div className="text-4xl">
              {getWeatherIcon(weatherData.condition)}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Unable to load weather data
          </div>
        ) : (
          weatherData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Thermometer className={`h-8 w-8 ${getTempColor(weatherData.temperature)}`} />
                  <div className="ml-2">
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className={`text-2xl font-bold ${getTempColor(weatherData.temperature)}`}>
                      {weatherData.temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Droplets className={`h-8 w-8 ${getHumidityColor(weatherData.humidity)}`} />
                  <div className="ml-2">
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className={`text-2xl font-bold ${getHumidityColor(weatherData.humidity)}`}>
                      {weatherData.humidity.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Condition</p>
                <Badge variant="secondary" className="text-sm">
                  {weatherData.condition}
                </Badge>
                
                {weatherTrend && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Tomorrow: </span>
                    <span className={`${weatherTrend.direction === 'warmer' ? 'text-orange-500' : 'text-blue-500'}`}>
                      {weatherTrend.direction === 'warmer' ? '+' : '-'}{weatherTrend.difference}°C
                    </span>
                  </p>
                )}
              </div>
              
              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">3-Day Forecast</p>
                  <div className="grid grid-cols-3 gap-2">
                    {weatherData.forecast.slice(0, 3).map((day, index) => (
                      <div key={index} className="text-center p-1 rounded-md bg-secondary/20">
                        <p className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </p>
                        <div className="text-lg my-1">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <p className="text-xs font-medium">
                          {day.temperature.min.toFixed(0)}-{day.temperature.max.toFixed(0)}°C
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 mt-2">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
