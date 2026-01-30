
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Thermometer,
  Droplets,
  Package,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BarChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const weeklyData = {
  reportDate: "September 13, 2025",
  week: "Week 36 (Sep 7 - Sep 13)",
  executiveSummary:
    "A stable week with optimal environmental conditions maintained. Inventory turnover was slightly below target, and two minor temperature alerts were resolved without incident. Overall performance remains strong with key recommendations focused on optimizing stock rotation and preparing for upcoming seasonal changes.",
  environmental: {
    avgTemp: 22.8,
    tempDeviation: 1.2,
    avgHumidity: 64.5,
    humidityDeviation: 3.8,
    tempTrend: "stable",
    alerts: 2,
  },
  inventory: {
    stockIn: 12000, // kg
    stockOut: 10500, // kg
    netChange: 1500, // kg
    turnoverRate: 0.88,
    wastage: 0.2, // percent
  },
  operations: {
    slotsBooked: 45,
    slotsUtilized: 42,
    trucksIn: 25,
    trucksOut: 22,
  },
  alerts: [
    {
      id: "ALERT-01",
      type: "Temperature",
      severity: "Medium",
      details: "Slight increase to 26°C in Section A",
      resolved: true,
    },
    {
      id: "ALERT-02",
      type: "Temperature",
      severity: "Medium",
      details: "Slight decrease to 14.5°C in Section C",
      resolved: true,
    },
  ],
  recommendations: [
    "Prioritize dispatch of oldest 'Rice' stock to improve turnover.",
    "Perform scheduled maintenance on cooling unit in Section A.",
    "Review stock levels for 'Maize' in preparation for next week's expected large intake.",
  ],
  chartData: [
    { day: "Sun", temp: 22.5, humidity: 65 },
    { day: "Mon", temp: 23.1, humidity: 62 },
    { day: "Tue", temp: 21.8, humidity: 68 },
    { day: "Wed", temp: 24.2, humidity: 58 },
    { day: "Thu", temp: 22.7, humidity: 64 },
    { day: "Fri", temp: 22.3, humidity: 66 },
    { day: "Sat", temp: 22.8, humidity: 61 },
  ],
};

const getTrendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="h-5 w-5 text-green-600" />;
  if (trend === "down") return <TrendingDown className="h-5 w-5 text-red-600" />;
  return <BarChart className="h-5 w-5 text-gray-500" />;
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card className="print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Weekly Warehouse Report
            </CardTitle>
            <CardDescription>
              Performance analysis for {weeklyData.week}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4"/>
                <span>{weeklyData.reportDate}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Download / Print
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Executive Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
            <p className="text-muted-foreground">
              {weeklyData.executiveSummary}
            </p>
          </section>
          
          <Separator />

          {/* Key Metrics */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyData.environmental.avgTemp}°C</div>
                  <p className="text-xs text-muted-foreground">±{weeklyData.environmental.tempDeviation}°C variance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyData.environmental.avgHumidity}%</div>
                  <p className="text-xs text-muted-foreground">±{weeklyData.environmental.humidityDeviation}% variance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net Stock Flow</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${weeklyData.inventory.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyData.inventory.netChange >= 0 ? '+' : ''}{weeklyData.inventory.netChange.toLocaleString()} kg
                  </div>
                  <p className="text-xs text-muted-foreground">{weeklyData.inventory.stockIn.toLocaleString()}kg in / {weeklyData.inventory.stockOut.toLocaleString()}kg out</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Alerts Resolved</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weeklyData.alerts.length}</div>
                  <p className="text-xs text-muted-foreground">All alerts resolved without incident</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <Separator />
          
          {/* Environmental Analysis */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Environmental Analysis</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperature" stroke="#ef4444" />
                        <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity" stroke="#3b82f6" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </section>

          <Separator />
          
           {/* Alerts & Recommendations */}
          <section>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Alerts & Incidents</h2>
                    <div className="space-y-2">
                        {weeklyData.alerts.map(alert => (
                            <div key={alert.id} className="flex items-center p-2 border rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3"/>
                                <div className="flex-1">
                                    <p className="font-medium">{alert.type} Alert ({alert.severity})</p>
                                    <p className="text-sm text-muted-foreground">{alert.details}</p>
                                </div>
                                <Badge variant="default" className="bg-green-600">Resolved</Badge>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                    <ul className="space-y-3 list-disc list-inside">
                        {weeklyData.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                                <Lightbulb className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"/>
                                <span className="text-muted-foreground">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
