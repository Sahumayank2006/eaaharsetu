"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  MapPin,
  Clock,
  Target,
  Zap
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample data for analytics
const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, transactions: 120, users: 25 },
  { month: "Feb", revenue: 52000, transactions: 145, users: 32 },
  { month: "Mar", revenue: 48000, transactions: 132, users: 28 },
  { month: "Apr", revenue: 61000, transactions: 167, users: 45 },
  { month: "May", revenue: 58000, transactions: 159, users: 38 },
  { month: "Jun", revenue: 67000, transactions: 185, users: 52 },
  { month: "Jul", revenue: 73000, transactions: 198, users: 61 },
  { month: "Aug", revenue: 69000, transactions: 189, users: 56 },
  { month: "Sep", revenue: 81000, transactions: 224, users: 68 }
];

const userGrowthData = [
  { month: "Jan", farmers: 45, dealers: 12, logistics: 8, warehouses: 5 },
  { month: "Feb", farmers: 58, dealers: 15, logistics: 10, warehouses: 7 },
  { month: "Mar", farmers: 72, dealers: 18, logistics: 12, warehouses: 8 },
  { month: "Apr", farmers: 89, dealers: 23, logistics: 15, warehouses: 10 },
  { month: "May", farmers: 102, dealers: 28, logistics: 18, warehouses: 12 },
  { month: "Jun", farmers: 118, dealers: 32, logistics: 21, warehouses: 14 },
  { month: "Jul", farmers: 135, dealers: 38, logistics: 25, warehouses: 16 },
  { month: "Aug", farmers: 148, dealers: 42, logistics: 28, warehouses: 18 },
  { month: "Sep", farmers: 164, dealers: 47, logistics: 32, warehouses: 21 }
];

const categoryDistribution = [
  { name: "Vegetables", value: 45, color: "#22c55e" },
  { name: "Fruits", value: 25, color: "#3b82f6" },
  { name: "Grains", value: 20, color: "#f59e0b" },
  { name: "Others", value: 10, color: "#ef4444" }
];

const regionData = [
  { region: "Gwalior", transactions: 89, revenue: 245000, growth: 12.5 },
  { region: "Morena", transactions: 67, revenue: 189000, growth: 8.3 },
  { region: "Bhind", transactions: 54, revenue: 156000, growth: -2.1 },
  { region: "Datia", transactions: 43, revenue: 134000, growth: 15.7 },
  { region: "Shivpuri", transactions: 38, revenue: 112000, growth: 6.9 },
  { region: "Guna", transactions: 29, revenue: 98000, growth: 21.4 }
];

const performanceMetrics = [
  { metric: "User Acquisition", current: 68, target: 80, trend: "up" },
  { metric: "Transaction Success Rate", current: 94.2, target: 95, trend: "up" },
  { metric: "Average Order Value", current: 2850, target: 3000, trend: "down" },
  { metric: "Customer Retention", current: 87.5, target: 90, trend: "up" },
  { metric: "Platform Utilization", current: 76.8, target: 85, trend: "up" }
];

const topProducts = [
  { name: "Tomatoes", volume: "12,450 kg", revenue: "₹186,750", growth: 15.2 },
  { name: "Onions", volume: "9,780 kg", revenue: "₹146,700", growth: -3.1 },
  { name: "Potatoes", volume: "8,920 kg", revenue: "₹125,480", growth: 8.7 },
  { name: "Cauliflower", volume: "6,340 kg", revenue: "₹95,100", growth: 22.1 },
  { name: "Cabbage", volume: "5,680 kg", revenue: "₹79,520", growth: 5.9 }
];

export function PlatformAnalytics() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting Analytics",
      description: "Generating analytics report...",
    });
  };

  // Calculate key metrics
  const currentMonth = monthlyRevenueData[monthlyRevenueData.length - 1];
  const previousMonth = monthlyRevenueData[monthlyRevenueData.length - 2];
  
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const transactionGrowth = ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions * 100).toFixed(1);
  const userGrowth = ((currentMonth.users - previousMonth.users) / previousMonth.users * 100).toFixed(1);

  const totalRevenue = monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalTransactions = monthlyRevenueData.reduce((sum, month) => sum + month.transactions, 0);
  const totalUsers = userGrowthData[userGrowthData.length - 1];
  const totalActiveUsers = totalUsers.farmers + totalUsers.dealers + totalUsers.logistics + totalUsers.warehouses;

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Monitor platform performance and insights
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600/80 shadow-lg shadow-violet-500/20">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-sm text-emerald-600">+{revenueGrowth}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-lg shadow-emerald-500/20">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">+{transactionGrowth}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600/80 shadow-lg shadow-blue-500/20">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{totalActiveUsers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-violet-500 mr-1" />
                  <span className="text-sm text-violet-600">+{userGrowth}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600/80 shadow-lg shadow-violet-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{Math.round(totalRevenue / totalTransactions).toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm text-amber-600">-2.1%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600/80 shadow-lg shadow-amber-500/20">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Distribution by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.revenue}</p>
                      <div className="flex items-center gap-1">
                        {product.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth by Role</CardTitle>
              <CardDescription>Breakdown of user acquisition by user type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="farmers" fill="#22c55e" name="Farmers" />
                  <Bar dataKey="dealers" fill="#3b82f6" name="Dealers" />
                  <Bar dataKey="logistics" fill="#f59e0b" name="Logistics" />
                  <Bar dataKey="warehouses" fill="#ef4444" name="Warehouses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume & Revenue</CardTitle>
              <CardDescription>Monthly transaction trends and revenue correlation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="transactions" fill="#3b82f6" name="Transactions" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Performance breakdown by geographic regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region) => (
                  <div key={region.region} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">{region.region}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {region.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {region.growth > 0 ? '+' : ''}{region.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Transactions</p>
                        <p className="text-lg font-bold">{region.transactions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-lg font-bold">₹{region.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
              <CardDescription>Track performance against targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-bold">
                          {typeof metric.current === 'number' && metric.current < 100 
                            ? `${metric.current}%` 
                            : metric.current.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {typeof metric.target === 'number' && metric.target < 100 
                            ? `${metric.target}%` 
                            : metric.target.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}