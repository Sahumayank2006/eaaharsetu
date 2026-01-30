
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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Transport Requests</CardTitle>
                <CardDescription>View the status of all your current transport requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
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
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.id}</TableCell>
                                <TableCell>{request.crop}</TableCell>
                                <TableCell>{request.vehicle}</TableCell>
                                <TableCell>{request.eta}</TableCell>
                                <TableCell>
                                    <Badge variant={request.status === 'En Route' ? 'default' : 'secondary'} className={request.status === 'En Route' ? 'bg-blue-600' : ''}>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function TransportHistory() {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Transport History</CardTitle>
                <CardDescription>A log of all your past transport jobs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job ID</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transportHistory.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.id}</TableCell>
                                <TableCell>{job.crop}</TableCell>
                                <TableCell>{job.date}</TableCell>
                                <TableCell>₹{job.cost.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-600">{job.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
     )
}


export function TransportTabs() {
  return (
    <Tabs defaultValue="request-transport" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="request-transport">
          <PlusCircle className="mr-2 h-4 w-4" />
          Request Transport
        </TabsTrigger>
        <TabsTrigger value="manage-requests">
          <List className="mr-2 h-4 w-4" />
          Manage Requests
        </TabsTrigger>
        <TabsTrigger value="track-vehicle" disabled>
          <MapPin className="mr-2 h-4 w-4" />
          Track Vehicle
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="mr-2 h-4 w-4" />
          History
        </TabsTrigger>
        <TabsTrigger value="support">
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
          <Card>
            <CardHeader>
              <CardTitle>Live Vehicle Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Live vehicle tracking functionality is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      <TabsContent value="history">
        <TransportHistory />
      </TabsContent>
      <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support & FAQ</CardTitle>
              <CardDescription>Find answers to common questions about transport and logistics.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Support and FAQ section coming soon.</p>
            </CardContent>
          </Card>
      </TabsContent>
    </Tabs>
  );
}
