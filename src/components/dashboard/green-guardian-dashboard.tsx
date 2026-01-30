
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
  const { stats, chartData, isLoading, error, refetch } = useSensorData(30000);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "green-guardian";
  const lang = searchParams.get("lang") || "en";
  const roleQuery = `?role=${role}&lang=${lang}`;

  // Live IoT iframe state
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // force reload on retry
  const rawNodeRedUrl = process.env.NEXT_PUBLIC_NODERED_URL || "http://127.0.0.1:1880/ui";
  // Normalize URL: ensure /ui path and prefer landing route with hash
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
  const [isReachable, setIsReachable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsReachable(null);
    setIframeError(null);
    // Proactively check reachability (CORS-friendly; Node-RED typically sets ACAO:*)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const headers: HeadersInit = {};
    
    // Add ngrok header if using ngrok URL to skip browser warning
    if (nodeRedUrl.includes('ngrok')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    fetch(nodeRedUrl.replace(/#.*$/, ""), { 
      signal: controller.signal,
      headers 
    })
      .then(() => {
        if (!cancelled) setIsReachable(true);
      })
      .catch(() => {
        if (!cancelled) setIsReachable(false);
      })
      .finally(() => clearTimeout(timer));

    // After 15s, if not loaded and unreachable, show error
    const errorTimer = setTimeout(() => {
      if (!cancelled && !iframeLoaded && isReachable === false) {
        const isLocalUrl = nodeRedUrl.includes('127.0.0.1') || nodeRedUrl.includes('localhost');
        const errorMsg = isLocalUrl 
          ? `Node-RED dashboard not accessible at ${nodeRedUrl}. For production deployment, you need to:
             1. Deploy Node-RED to a cloud service (FlowFuse, Heroku, etc.)
             2. Set NEXT_PUBLIC_NODERED_URL environment variable in Vercel to your public Node-RED URL
             3. Or use ngrok for testing: 'ngrok http 1880'`
          : `Can't reach Node-RED dashboard at ${nodeRedUrl}. Please check if the URL is accessible.`;
        setIframeError(errorMsg);
      }
    }, 15000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(errorTimer);
      controller.abort();
    };
  }, [nodeRedUrl, iframeLoaded, iframeKey]);

  // Render small circles only for last 3 updates to reduce clutter
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
          {/* 2. Live IoT Dashboard */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-gray-900">{t('live_iot_dashboard', 'Live IoT Dashboard')}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {t('live_iot_desc', 'Real-time Node-RED dashboard with live sensor feeds and controls')}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={nodeRedUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('open_full', 'Open Full')}
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <iframe
                  key={iframeKey}
                  src={nodeRedUrl}
                  className="w-full h-[600px] border rounded-lg shadow-sm"
                  title="Node-RED IoT Dashboard"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-top-navigation"
                  scrolling="yes"
                  style={{ zIndex: 5 }}
                  onLoad={() => {
                    // Immediately mark as loaded
                    setIframeLoaded(true);
                    setIframeError(null);
                  }}
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium shadow-sm ${iframeError ? "bg-gray-400" : "bg-green-500 text-white animate-pulse"}`}>
                  {iframeError ? t('offline', 'OFFLINE') : t('live', 'LIVE')}
                </div>
                {iframeError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200 px-4 py-3 rounded-md text-sm max-w-md text-center">
                      {iframeError}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setIframeLoaded(false);
                        setIframeError(null);
                        setIframeKey((k) => k + 1);
                      }}
                    >
                      <RefreshCw className="h-3 w-3 mr-2" /> {t('retry', 'Retry')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
