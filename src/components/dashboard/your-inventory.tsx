

"use client";

import {
  AlertTriangle,
  Package,
  Calendar,
  Warehouse,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const inventoryData = [
  { id: "CROP-001", name: "Wheat", quantity: "5000 kg", storage: "Silo 1", spoilsIn: 90, harvestDate: "2024-06-01" },
  { id: "CROP-002", name: "Rice", quantity: "3000 kg", storage: "Warehouse A", spoilsIn: 120, harvestDate: "2024-05-15" },
  { id: "CROP-003", name: "Maize", quantity: "4000 kg", storage: "Warehouse B", spoilsIn: 2, harvestDate: "2024-07-29" },
  { id: "CROP-004", name: "Basmati Rice", quantity: "1000 kg", storage: "Warehouse A", spoilsIn: 150, harvestDate: "2024-05-20" },
  { id: "CROP-005", name: "Durum Wheat", quantity: "2000 kg", storage: "Silo 2", spoilsIn: 80, harvestDate: "2024-06-10" },
];

export function YourInventory() {
    const cropsAtRisk = inventoryData.filter(item => item.spoilsIn <= 7);

  return (
    <Card className="w-full border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Your Inventory</CardTitle>
              <CardDescription>
                  A total of {inventoryData.length} items in your inventory
              </CardDescription>
            </div>
        </div>
        {cropsAtRisk.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-xl shadow-md">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {cropsAtRisk.length} Item(s) at Risk
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Spoilage Alert!</AlertDialogTitle>
                    <AlertDialogDescription>
                        The following items in your inventory are at risk of spoiling soon. Consider selling them at a discount, donating them, or creating meal plans.
                        <ul className="mt-4 list-disc list-inside space-y-1">
                           {cropsAtRisk.map(crop => (
                             <li key={crop.id}>
                                <strong>{crop.name}</strong> ({crop.quantity}) - spoils in {crop.spoilsIn} day(s).
                             </li>
                           ))}
                        </ul>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction className="rounded-lg">Got it</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-muted overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead><Package className="h-4 w-4 inline-block mr-2" />Crop Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead><Warehouse className="h-4 w-4 inline-block mr-2" />Storage Location</TableHead>
              <TableHead><Calendar className="h-4 w-4 inline-block mr-2" />Harvest Date</TableHead>
              <TableHead className="text-right">Spoils In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.storage}</TableCell>
                <TableCell>{item.harvestDate}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={item.spoilsIn <= 7 ? "destructive" : item.spoilsIn <=30 ? "secondary" : "outline"} className="text-sm rounded-lg">
                        {item.spoilsIn} days
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
