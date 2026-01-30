"use client";

import { Droplets, Thermometer, AlertTriangle, CloudRain, Cloud, Sun, Snowflake, CloudFog, CloudSun } from "lucide-react";
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
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <Sun className="h-6 w-6 text-yellow-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <Snowflake className="h-6 w-6 text-blue-300" />;
    } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
      return <CloudFog className="h-6 w-6 text-gray-400" />;
    }
    return <CloudSun className="h-6 w-6 text-yellow-400" />; // Default
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
    <Card className={`border-0 shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              Local Weather
            </CardTitle>
            <CardDescription className="mt-2">
              {isLoading ? (
                <Skeleton className="h-4 w-32 mt-1 rounded-lg" />
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
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500 rounded-xl bg-red-50 dark:bg-red-950/30">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Unable to load weather data
          </div>
        ) : (
          weatherData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/20">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Thermometer className={`h-6 w-6 ${getTempColor(weatherData.temperature)}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className={`text-2xl font-bold ${getTempColor(weatherData.temperature)}`}>
                      {weatherData.temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Droplets className={`h-6 w-6 ${getHumidityColor(weatherData.humidity)}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className={`text-2xl font-bold ${getHumidityColor(weatherData.humidity)}`}>
                      {weatherData.humidity.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Condition</p>
                <Badge variant="secondary" className="text-sm rounded-lg">
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
                      <div key={index} className="text-center p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
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
