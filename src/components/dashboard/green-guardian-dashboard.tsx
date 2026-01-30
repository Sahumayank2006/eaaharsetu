
"use client";

import {
  Package,
  Thermometer,
  Droplets,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Bell,
  Clock,
  ArrowRight,
  SatelliteDish,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useSensorData } from "@/hooks/use-sensor-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AdafruitGauges from "./adafruit-gauges";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-language-font";


// Removed dummy sensor data - now using real data from hook

const stockData = [
    { name: "Rice", in_stock: 3000, incoming: 1398, outgoing: 2210 },
    { name: "Wheat", in_stock: 4000, incoming: 2400, outgoing: 2400 },
    { name: "Maize", in_stock: 2000, incoming: 9800, outgoing: 2290 },
];


const sensorChartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
};

export default function GreenGuardianDashboard() {
  const { t } = useTranslation();
  // Fetch real sensor data with 30-second refresh interval
  const { stats, chartData, isLoading, error, refetch, source } = useSensorData(30000);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "green-guardian";
  const lang = searchParams.get("lang") || "en";
  const roleQuery = `?role=${role}&lang=${lang}`;

  const tailDot = (dataLen: number, cssVarColor: string) => (props: any) => {
    const { index, cx, cy } = props;
    const isTail = typeof index === 'number' && index >= Math.max(0, dataLen - 3);
    if (isTail) {
      return (
        <circle
          key={`${cssVarColor}-dot-${index}`}
          cx={cx}
          cy={cy}
          r={4}
          fill={`var(${cssVarColor})`}
          stroke="#ffffff"
          strokeWidth={1}
        />
      );
    }
    // Return an empty SVG group to satisfy type Checker (cannot return null)
    return <g key={`${cssVarColor}-empty-${index}`} />;
  };

  // Helper function to determine temperature status with rim animation
  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { 
      status: t('low', "Low"), 
      color: "text-blue-600",
      borderClass: "border-2 border-blue-500",
      rimClass: "rim-animation rim-animation-blue"
    };
    if (temp > 25) return { 
      status: t('high', "High"), 
      color: "text-red-600",
      borderClass: "border-2 border-red-500",
      rimClass: "rim-animation rim-animation-red"
    };
    return { 
      status: t('optimal', "Optimal"), 
      color: "text-green-600",
      borderClass: "border-2 border-green-500",
      rimClass: ""
    };
  };

  // Helper function to determine humidity status with rim animation
  const getHumidityStatus = (humidity: number) => {
    if (humidity < 45) return { 
      status: t('low', "Low"), 
      color: "text-amber-600",
      borderClass: "border-2 border-amber-500",
      rimClass: "rim-animation rim-animation-amber"
    };
    if (humidity > 75) return { 
      status: t('high', "High"), 
      color: "text-red-600",
      borderClass: "border-2 border-red-500",
      rimClass: "rim-animation rim-animation-red"
    };
    return { 
      status: t('stable', "Stable"), 
      color: "text-green-600",
      borderClass: "border-2 border-green-500",
      rimClass: ""
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('warehouse_dashboard', 'Warehouse Dashboard')}</h2>
          <p className="text-muted-foreground">
            {t('warehouse_dashboard_desc', 'Monitor warehouse conditions and manage inventory')}
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
          <Package className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {t('sensor_data_error', 'Failed to load sensor data')}: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 mt-2 sm:mt-0 rounded-lg">
              <RefreshCw className="h-3 w-3 mr-1" />
              {t('retry', 'Retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats - Mobile Optimized */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              {t('total_inventory', 'Total Inventory')}
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,000 kg</div>
            <p className="text-sm text-muted-foreground">{t('across_categories', 'Across 3 categories')}</p>
          </CardContent>
        </Card>
        
        <Card className={`shadow-md hover:shadow-lg transition-all duration-300 ${stats ? getTemperatureStatus(stats.avgTemperature).borderClass : 'border-2 border-muted'} ${stats ? getTemperatureStatus(stats.avgTemperature).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">{t('avg_temp', 'Avg. Temperature')}</CardTitle>
            <Thermometer className={`h-5 w-5 ${stats ? getTemperatureStatus(stats.avgTemperature).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold">{stats?.avgTemperature || 0} °C</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getTemperatureStatus(stats.avgTemperature).color}`}>
                {getTemperatureStatus(stats.avgTemperature).status} {t('range', 'range')}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className={`shadow-md hover:shadow-lg transition-all duration-300 ${stats ? getHumidityStatus(stats.avgHumidity).borderClass : 'border-2 border-muted'} ${stats ? getHumidityStatus(stats.avgHumidity).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              {t('avg_humidity', 'Avg. Humidity')}
            </CardTitle>
            <Droplets className={`h-5 w-5 ${stats ? getHumidityStatus(stats.avgHumidity).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold">{stats?.avgHumidity || 0} %</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getHumidityStatus(stats.avgHumidity).color}`}>
                {getHumidityStatus(stats.avgHumidity).status} {t('conditions', 'conditions')}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
              {t('local_temp', 'Local Temperature')}
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-200 dark:bg-orange-900/50">
              <Thermometer className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">28°C</div>
            <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {t('updated_5_min_ago', 'Updated 5 min ago')}
            </p>
          </CardContent>
        </Card>
        
        <Link href={`/dashboard/alerts${roleQuery}`}>
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {t('warehouse_alerts', 'Warehouse Alerts')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-900/50">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-300">5 {t('active', 'Active')}</div>
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                2 {t('critical_alerts', 'Critical alerts')}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* 1. Real-time Sensor Chart */}
          <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            {/* Modern gradient header */}
            <CardHeader className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                      <SatelliteDish className="h-4 w-4 text-white" />
                    </div>
                    {t('sensor_dashboard_title', 'Real-time Sensor Dashboard')}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500 ml-10">
                    {t('sensor_dashboard_desc', 'Temperature and humidity over last 12 hours from IoT sensors')}
                    <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {source === 'adafruit-io' ? 'Adafruit IO' : 'CSV'}
                    </span>
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch} 
                  disabled={isLoading}
                  className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('refresh', 'Refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-b from-white to-slate-50/50">
              {isLoading ? (
                <Skeleton className="h-[320px] w-full rounded-xl" />
              ) : chartData.length > 0 ? (
                <ChartContainer config={sensorChartConfig} className="h-[320px] w-full">
                  <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <defs>
                      {/* Temperature gradient */}
                      <linearGradient id="tempGradientFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.4}/>
                        <stop offset="50%" stopColor="#fb923c" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#fdba74" stopOpacity={0.05}/>
                      </linearGradient>
                      {/* Humidity gradient */}
                      <linearGradient id="humGradientFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="50%" stopColor="#38bdf8" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.05}/>
                      </linearGradient>
                      {/* Glow filters */}
                      <filter id="tempGlow" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.5 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="humGlow" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0.5 0 0 0  0 0 1 0 0  0 0 0 0.5 0"/>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid 
                      vertical={false} 
                      strokeDasharray="3 3" 
                      stroke="#e5e7eb" 
                      opacity={0.5}
                    />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={12}
                      fontSize={11}
                      fontWeight={500}
                      tick={{ fill: '#6b7280' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#f97316" 
                      fontSize={11}
                      fontWeight={500}
                      tick={{ fill: '#f97316' }}
                      tickLine={false}
                      axisLine={false}
                      width={45}
                      tickFormatter={(value) => `${value}°`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#0ea5e9" 
                      fontSize={11}
                      fontWeight={500}
                      tick={{ fill: '#0ea5e9' }}
                      tickLine={false}
                      axisLine={false}
                      width={45}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend 
                      formatter={(value) => (
                        <span className="text-sm font-medium text-gray-700">{t(value.toLowerCase(), value)}</span>
                      )}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingTop: '16px' }}
                    />
                    <Area 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#f97316"
                      strokeWidth={3}
                      fill="url(#tempGradientFill)"
                      dot={tailDot(chartData.length, '--color-temperature') as any}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#f97316' }}
                      name={t('temperature', 'Temperature')}
                      connectNulls={true}
                      filter="url(#tempGlow)"
                    />
                    <Area 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fill="url(#humGradientFill)"
                      dot={tailDot(chartData.length, '--color-humidity') as any}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#0ea5e9' }}
                      name={t('humidity', 'Humidity')}
                      connectNulls={true}
                      filter="url(#humGlow)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('no_sensor_data', 'No sensor data available')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

           {/* 5. Stock Level Tracker */}
          <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">{t('stock_level_tracker', 'Stock Level Tracker')}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {t('stock_level_desc', 'Current, incoming, and outgoing stock levels by category')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-b from-white to-slate-50/50">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="inStockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="incomingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="outgoingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    fontWeight={600}
                    tick={{ fill: '#374151' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: '13px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                  />
                  <Legend 
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ paddingTop: '16px' }}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-700">{t(value.toLowerCase().replace(/ /g, '_'), value)}</span>
                    )}
                  />
                  <Bar dataKey="in_stock" fill="url(#inStockGradient)" name="In Stock (kg)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="incoming" fill="url(#incomingGradient)" name="Incoming (kg)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="outgoing" fill="url(#outgoingGradient)" name="Outgoing (kg)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* 2. Live IoT Sensor Gauges */}
          <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-[#1a6b75] via-[#21808D] to-[#1a6b75] text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                      <Thermometer className="h-5 w-5" />
                    </div>
                    {t('live_sensor_data', 'Live Sensor Data')}
                  </CardTitle>
                  <CardDescription className="text-blue-100/90 ml-12">
                    {t('realtime_warehouse_monitoring', 'Real-time warehouse temperature and humidity monitoring')}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-sm font-semibold">{t('live', 'Live')}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Live IoT Sensor Gauges */}
            <CardContent className="p-6 bg-gradient-to-b from-slate-50/80 to-white">
              <AdafruitGauges />
              
              {/* Footer Info */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <strong className="text-gray-700">{t('data_source', 'Data Source')}:</strong> {t('adafruit_io', 'Adafruit IO Cloud')}
                    </span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {t('update_frequency', 'Updates')}: {t('every_30_seconds', 'Every 30 seconds')}
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <a 
                      href="https://io.adafruit.com/sillypari/dashboards/pinto-park-live" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#21808D] hover:text-[#1a6b75] font-medium transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t('view_full_dashboard', 'View Full Dashboard')}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
