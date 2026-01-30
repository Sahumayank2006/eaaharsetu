
"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";


const topProducts = [
    { id: 1, name: "Wheat", sold: 5000, revenue: 10500000 },
    { id: 2, name: "Rice", sold: 3000, revenue: 7200000 },
    { id: 3, name: "Maize", sold: 4000, revenue: 7200000 },
    { id: 4, name: "Basmati Rice", sold: 1500, revenue: 12750000 },
    { id: 5, name: "Durum Wheat", sold: 2500, revenue: 5500000 },
]

export function DealerAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your sales performance and top products
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600/80 shadow-lg shadow-violet-500/20">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Your most popular items by revenue</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-xl border border-muted overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Total Revenue</TableHead>
                        <TableHead>Inventory Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.sold} kg</TableCell>
                            <TableCell className="font-medium text-emerald-600">₹{product.revenue.toLocaleString('en-IN')}</TableCell>
                            <TableCell><Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-lg">In Stock</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
