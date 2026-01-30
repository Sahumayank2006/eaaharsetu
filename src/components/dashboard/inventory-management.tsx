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
import { useToast } from "@/hooks/use-toast";

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
      return <Badge className="bg-emerald-500 hover:bg-emerald-600"><PackageCheck className="w-3 h-3 mr-1" />In Stock</Badge>;
    case "low-stock":
      return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>;
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
  const { toast } = useToast();

  // Handler functions
  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Generating inventory report as CSV...",
    });
  };

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    toast({
      title: "Data Refreshed",
      description: "Inventory data has been updated.",
    });
  };

  const handleAddItem = () => {
    toast({
      title: "Add New Item",
      description: "Opening inventory item form...",
    });
  };

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
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage your warehouse inventory
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
          <Package className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600/80 shadow-md shadow-blue-500/20">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600/80 shadow-md shadow-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600/80 shadow-md shadow-red-500/20">
              <CalendarClock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-md shadow-emerald-500/20">
              <CircleDollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="inventory" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Current Inventory</TabsTrigger>
          <TabsTrigger value="movements" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Stock Movements</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10 rounded-xl border-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] rounded-xl border-muted">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" className="rounded-lg shadow-md shadow-primary/20" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="border border-muted rounded-xl w-full overflow-x-auto bg-card">
            <Table className="w-full">
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
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-primary" />
                Stock Movements
              </CardTitle>
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
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Inventory Analytics
              </CardTitle>
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
