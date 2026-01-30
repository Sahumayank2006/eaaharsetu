"use client";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  Clock,
  Store,
  Warehouse,
  Truck,
  RefreshCw,
  Loader2,
  Check,
  X
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "farmer" | "dealer" | "admin" | "logistics" | "warehouse_manager";
  status: "active" | "inactive" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  location: string;
  totalTransactions: number;
  totalRevenue: number;
  avatar?: string;
  verificationStatus: "verified" | "pending" | "rejected";
}

interface Dealer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  gstin: string;
  status: "pending" | "approved" | "rejected";
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  location: string;
  businessType: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: "USR003",
    name: "Amit Patel",
    email: "amit.patel@warehouse.com",
    phone: "+91 76543 21098",
    role: "warehouse_manager",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "30 minutes ago",
    location: "Bhind, MP",
    totalTransactions: 89,
    totalRevenue: 0,
    verificationStatus: "verified"
  },
  {
    id: "USR004",
    name: "Sunita Singh",
    email: "sunita.singh@transport.com",
    phone: "+91 65432 10987",
    role: "logistics",
    status: "active",
    joinDate: "2024-03-05",
    lastActive: "4 hours ago",
    location: "Datia, MP",
    totalTransactions: 67,
    totalRevenue: 0,
    verificationStatus: "verified"
  },
  {
    id: "USR009",
    name: "Rahul Warehouse Manager",
    email: "rahul@warehouse2.com",
    phone: "+91 87654 32109",
    role: "warehouse_manager",
    status: "pending",
    joinDate: "2024-09-10",
    lastActive: "2 days ago",
    location: "Gwalior, MP",
    totalTransactions: 15,
    totalRevenue: 0,
    verificationStatus: "pending"
  },
  {
    id: "USR010",
    name: "Kavita Transport",
    email: "kavita@transport2.com",
    phone: "+91 76543 98765",
    role: "logistics",
    status: "suspended",
    joinDate: "2024-08-15",
    lastActive: "1 week ago",
    location: "Morena, MP",
    totalTransactions: 34,
    totalRevenue: 0,
    verificationStatus: "rejected"
  }
];

const sampleDealers: Dealer[] = [
  {
    id: "DLR001",
    name: "Rajesh Agro Traders",
    company: "Rajesh Agro Pvt Ltd",
    email: "contact@rajeshagrotraders.com",
    phone: "+91 98765 11111",
    gstin: "27AABCU9603R1ZP",
    status: "pending",
    createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
    location: "Gwalior, MP",
    businessType: "Wholesale Trading"
  },
  {
    id: "DLR002",
    name: "Green Valley Enterprises",
    company: "Green Valley Enterprises Ltd",
    email: "info@greenvalley.com",
    phone: "+91 87654 22222",
    gstin: "27BBCDE1234F5GH",
    status: "approved",
    createdAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
    location: "Morena, MP",
    businessType: "Retail & Distribution"
  },
  {
    id: "DLR003",
    name: "Farm Fresh Solutions",
    company: "Farm Fresh Solutions Pvt Ltd",
    email: "admin@farmfresh.com",
    phone: "+91 76543 33333",
    gstin: "27CDEFG5678H9IJ",
    status: "pending",
    createdAt: { seconds: Date.now() / 1000 - 3600, nanoseconds: 0 },
    location: "Bhind, MP",
    businessType: "Processing & Packaging"
  },
  {
    id: "DLR004",
    name: "Kisan Mitra Trading",
    company: "Kisan Mitra Trading Co.",
    email: "support@kisanmitra.com",
    phone: "+91 65432 44444",
    gstin: "27DEFGH9012I3JK",
    status: "rejected",
    createdAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 },
    location: "Datia, MP",
    businessType: "Export & Import"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "approved": return "bg-green-100 text-green-800";
    case "inactive": return "bg-gray-100 text-gray-800";
    case "suspended": return "bg-red-100 text-red-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [dealers, setDealers] = useState<Dealer[]>(sampleDealers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Dealer specific functions
  const handleUpdateDealerStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      setDealers(dealers.map(dealer => 
        dealer.id === id ? { ...dealer, status } : dealer
      ));
      toast({
        title: `Dealer ${status}`,
        description: `Dealer has been successfully ${status}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${status} dealer`,
        description: "An error occurred while updating dealer status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Filter data
  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = searchQuery === "" || 
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dealer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const warehouseManagers = users.filter(user => {
    const matchesRole = user.role === "warehouse_manager";
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesRole && matchesSearch && matchesStatus;
  });

  const transportPartners = users.filter(user => {
    const matchesRole = user.role === "logistics";
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesRole && matchesSearch && matchesStatus;
  });

  // Statistics
  const pendingDealers = dealers.filter(d => d.status === 'pending').length;
  const approvedDealers = dealers.filter(d => d.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage dealers, warehouse managers, and transport partners
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="dealers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dealers" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Dealers ({dealers.length})
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Warehouse Managers ({warehouseManagers.length})
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Transport Partners ({transportPartners.length})
          </TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dealers Tab */}
        <TabsContent value="dealers" className="space-y-6">
          {/* Dealer Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Dealers</p>
                    <p className="text-2xl font-bold">{dealers.length}</p>
                  </div>
                  <Store className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approvedDealers}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingDealers}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{dealers.filter(d => d.status === 'rejected').length}</p>
                  </div>
                  <UserX className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dealers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Dealer Applications & Management</CardTitle>
              <CardDescription>Review and manage dealer registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDealers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="font-semibold">No dealers found.</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dealer</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDealers.map((dealer) => (
                      <TableRow key={dealer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${dealer.id}`} />
                              <AvatarFallback>{dealer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{dealer.name}</span>
                              <p className="text-sm text-muted-foreground">{dealer.businessType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{dealer.company}</TableCell>
                        <TableCell>
                          <div>{dealer.email}</div>
                          <div className="text-muted-foreground">{dealer.phone}</div>
                        </TableCell>
                        <TableCell>{dealer.gstin}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(dealer.status)}>
                            {dealer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(dealer.createdAt.seconds * 1000), "PPP")}</TableCell>
                        <TableCell className="text-right">
                          {dealer.status === "pending" ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleUpdateDealerStatus(dealer.id, "approved")}
                                disabled={updatingId === dealer.id}
                              >
                                {updatingId === dealer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateDealerStatus(dealer.id, "rejected")}
                                disabled={updatingId === dealer.id}
                              >
                                {updatingId === dealer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                              </Button>
                            </div>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouse Managers Tab */}
        <TabsContent value="warehouse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Managers</CardTitle>
              <CardDescription>Manage warehouse manager accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {warehouseManagers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="font-semibold">No warehouse managers found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseManagers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{user.email}</div>
                          <div className="text-muted-foreground">{user.phone}</div>
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Status
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Partners Tab */}
        <TabsContent value="transport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transport Partners</CardTitle>
              <CardDescription>Manage logistics and transport partner accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {transportPartners.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="font-semibold">No transport partners found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transportPartners.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{user.email}</div>
                          <div className="text-muted-foreground">{user.phone}</div>
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.totalTransactions}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Status
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}