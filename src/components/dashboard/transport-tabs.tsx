
"use client";

import {
  List,
  MapPin,
  PlusCircle,
  History,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RequestTransportForm } from "./request-transport-form";
import { useToast } from "@/hooks/use-toast";

const transportRequests = [
    { id: "TR-001", crop: "Wheat", status: "En Route", vehicle: "MH12-3456", eta: "2 hours" },
    { id: "TR-002", crop: "Rice", status: "Accepted", vehicle: "KA05-7890", eta: "Tomorrow, 10 AM" },
    { id: "TR-003", crop: "Maize", status: "Pending", vehicle: "N/A", eta: "N/A" },
];

const transportHistory = [
    { id: "TR-H01", crop: "Wheat", date: "2024-07-18", cost: 3500, status: "Completed" },
    { id: "TR-H02", crop: "Rice", date: "2024-07-15", cost: 5200, status: "Completed" },
];

function ManageRequests() {
    const { toast } = useToast();
    
    const handleViewDetails = (id: string, crop: string, status: string) => {
        toast({
            title: `Transport ${id}`,
            description: `Crop: ${crop}, Status: ${status}. Full tracking coming soon!`,
        });
    };

    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Manage Transport Requests
                </CardTitle>
                <CardDescription>View the status of all your current transport requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-muted overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Request ID</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead>Vehicle No.</TableHead>
                            <TableHead>ETA</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transportRequests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{request.id}</TableCell>
                                <TableCell>{request.crop}</TableCell>
                                <TableCell>{request.vehicle}</TableCell>
                                <TableCell>{request.eta}</TableCell>
                                <TableCell>
                                    <Badge className={`rounded-lg ${request.status === 'En Route' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-lg"
                                        onClick={() => handleViewDetails(request.id, request.crop, request.status)}
                                    >
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
    )
}

function TransportHistory() {
     return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Transport History
                </CardTitle>
                <CardDescription>A log of all your past transport jobs.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-muted overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Job ID</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transportHistory.map((job) => (
                            <TableRow key={job.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{job.id}</TableCell>
                                <TableCell>{job.crop}</TableCell>
                                <TableCell>{job.date}</TableCell>
                                <TableCell className="font-medium text-emerald-600">₹{job.cost.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-lg">{job.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
     )
}


export function TransportTabs() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transport & Logistics</h2>
          <p className="text-muted-foreground">
            Request transport, manage deliveries, and track vehicles
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600/80 shadow-lg shadow-blue-500/20">
          <MapPin className="h-5 w-5 text-white" />
        </div>
      </div>

      <Tabs defaultValue="request-transport" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-full grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="request-transport" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Request Transport
          </TabsTrigger>
          <TabsTrigger value="manage-requests" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <List className="mr-2 h-4 w-4" />
            Manage Requests
          </TabsTrigger>
          <TabsTrigger value="track-vehicle" disabled className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MapPin className="mr-2 h-4 w-4" />
            Track Vehicle
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
          </TabsTrigger>
        </TabsList>
        <TabsContent value="request-transport">
          <RequestTransportForm />
        </TabsContent>
        <TabsContent value="manage-requests">
          <ManageRequests />
        </TabsContent>
         <TabsContent value="track-vehicle">
            {/* Placeholder for Vehicle Tracking component */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Live Vehicle Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Live vehicle tracking functionality is coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        <TabsContent value="history">
          <TransportHistory />
        </TabsContent>
        <TabsContent value="support">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Support & FAQ</CardTitle>
                <CardDescription>Find answers to common questions about transport and logistics.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Support and FAQ section coming soon.</p>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
