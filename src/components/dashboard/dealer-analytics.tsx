
"use client";

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
      <Card>
        <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your most popular items by revenue.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Total Revenue</TableHead>
                        <TableHead>Inventory Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.sold} kg</TableCell>
                            <TableCell>₹{product.revenue.toLocaleString('en-IN')}</TableCell>
                            <TableCell><Badge>In Stock</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
