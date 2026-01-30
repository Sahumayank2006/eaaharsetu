
"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Thermometer,
  Droplets,
  Package,
  AlertTriangle,
  Eye,
  Clock,
  Users,
  Activity,
  Archive,
  Truck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for temperature trends (last 30 days)
const temperatureTrends = [
  { date: "Day 1", temperature: 22.5, humidity: 65, optimal: 23 },
  { date: "Day 5", temperature: 24.1, humidity: 62, optimal: 23 },
  { date: "Day 10", temperature: 21.8, humidity: 68, optimal: 23 },
  { date: "Day 15", temperature: 25.2, humidity: 58, optimal: 23 },
  { date: "Day 20", temperature: 23.7, humidity: 64, optimal: 23 },
  { date: "Day 25", temperature: 22.3, humidity: 66, optimal: 23 },
  { date: "Day 30", temperature: 24.5, humidity: 61, optimal: 23 },
];

// Mock data for stock analytics
const stockData = [
  { category: "Rice", current: 3000, capacity: 4000, turnover: 90, wastage: 1.2 },
  { category: "Wheat", current: 4000, capacity: 5000, turnover: 85, wastage: 1.8 },
  { category: "Maize", current: 2100, capacity: 3500, turnover: 88, wastage: 1.5 },
];

// Mock data for monthly trends
const monthlyTrends = [
  { month: "Jan", temperature: 21.2, humidity: 68, stock: 8500, alerts: 12 },
  { month: "Feb", temperature: 22.1, humidity: 65, stock: 9200, alerts: 8 },
  { month: "Mar", temperature: 23.8, humidity: 62, stock: 9800, alerts: 15 },
  { month: "Apr", temperature: 25.2, humidity: 58, stock: 8900, alerts: 22 },
  { month: "May", temperature: 26.1, humidity: 55, stock: 8200, alerts: 28 },
  { month: "Jun", temperature: 24.8, humidity: 60, stock: 8700, alerts: 18 },
];

// Mock data for efficiency metrics
const efficiencyData = [
  { name: "Storage Utilization", value: 73 },
  { name: "Temperature Control", value: 92 },
  { name: "Humidity Control", value: 88 },
  { name: "Stock Turnover", value: 76 },
];

// Colors for pie charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function WarehouseAnalytics() {
  const [timeRange, setTimeRange] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("temperature");

  // Calculate analytics based on time range
  const analytics = useMemo(() => {
    const data = timeRange === "30" ? temperatureTrends : monthlyTrends;
    const temps = data.map(d => d.temperature);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    
    return {
      avgTemperature: avgTemp.toFixed(1),
      maxTemperature: maxTemp.toFixed(1),
      minTemperature: minTemp.toFixed(1),
      tempVariance: (maxTemp - minTemp).toFixed(1),
      totalStock: stockData.reduce((acc, item) => acc + item.current, 0),
      utilizationRate: ((stockData.reduce((acc, item) => acc + item.current, 0) / 
                       stockData.reduce((acc, item) => acc + item.capacity, 0)) * 100).toFixed(1),
      avgTurnover: (stockData.reduce((acc, item) => acc + item.turnover, 0) / stockData.length).toFixed(1),
      totalWastage: stockData.reduce((acc, item) => acc + item.wastage, 0).toFixed(1),
    };
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouse Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into warehouse performance and trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgTemperature}°C</div>
            <p className="text-xs text-muted-foreground">
              Range: {analytics.minTemperature}°C - {analytics.maxTemperature}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Utilization</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalStock.toLocaleString()} kg total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnover</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgTurnover}%</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wastage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalWastage}%</div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="environmental" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="environmental" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Environmental
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Efficiency
          </TabsTrigger>
        </TabsList>

        {/* Environmental Analytics */}
        <TabsContent value="environmental" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temperature & Humidity Trends</CardTitle>
                <CardDescription>
                  Environmental conditions over the last {timeRange} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeRange === "30" ? temperatureTrends : monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeRange === "30" ? "date" : "month"} />
                    <YAxis yAxisId="temp" orientation="left" />
                    <YAxis yAxisId="humidity" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="humidity"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                    {timeRange === "30" && (
                      <Line
                        yAxisId="temp"
                        type="monotone"
                        dataKey="optimal"
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        name="Optimal Temp"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature Distribution</CardTitle>
                <CardDescription>
                  Time spent in different temperature ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Optimal (10-25°C)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Above Optimal ({">"}25°C)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-24" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Below Optimal ({"<"}10°C)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={7} className="w-24" />
                      <span className="text-sm font-medium">7%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">23.2°C</div>
                    <div className="text-xs text-green-600">Most Common</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">±1.8°C</div>
                    <div className="text-xs text-blue-600">Std Deviation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Analytics */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>
                  Current stock vs capacity for grains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#3b82f6" name="Current Stock (kg)" />
                    <Bar dataKey="capacity" fill="#e5e7eb" name="Total Capacity (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Performance Metrics</CardTitle>
                <CardDescription>
                  Turnover rates and wastage for grains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockData.map((item, index) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.turnover}% turnover</Badge>
                          <Badge variant={item.wastage > 4 ? "destructive" : "secondary"}>
                            {item.wastage}% waste
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Progress value={(item.current / item.capacity) * 100} />
                          <span className="text-xs text-muted-foreground">
                            {((item.current / item.capacity) * 100).toFixed(1)}% capacity used
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{item.current.toLocaleString()} kg</span>
                          <span className="text-muted-foreground"> / {item.capacity.toLocaleString()} kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Stock Trends</CardTitle>
                <CardDescription>
                  Stock levels and alert patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="stock" orientation="left" />
                    <YAxis yAxisId="alerts" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="stock"
                      type="monotone"
                      dataKey="stock"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Stock Level (kg)"
                    />
                    <Line
                      yAxisId="alerts"
                      type="monotone"
                      dataKey="alerts"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Alert Count"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Efficiency Analytics */}
        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overall Efficiency Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for warehouse operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={efficiencyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Recommendations based on current analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Temperature Control Excellent</div>
                      <div className="text-sm text-green-700">
                        92% efficiency in maintaining optimal temperatures
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-900">Grains Wastage Low</div>
                      <div className="text-sm text-amber-700">
                        1.8% wastage rate is well within acceptable limits.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Storage Utilization Moderate</div>
                      <div className="text-sm text-blue-700">
                        73% utilization with room for 27% more capacity
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">Peak Activity</div>
                      <div className="text-sm text-purple-700">
                        Highest turnover rates observed in March-May period
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Efficiency Trends</CardTitle>
                <CardDescription>
                  Performance metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">98.2%</div>
                    <div className="text-sm text-blue-700">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">847</div>
                    <div className="text-sm text-green-700">Orders Processed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                    <div className="text-2xl font-bold text-amber-900">4.2min</div>
                    <div className="text-sm text-amber-700">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">99.1%</div>
                    <div className="text-sm text-purple-700">Order Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
