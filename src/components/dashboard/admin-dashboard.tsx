"use client";

import { 
  Activity, 
  IndianRupee, 
  Users, 
  Bell, 
  AlertTriangle, 
  Thermometer, 
  Droplets,
  MapPin,
  Carrot,
  HeartHandshake,
  Building2,
  CloudRain,
  Cloud,
  Sun,
  Snowflake,
  CloudSun,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { WarehouseMap } from "./warehouse-map";
import "leaflet/dist/leaflet.css";

// Weather condition icon mapping function
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition?.toLowerCase() || '';
  
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
    return <CloudRain className="h-5 w-5 text-blue-500" />;
  } else if (lowerCondition.includes('cloud')) {
    return <Cloud className="h-5 w-5 text-gray-500" />;
  } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return <Sun className="h-5 w-5 text-yellow-500" />;
  } else if (lowerCondition.includes('snow')) {
    return <Snowflake className="h-5 w-5 text-blue-300" />;
  }
  return <CloudSun className="h-5 w-5 text-yellow-400" />;
};

// Modern stat card component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  iconColor,
  gradientFrom,
  gradientTo 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-xl ${iconColor} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${iconColor.replace('bg-', 'text-')}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
          ) : changeType === 'negative' ? (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          ) : null}
          <p className={`text-xs font-medium ${
            changeType === 'positive' ? 'text-emerald-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const [temperature, setTemperature] = useState(24.5);
  const [humidity, setHumidity] = useState(65);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const warehouseId = "warehouse-1";
  
  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather?warehouseId=' + warehouseId);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setWeatherLoading(false);
      }
    };
    
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [warehouseId]);

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Platform performance and key metrics at a glance
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₹4,52,31,890"
          change="+20.1% from last month"
          changeType="positive"
          icon={IndianRupee}
          iconColor="bg-emerald-500"
          gradientFrom="from-emerald-500"
          gradientTo="to-teal-500"
        />
        <StatCard
          title="Active Users"
          value="+2,350"
          change="+180.1% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
          gradientFrom="from-blue-500"
          gradientTo="to-cyan-500"
        />
        <StatCard
          title="Total Surplus Listed"
          value="+12,234 Tons"
          change="+19% from last month"
          changeType="positive"
          icon={Carrot}
          iconColor="bg-orange-500"
          gradientFrom="from-orange-500"
          gradientTo="to-amber-500"
        />
        <StatCard
          title="Donations Facilitated"
          value="+573 Tons"
          change="+201 since last hour"
          changeType="positive"
          icon={HeartHandshake}
          iconColor="bg-pink-500"
          gradientFrom="from-pink-500"
          gradientTo="to-rose-500"
        />
      </div>

      {/* Warehouse Map Section */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Warehouse Network Overview</CardTitle>
              <CardDescription>
                Real-time monitoring of warehouses across Gwalior region
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <WarehouseMap />
        </CardContent>
      </Card>

      {/* Environmental Monitoring & Alerts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Warehouse Conditions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Warehouse Conditions</CardTitle>
            <div className="flex gap-2">
              <div className="p-1.5 rounded-lg bg-red-100">
                <Thermometer className="h-4 w-4 text-red-500" />
              </div>
              <div className="p-1.5 rounded-lg bg-blue-100">
                <Droplets className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                <p className="text-xs font-medium text-red-600/70 uppercase tracking-wider">Temperature</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{temperature}°C</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-600/70 uppercase tracking-wider">Humidity</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{humidity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weather Forecast */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Weather Forecast</CardTitle>
            {weatherData?.condition && getWeatherIcon(weatherData.condition)}
          </CardHeader>
          <CardContent>
            {weatherLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : weatherData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Condition</p>
                    <p className="text-sm font-semibold">{weatherData.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">Outside Temp</p>
                    <p className="text-sm font-semibold">{weatherData.temperature}°C</p>
                  </div>
                </div>
                
                {weatherData.forecast && weatherData.forecast.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {weatherData.forecast.slice(0, 3).map((day: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-muted/30 text-center">
                        <div className="text-xs font-medium text-muted-foreground">
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </div>
                        <div className="flex justify-center my-1.5">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div className="text-xs font-semibold">
                          {Math.round(day.temperature.min)}-{Math.round(day.temperature.max)}°
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                Weather data unavailable
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Warehouse Alerts */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Warehouse Alerts</CardTitle>
            <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
              3 New
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-xl border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent">
              <div className="font-medium text-red-800 text-sm">Critical Temperature Alert</div>
              <p className="text-xs mt-0.5 text-red-600/80">Temperature exceeds safe storage limits</p>
            </div>
            <div className="p-3 rounded-xl border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-transparent">
              <div className="font-medium text-amber-800 text-sm">Humidity Warning</div>
              <p className="text-xs mt-0.5 text-amber-600/80">Humidity levels above recommended range</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Shelf Life Section */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Product Shelf Life Monitor</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Tomatoes - Critical */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-red-50/50 to-white">
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold">Tomatoes</div>
                <Badge variant="destructive" className="rounded-full">Critical</Badge>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Shelf life remaining</span>
                <span className="text-red-600 font-bold">2 days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-500" style={{ width: '15%' }} />
              </div>
            </div>
            
            {/* Potatoes - Medium */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-amber-50/50 to-white">
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold">Potatoes</div>
                <Badge variant="outline" className="rounded-full border-amber-300 text-amber-700 bg-amber-50">Medium</Badge>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Shelf life remaining</span>
                <span className="text-amber-600 font-bold">14 days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }} />
              </div>
            </div>
            
            {/* Onions - Low */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-emerald-50/50 to-white">
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold">Onions</div>
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Low Risk</Badge>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Shelf life remaining</span>
                <span className="text-emerald-600 font-bold">28 days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
