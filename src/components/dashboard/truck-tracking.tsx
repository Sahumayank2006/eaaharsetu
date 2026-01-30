
"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Truck, 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  Navigation,
  Package
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useForm } from "react-hook-form";

interface TruckRecord {
  id: string;
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  type: 'incoming' | 'outgoing';
  status: 'scheduled' | 'in-transit' | 'arrived' | 'loading' | 'departed' | 'delivered';
  farmerName: string;
  cropType: string;
  quantity: number;
  unit: string;
  scheduledTime: Timestamp;
  actualArrival?: Timestamp;
  actualDeparture?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
}

interface TruckFormData {
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  type: 'incoming' | 'outgoing';
  farmerName: string;
  cropType: string;
  quantity: number;
  unit: string;
  scheduledTime: string;
  notes?: string;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return <Badge variant="outline"><Clock className="mr-1 h-3 w-3"/>{status}</Badge>;
    case 'in-transit':
      return <Badge className="bg-blue-500 text-white"><Truck className="mr-1 h-3 w-3"/>In Transit</Badge>;
    case 'arrived':
      return <Badge className="bg-green-600 text-white"><CheckCircle className="mr-1 h-3 w-3"/>Arrived</Badge>;
    case 'loading':
      return <Badge className="bg-amber-500 text-white"><Package className="mr-1 h-3 w-3"/>Loading</Badge>;
    case 'departed':
      return <Badge className="bg-purple-600 text-white"><ArrowUpCircle className="mr-1 h-3 w-3"/>Departed</Badge>;
    case 'delivered':
      return <Badge className="bg-green-700 text-white"><CheckCircle className="mr-1 h-3 w-3"/>Delivered</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  return type === 'incoming' ? 
    <ArrowDownCircle className="h-4 w-4 text-green-600" /> : 
    <ArrowUpCircle className="h-4 w-4 text-blue-600" />;
};

export function TruckTracking() {
  const [trucks, setTrucks] = useState<TruckRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckRecord | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch } = useForm<TruckFormData>();

  useEffect(() => {
    const q = query(collection(db, "trucks"), orderBy("scheduledTime", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const truckRecords: TruckRecord[] = [];
      querySnapshot.forEach((doc) => {
        truckRecords.push({ id: doc.id, ...doc.data() } as TruckRecord);
      });
      setTrucks(truckRecords);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: TruckFormData) => {
    try {
      const truckData = {
        ...data,
        quantity: Number(data.quantity),
        scheduledTime: Timestamp.fromDate(new Date(data.scheduledTime)),
        status: 'scheduled',
        createdAt: serverTimestamp(),
      };

      if (editingTruck) {
        const truckRef = doc(db, "trucks", editingTruck.id);
        await updateDoc(truckRef, truckData);
        toast({
          title: "Truck Updated",
          description: "Truck record has been updated successfully.",
        });
      } else {
        await addDoc(collection(db, "trucks"), truckData);
        toast({
          title: "Truck Added",
          description: "New truck record has been created successfully.",
        });
      }

      reset();
      setDialogOpen(false);
      setEditingTruck(null);
    } catch (error) {
      console.error("Error saving truck:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save truck record. Please try again.",
      });
    }
  };

  const handleStatusUpdate = async (truckId: string, newStatus: string) => {
    try {
      const truckRef = doc(db, "trucks", truckId);
      const updateData: any = { status: newStatus };

      if (newStatus === 'arrived' && !trucks.find(t => t.id === truckId)?.actualArrival) {
        updateData.actualArrival = serverTimestamp();
      }
      if (newStatus === 'departed' && !trucks.find(t => t.id === truckId)?.actualDeparture) {
        updateData.actualDeparture = serverTimestamp();
      }

      await updateDoc(truckRef, updateData);
      toast({
        title: "Status Updated",
        description: `Truck status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update truck status. Please try again.",
      });
    }
  };

  const handleEdit = (truck: TruckRecord) => {
    setEditingTruck(truck);
    setValue('truckNumber', truck.truckNumber);
    setValue('driverName', truck.driverName);
    setValue('driverPhone', truck.driverPhone);
    setValue('type', truck.type);
    setValue('farmerName', truck.farmerName);
    setValue('cropType', truck.cropType);
    setValue('quantity', truck.quantity);
    setValue('unit', truck.unit);
    setValue('scheduledTime', format(truck.scheduledTime.toDate(), "yyyy-MM-dd'T'HH:mm"));
    setValue('notes', truck.notes || '');
    setDialogOpen(true);
  };

  const handleDelete = async (truckId: string) => {
    try {
      await deleteDoc(doc(db, "trucks", truckId));
      toast({
        title: "Truck Deleted",
        description: "Truck record has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting truck:", error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not delete truck record. Please try again.",
      });
    }
  };

  const statusOptions = ['scheduled', 'in-transit', 'arrived', 'loading', 'departed', 'delivered'];

  return (
    <Card className="w-full mx-2 sm:mx-0 border-0 shadow-md">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">
                Truck Movement Tracking
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Monitor incoming and outgoing trucks for efficient warehouse operations
              </CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl shadow-md shadow-primary/20" onClick={() => {
                reset();
                setEditingTruck(null);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Truck
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-xl">
              <DialogHeader>
                <DialogTitle>{editingTruck ? 'Edit Truck Record' : 'Add New Truck'}</DialogTitle>
                <DialogDescription>
                  {editingTruck ? 'Update truck movement details.' : 'Enter truck movement details for tracking.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="truckNumber">Truck Number</Label>
                    <Input
                      id="truckNumber"
                      placeholder="MH 12 AB 1234"
                      className="rounded-xl border-muted"
                      {...register('truckNumber', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Movement Type</Label>
                    <Select onValueChange={(value) => setValue('type', value as 'incoming' | 'outgoing')} value={watch('type')}>
                      <SelectTrigger className="rounded-xl border-muted">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="incoming">Incoming</SelectItem>
                        <SelectItem value="outgoing">Outgoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                      id="driverName"
                      placeholder="Driver name"
                      {...register('driverName', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverPhone">Driver Phone</Label>
                    <Input
                      id="driverPhone"
                      placeholder="+91 9876543210"
                      {...register('driverPhone', { required: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmerName">Farmer Name</Label>
                    <Input
                      id="farmerName"
                      placeholder="Farmer name"
                      {...register('farmerName', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      placeholder="e.g., Rice, Wheat"
                      {...register('cropType', { required: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      {...register('quantity', { required: true, min: 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select onValueChange={(value) => setValue('unit', value)} value={watch('unit')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="tons">tons</SelectItem>
                        <SelectItem value="quintals">quintals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      {...register('scheduledTime', { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes..."
                    {...register('notes')}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {editingTruck ? 'Update Truck' : 'Add Truck'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : trucks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No truck movements recorded yet.</p>
            <p className="text-sm">Add your first truck record to start tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Truck Details</TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Driver</TableHead>
                  <TableHead className="text-xs sm:text-sm">Cargo</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Scheduled</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.map((truck) => (
                  <TableRow key={truck.id}>
                    <TableCell className="p-2 sm:p-4">
                      <div className="font-medium text-xs sm:text-sm">{truck.truckNumber}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {truck.driverName} • {truck.driverPhone}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(truck.type)}
                        <span className="text-xs sm:text-sm capitalize">{truck.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                      <div className="text-xs sm:text-sm">{truck.driverName}</div>
                      <div className="text-xs text-muted-foreground">{truck.driverPhone}</div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="text-xs sm:text-sm font-medium">{truck.quantity} {truck.unit}</div>
                      <div className="text-xs text-muted-foreground">{truck.cropType}</div>
                      <div className="text-xs text-muted-foreground lg:hidden">
                        {format(truck.scheduledTime.toDate(), "MMM dd, HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">
                      {format(truck.scheduledTime.toDate(), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <Select
                        value={truck.status}
                        onValueChange={(value) => handleStatusUpdate(truck.id, value)}
                      >
                        <SelectTrigger className="w-auto border-none p-0 h-auto">
                          {getStatusBadge(truck.status)}
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(truck)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Navigation className="mr-2 h-4 w-4" />
                            Track Location
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(truck.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    