
"use client";

import { useEffect, useMemo, useState } from "react";
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
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
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

  // Live IoT iframe state
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // force reload on retry
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use Adafruit IO dashboard instead of Node-RED
  const adafruitDashboardUrl = process.env.NEXT_PUBLIC_ADAFRUIT_DASHBOARD_URL || "https://io.adafruit.com/sillypari/dashboards/pinto-park-live";

  // For backward compatibility, keep Node-RED URL but prioritize Adafruit IO
  const rawNodeRedUrl = process.env.NEXT_PUBLIC_NODERED_URL || "http://127.0.0.1:1880/ui";

  // Use Adafruit IO dashboard as the primary iframe source
  const iframeUrl = useMemo(() => {
    return adafruitDashboardUrl;
  }, [adafruitDashboardUrl]);

  // Keep Node-RED URL logic for fallback or comparison
  const nodeRedUrl = useMemo(() => {
    const base = rawNodeRedUrl.replace(/\/$/, "");
    // If a hash route is already present, keep it as-is
    if (base.includes("#!/")) {
      // For ngrok URLs, we need to add the skip warning parameter
      if (base.includes('ngrok')) {
        const hasQuery = base.includes('?');
        return `${base}${hasQuery ? '&' : '?'}ngrok-skip-browser-warning=true`;
      }
      return base;
    }
    // Ensure /ui exists
    const withUi = base.endsWith("/ui") ? base : `${base}/ui`;
    // Use default dashboard tab route with ngrok skip parameter if needed
    const finalUrl = `${withUi}/#!/0`;
    if (finalUrl.includes('ngrok')) {
      return `${finalUrl}?ngrok-skip-browser-warning=true`;
    }
    return finalUrl;
  }, [rawNodeRedUrl]);
  // Removed iframe reachability check since we're using direct links now
  // const [isReachable, setIsReachable] = useState<boolean | null>(null);

  // Live IoT iframe effects
  useEffect(() => {
    let cancelled = false;
    setIframeError(null);
    // Proactively check reachability for Adafruit IO dashboard
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const headers: HeadersInit = {};

    // Adafruit IO doesn't require special headers like ngrok
    fetch(iframeUrl.replace(/#.*/, ""), {
      signal: controller.signal,
      headers
    })
      .then(() => {
        if (!cancelled) setIframeLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setIframeError('Failed to load Adafruit IO dashboard. The site may not allow embedding.');
        }
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [iframeUrl, iframeKey]);

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        setIframeKey(prev => prev + 1);
        setLastUpdated(new Date());
      }, 60000); // 60 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled]);

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 or Ctrl+R: Refresh
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        refreshDashboard();
      }

      // F11: Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Escape: Exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Refresh dashboard function
  const refreshDashboard = () => {
    setIsRefreshing(true);
    setIframeError(null);
    setIframeLoaded(false);
    setIframeKey(prev => prev + 1);
    setLastUpdated(new Date());

    // Reset refreshing state after 2 seconds
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(prev => !prev);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Open dashboard in a new tab
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      try {
        window.open(iframeUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        // fallback
        window.location.href = iframeUrl;
      }
    }
  };

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
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
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {t('sensor_data_error', 'Failed to load sensor data')}: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 mt-2 sm:mt-0">
              <RefreshCw className="h-3 w-3 mr-1" />
              {t('retry', 'Retry')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats - Mobile Optimized */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              {t('total_inventory', 'Total Inventory')}
            </CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">9,000 kg</div>
            <p className="text-sm text-gray-500">{t('across_categories', 'Across 3 categories')}</p>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-all duration-300 ${stats ? getTemperatureStatus(stats.avgTemperature).borderClass : 'border-2 border-gray-200'} ${stats ? getTemperatureStatus(stats.avgTemperature).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">{t('avg_temp', 'Avg. Temperature')}</CardTitle>
            <Thermometer className={`h-5 w-5 ${stats ? getTemperatureStatus(stats.avgTemperature).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgTemperature || 0} °C</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getTemperatureStatus(stats.avgTemperature).color}`}>
                {getTemperatureStatus(stats.avgTemperature).status} {t('range', 'range')}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-md transition-all duration-300 ${stats ? getHumidityStatus(stats.avgHumidity).borderClass : 'border-2 border-gray-200'} ${stats ? getHumidityStatus(stats.avgHumidity).rimClass : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              {t('avg_humidity', 'Avg. Humidity')}
            </CardTitle>
            <Droplets className={`h-5 w-5 ${stats ? getHumidityStatus(stats.avgHumidity).color : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{stats?.avgHumidity || 0} %</div>
            )}
            {stats && (
              <p className={`text-sm font-medium ${getHumidityStatus(stats.avgHumidity).color}`}>
                {getHumidityStatus(stats.avgHumidity).status} {t('conditions', 'conditions')}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">
              {t('local_temp', 'Local Temperature')}
            </CardTitle>
            <Thermometer className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">28°C</div>
            <p className="text-sm text-orange-600 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {t('updated_5_min_ago', 'Updated 5 min ago')}
            </p>
          </CardContent>
        </Card>
        
        <Link href={`/dashboard/alerts${roleQuery}`}>
          <Card className="hover:shadow-lg transition-all duration-200 border-amber-200 bg-amber-50 cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-amber-700">
                {t('warehouse_alerts', 'Warehouse Alerts')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-amber-600" />
                <ArrowRight className="h-4 w-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">5 {t('active', 'Active')}</div>
              <p className="text-sm text-amber-600 flex items-center">
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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">{t('sensor_dashboard_title', 'Real-time Sensor Dashboard')}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {t('sensor_dashboard_desc', 'Temperature and humidity over last 12 hours from IoT sensors')}
                  <span className="block mt-1 text-xs text-blue-600 font-medium">
                    📡 {t('data_source', 'Data Source')}: {source === 'adafruit-io' ? 'Adafruit IO Cloud' : 'CSV Fallback'}
                  </span>
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {t('refresh', 'Refresh')}
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : chartData.length > 0 ? (
                <ChartContainer config={sensorChartConfig} className="h-[300px] w-full">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8}
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="hsl(var(--chart-1))" 
                      fontSize={10}
                      width={40}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="hsl(var(--chart-2))" 
                      fontSize={10}
                      width={40}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend 
                        formatter={(value) => t(value.toLowerCase(), value)}
                        iconSize={10}
                     />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="var(--color-temperature)" 
                      strokeWidth={2} 
                      dot={tailDot(chartData.length, '--color-temperature') as any}
                      activeDot={{ r: 5 }}
                      name={t('temperature', 'Temperature')}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="var(--color-humidity)" 
                      strokeWidth={2} 
                      dot={tailDot(chartData.length, '--color-humidity') as any}
                      activeDot={{ r: 5 }}
                       name={t('humidity', 'Humidity')}
                    />
                  </LineChart>
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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">{t('stock_level_tracker', 'Stock Level Tracker')}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {t('stock_level_desc', 'Current, incoming, and outgoing stock levels by category')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: '12px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    iconSize={10}
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => t(value.toLowerCase().replace(/ /g, '_'), value)}
                  />
                  <Bar dataKey="in_stock" fill="hsl(var(--chart-1))" name="In Stock (kg)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="incoming" fill="hsl(var(--chart-2))" name="Incoming (kg)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="outgoing" fill="hsl(var(--chart-3))" name="Outgoing (kg)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* 2. Adafruit IO Dashboard */}
          <Card className={`hover:shadow-md transition-shadow ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
            {/* Enhanced Header */}
            <CardHeader className="bg-gradient-to-r from-[#21808D] to-[#0D5E68] text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    🌾 {t('adafruit_dashboard', 'Adafruit IO Dashboard')}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {t('adafruit_desc', 'Live IoT sensor dashboard and controls')}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Control Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>{t('snapshot_warning', 'Dashboard shows snapshot data. Click refresh for latest readings.')}</span>
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
                  {/* Auto-refresh Toggle */}
                  <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-md border">
                    <span className="text-sm text-gray-600">Auto-refresh (60s)</span>
                    <button
                      onClick={toggleAutoRefresh}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoRefreshEnabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Control Buttons */}
                  <Button
                    onClick={refreshDashboard}
                    variant="outline"
                    size="sm"
                    className="bg-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  <Button
                    onClick={toggleFullscreen}
                    variant="outline"
                    size="sm"
                    className="bg-white"
                  >
                    {isFullscreen ? '🗗 Exit Fullscreen' : '⛶ Fullscreen'}
                  </Button>

                  <Button
                    onClick={openInNewTab}
                    variant="outline"
                    size="sm"
                    className="bg-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('open_external', 'Open External')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Adafruit Gauges (custom implementation) */}
            <CardContent className="p-0">
              <div className="p-6">
                <AdafruitGauges />
              </div>
                {/* Loading Overlay */}
                {!iframeLoaded && !iframeError && (
                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10">
                    <RefreshCw className="h-12 w-12 animate-spin text-[#21808D] mb-4" />
                    <p className="text-gray-600 text-lg">{t('loading_dashboard', 'Loading warehouse data...')}</p>
                  </div>
                )}

                {/* Error Overlay */}
                {iframeError && (
                  <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 text-center p-8">
                    <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('iframe_error', 'Failed to Load Dashboard')}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      {iframeError}
                    </p>
                    <div className="flex space-x-3">
                      <Button onClick={refreshDashboard} className="bg-[#21808D] hover:bg-[#0D5E68]">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t('retry', 'Retry')}
                      </Button>
                      <Button onClick={openInNewTab} variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('open_browser', 'Open in Browser')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Iframe */}
                <iframe
                  key={iframeKey}
                  src={iframeUrl}
                  className="w-full h-full border-0"
                  title="Adafruit IO Dashboard - Pinto Park Live"
                  onLoad={() => {
                    setIframeLoaded(true);
                    setIframeError(null);
                    setLastUpdated(new Date());
                  }}
                  onError={() => {
                    setIframeError('Failed to load Adafruit IO dashboard. The site may not allow embedding.');
                    setIframeLoaded(false);
                  }}
                  allow="fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Footer Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>
                        <strong>{t('last_updated', 'Last Updated')}:</strong> {formatTimestamp(lastUpdated)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {t('powered_by', 'Powered by')} <a href="https://io.adafruit.com" target="_blank" rel="noopener noreferrer" className="text-[#21808D] hover:underline">Adafruit IO</a>
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <a href="/support" className="text-[#21808D] hover:underline flex items-center">
                        <span className="mr-1">📞</span>
                        {t('contact_support', 'Contact Support')}
                      </a>
                    </div>
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
