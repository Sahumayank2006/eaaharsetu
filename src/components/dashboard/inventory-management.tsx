"use client";

import {
  Package,
  BarChart3,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  FileDown,
  RefreshCcw,
  PackageCheck,
  PackageX,
  FileSpreadsheet,
  Tags,
  CalendarClock,
  CircleDollarSign
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
  lastUpdated: string;
  expiryDate: string;
  location: string;
  price: number;
}

const dummyInventory: InventoryItem[] = [
  {
    id: "INV001",
    name: "Rice",
    category: "Grains",
    quantity: 5000,
    unit: "kg",
    status: "in-stock",
    lastUpdated: "2025-09-13",
    expiryDate: "2026-03-13",
    location: "Section A1",
    price: 45.50
  },
  {
    id: "INV002",
    name: "Wheat",
    category: "Grains",
    quantity: 300,
    unit: "kg",
    status: "low-stock",
    lastUpdated: "2025-09-12",
    expiryDate: "2026-02-15",
    location: "Section A2",
    price: 32.75
  },
  {
    id: "INV003",
    name: "Maize",
    category: "Grains",
    quantity: 0,
    unit: "kg",
    status: "out-of-stock",
    lastUpdated: "2025-09-11",
    expiryDate: "2025-09-25",
    location: "Section B1",
    price: 25.00
  },
  {
    id: "INV004",
    name: "Basmati Rice",
    category: "Grains",
    quantity: 750,
    unit: "kg",
    status: "in-stock",
    lastUpdated: "2025-09-13",
    expiryDate: "2025-09-20",
    location: "Section C1",
    price: 85.00
  }
];

const categories = ["All", "Grains"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in-stock":
      return <Badge className="bg-green-500"><PackageCheck className="w-3 h-3 mr-1" />In Stock</Badge>;
    case "low-stock":
      return <Badge variant="destructive" className="bg-amber-500"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>;
    case "out-of-stock":
      return <Badge variant="destructive"><PackageX className="w-3 h-3 mr-1" />Out of Stock</Badge>;
    case "expiring-soon":
      return <Badge variant="destructive"><CalendarClock className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inventory, setInventory] = useState(dummyInventory);

  // Calculate statistics
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.status === "low-stock").length;
  const expiringItems = inventory.filter(item => item.status === "expiring-soon").length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <CalendarClock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Price/Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.quantity.toLocaleString()} {item.unit}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.expiryDate}</TableCell>
                    <TableCell className="text-right">₹{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Track incoming and outgoing inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                Stock movement history and logs will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>View trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                Inventory analytics and charts will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
