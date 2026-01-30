"use client";

import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Calendar,
  User,
  Package,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wallet
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  id: string;
  type: "purchase" | "sale" | "refund" | "commission" | "withdrawal";
  amount: number;
  status: "completed" | "pending" | "failed" | "cancelled";
  date: string;
  description: string;
  buyer: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  seller: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  product?: {
    name: string;
    quantity: number;
    unit: string;
  };
  paymentMethod: "card" | "upi" | "netbanking" | "wallet" | "cash";
  fees: number;
  location: string;
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "purchase",
    amount: 25000,
    status: "completed",
    date: "2024-09-20T10:30:00Z",
    description: "Purchase of premium tomatoes",
    buyer: {
      id: "USR002",
      name: "Priya Sharma",
      role: "dealer"
    },
    seller: {
      id: "USR001",
      name: "Rajesh Kumar", 
      role: "farmer"
    },
    product: {
      name: "Tomatoes",
      quantity: 500,
      unit: "kg"
    },
    paymentMethod: "upi",
    fees: 500,
    location: "Gwalior, MP"
  },
  {
    id: "TXN002",
    type: "sale",
    amount: 45000,
    status: "pending",
    date: "2024-09-20T14:15:00Z",
    description: "Bulk onion order",
    buyer: {
      id: "USR003",
      name: "Amit Patel",
      role: "dealer"
    },
    seller: {
      id: "USR004",
      name: "Sunita Singh",
      role: "farmer"
    },
    product: {
      name: "Onions",
      quantity: 1000,
      unit: "kg"
    },
    paymentMethod: "netbanking",
    fees: 900,
    location: "Morena, MP"
  },
  {
    id: "TXN003",
    type: "commission",
    amount: 2250,
    status: "completed",
    date: "2024-09-20T09:45:00Z",
    description: "Platform commission for transaction TXN001",
    buyer: {
      id: "PLATFORM",
      name: "eAaharSetu Platform",
      role: "system"
    },
    seller: {
      id: "USR002",
      name: "Priya Sharma",
      role: "dealer"
    },
    paymentMethod: "wallet",
    fees: 0,
    location: "Online"
  },
  {
    id: "TXN004",
    type: "refund",
    amount: 15000,
    status: "completed",
    date: "2024-09-19T16:20:00Z",
    description: "Refund for damaged goods",
    buyer: {
      id: "USR005",
      name: "Vikram Chouhan",
      role: "farmer"
    },
    seller: {
      id: "USR006",
      name: "Meera Agarwal",
      role: "dealer"
    },
    product: {
      name: "Potatoes",
      quantity: 300,
      unit: "kg"
    },
    paymentMethod: "upi",
    fees: 0,
    location: "Bhind, MP"
  },
  {
    id: "TXN005",
    type: "withdrawal",
    amount: 75000,
    status: "failed",
    date: "2024-09-19T11:00:00Z",
    description: "Withdrawal to bank account",
    buyer: {
      id: "USR007",
      name: "Harish Malhotra",
      role: "farmer"
    },
    seller: {
      id: "BANK",
      name: "State Bank of India",
      role: "bank"
    },
    paymentMethod: "netbanking",
    fees: 25,
    location: "Guna, MP"
  },
  {
    id: "TXN006",
    type: "purchase",
    amount: 32000,
    status: "completed",
    date: "2024-09-18T13:30:00Z",
    description: "Fresh cauliflower purchase",
    buyer: {
      id: "USR008",
      name: "Geeta Yadav",
      role: "dealer"
    },
    seller: {
      id: "USR001",
      name: "Rajesh Kumar",
      role: "farmer"
    },
    product: {
      name: "Cauliflower",
      quantity: 400,
      unit: "kg"
    },
    paymentMethod: "card",
    fees: 640,
    location: "Datia, MP"
  }
];

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case "purchase": return "bg-blue-100 text-blue-800";
    case "sale": return "bg-green-100 text-green-800";
    case "refund": return "bg-red-100 text-red-800";
    case "commission": return "bg-purple-100 text-purple-800";
    case "withdrawal": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "failed": return "bg-red-100 text-red-800";
    case "cancelled": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
    case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
    case "cancelled": return <AlertCircle className="h-4 w-4 text-gray-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "card": return <CreditCard className="h-4 w-4" />;
    case "upi": return <Wallet className="h-4 w-4" />;
    case "netbanking": return <DollarSign className="h-4 w-4" />;
    case "wallet": return <Wallet className="h-4 w-4" />;
    case "cash": return <DollarSign className="h-4 w-4" />;
    default: return <CreditCard className="h-4 w-4" />;
  }
};

export function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState("all");

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === "" || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === "completed").length;
  const pendingTransactions = transactions.filter(t => t.status === "pending").length;
  const failedTransactions = transactions.filter(t => t.status === "failed").length;
  
  const totalRevenue = transactions
    .filter(t => t.status === "completed" && (t.type === "commission" || t.type === "sale"))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalFees = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.fees, 0);

  const successRate = totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Transaction Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Fees</p>
                <p className="text-2xl font-bold">₹{totalFees.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Completed</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
            <Progress value={(completedTransactions / totalTransactions) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Pending</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
            <Progress value={(pendingTransactions / totalTransactions) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Failed</h3>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{failedTransactions}</p>
            <Progress value={(failedTransactions / totalTransactions) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Transaction Management */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
          <CardDescription>
            Monitor and manage all platform transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by transaction ID, description, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        {transaction.product && (
                          <div className="flex items-center gap-1 mt-1">
                            <Package className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {transaction.product.quantity} {transaction.product.unit} {transaction.product.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{transaction.amount.toLocaleString()}</p>
                        {transaction.fees > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Fee: ₹{transaction.fees}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {transaction.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{transaction.buyer.name}</span>
                          <span className="text-xs text-muted-foreground">({transaction.buyer.role})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{transaction.seller.name}</span>
                          <span className="text-xs text-muted-foreground">({transaction.seller.role})</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {transaction.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.status === "failed" && (
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Complete information about transaction {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTransaction.id}</h3>
                  <p className="text-muted-foreground">{selectedTransaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{selectedTransaction.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    {getStatusIcon(selectedTransaction.status)}
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Buyer Information</h4>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedTransaction.buyer.avatar} />
                        <AvatarFallback>
                          {selectedTransaction.buyer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedTransaction.buyer.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedTransaction.buyer.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Seller Information</h4>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedTransaction.seller.avatar} />
                        <AvatarFallback>
                          {selectedTransaction.seller.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedTransaction.seller.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedTransaction.seller.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedTransaction.product && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Product Information</h4>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{selectedTransaction.product.name}</span>
                      <span className="text-muted-foreground">
                        - {selectedTransaction.product.quantity} {selectedTransaction.product.unit}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                    </div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedTransaction.paymentMethod}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTransaction.location}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {selectedTransaction.fees > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Platform Fee</span>
                      <span className="text-sm">₹{selectedTransaction.fees}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">Net Amount</span>
                      <span className="text-sm font-bold">
                        ₹{(selectedTransaction.amount - selectedTransaction.fees).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}