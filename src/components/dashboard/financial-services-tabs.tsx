
"use client";

import {
  Banknote,
  Shield,
  HandHelping,
  Receipt,
  PlusCircle,
  Upload,
  FileText,
  History,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const loanApplications = [
  {
    id: "LOAN-001",
    type: "KCC Loan",
    amount: "₹1,50,000",
    status: "Approved",
    date: "2024-06-15",
    progress: 100,
  },
  {
    id: "LOAN-002",
    type: "Tractor Loan",
    amount: "₹5,00,000",
    status: "Under Review",
    date: "2024-07-20",
    progress: 50,
  },
];

const insurancePolicies = [
    { id: "INS-001", type: "PMFBY - Kharif 2024", premium: "₹2,500", coverage: "₹1,25,000", status: "Active" },
    { id: "INS-002", type: "Weather-Based Insurance", premium: "₹3,000", coverage: "₹1,00,000", status: "Expired" },
];

const subsidies = [
    { id: "SUB-001", name: "PM-KISAN", status: "Credited", amount: "₹2,000", date: "2024-07-28" },
    { id: "SUB-002", name: "Fertilizer Subsidy", status: "Processing", amount: "₹1,200", date: "2024-07-25" },
];

const transactions = [
    { id: "TXN-001", date: "2024-07-28", description: "PM-KISAN Subsidy", type: "Credit", amount: "₹2,000" },
    { id: "TXN-002", date: "2024-07-22", description: "Sale of Wheat to Agro Traders", type: "Credit", amount: "₹84,000" },
    { id: "TXN-003", date: "2024-07-20", description: "Insurance Premium (PMFBY)", type: "Debit", amount: "₹2,500" },
    { id: "TXN-004", date: "2024-07-15", description: "Loan EMI (KCC)", type: "Debit", amount: "₹12,500" },
]


function LoanManagement() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Loan Management
          </CardTitle>
          <CardDescription>
            Apply for new loans and track your existing applications
          </CardDescription>
        </div>
        <Button className="rounded-xl shadow-md shadow-primary/20">
          <PlusCircle className="mr-2 h-4 w-4" />
          Apply for Loan
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loanApplications.map((loan) => (
          <Card key={loan.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{loan.type}</CardTitle>
                  <CardDescription>ID: {loan.id} | Applied on: {loan.date}</CardDescription>
                </div>
                <Badge variant={loan.status === 'Approved' ? 'default' : 'secondary'} className={`rounded-lg ${loan.status === 'Approved' ? 'bg-emerald-600 text-white' : ''}`}>
                    {loan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">{loan.amount}</span>
                </div>
                <div>
                    <Progress value={loan.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{loan.progress}% progress</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" className="rounded-lg">
                    <FileText className="mr-2 h-4 w-4" /> View Details
                 </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function InsuranceManagement() {
    const { toast } = useToast();
    
    const handleFileClaim = (id: string, type: string) => {
        toast({
            title: "Claim Form Initiated",
            description: `Starting claim process for ${type}. Policy ID: ${id}`,
        });
    };
    
    const handleViewDetails = (id: string, type: string, status: string) => {
        toast({
            title: `Policy: ${type}`,
            description: `Status: ${status}, ID: ${id}. Full details page coming soon!`,
        });
    };
    
    const handleNewPolicy = () => {
        toast({
            title: "New Policy",
            description: "Opening insurance enrollment form...",
        });
    };

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Crop Insurance
                    </CardTitle>
                    <CardDescription>Manage your insurance policies and file claims</CardDescription>
                </div>
                <Button className="rounded-xl shadow-md shadow-primary/20" onClick={handleNewPolicy}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    New Policy
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-muted overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Policy</TableHead>
                            <TableHead>Premium</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {insurancePolicies.map((policy) => (
                            <TableRow key={policy.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{policy.type}</TableCell>
                                <TableCell>{policy.premium}</TableCell>
                                <TableCell>{policy.coverage}</TableCell>
                                <TableCell>
                                    <Badge variant={policy.status === 'Active' ? 'default' : 'destructive'} className={`rounded-lg ${policy.status === 'Active' ? 'bg-blue-600 text-white' : ''}`}>
                                        {policy.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                     <Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleFileClaim(policy.id, policy.type)}>File Claim</Button>
                                     <Button variant="ghost" size="sm" onClick={() => handleViewDetails(policy.id, policy.type, policy.status)}>Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function SubsidyTracking() {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Subsidy Tracking</CardTitle>
                <CardDescription>Keep track of all government subsidies you are enrolled in.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Scheme Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subsidies.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.name}</TableCell>
                                <TableCell>{sub.amount}</TableCell>
                                <TableCell>{sub.date}</TableCell>
                                <TableCell>
                                    <Badge variant={sub.status === 'Credited' ? 'default' : 'secondary'} className={sub.status === 'Credited' ? 'bg-green-600 text-white' : ''}>
                                        {sub.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
     )
}

function PaymentDashboard() {
     return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A record of all your incoming and outgoing payments.</CardDescription>
                </div>
                 <Button variant="outline">
                    <Download className="mr-2 h-4 w-4"/>
                    Download Statement
                 </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell>{txn.date}</TableCell>
                                <TableCell className="font-medium">{txn.description}</TableCell>
                                <TableCell>
                                    <Badge variant={txn.type === 'Credit' ? 'default' : 'destructive'} className={txn.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {txn.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>{txn.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
     )
}


export function FinancialServicesTabs() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Services</h2>
          <p className="text-muted-foreground">
            Manage loans, insurance, subsidies and transactions
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-lg shadow-emerald-500/20">
          <Banknote className="h-5 w-5 text-white" />
        </div>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="loans" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Banknote className="mr-2 h-4 w-4" />
            Loans
          </TabsTrigger>
          <TabsTrigger value="insurance" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="mr-2 h-4 w-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="subsidies" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <HandHelping className="mr-2 h-4 w-4" />
            Subsidies
          </TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Receipt className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="loans">
          <LoanManagement />
        </TabsContent>
        <TabsContent value="insurance">
          <InsuranceManagement />
        </TabsContent>
        <TabsContent value="subsidies">
          <SubsidyTracking />
        </TabsContent>
        <TabsContent value="transactions">
          <PaymentDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
