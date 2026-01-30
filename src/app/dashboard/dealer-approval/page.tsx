
"use client";

import { useEffect, useState } from "react";
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
import { Check, Loader2, RefreshCw, UserCheck, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
}

export default function DealerApprovalPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dealer-approval");
      const data = await response.json();
      if (data.success) {
        setDealers(data.dealers);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to fetch dealers",
          description: data.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching dealer applications.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/dealer-approval?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: `Dealer ${status}`,
          description: `Dealer has been successfully ${status}.`,
        });
        fetchDealers(); // Refresh the list
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${status} dealer`,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingDealers = dealers.filter(d => d.status === 'pending');
  const otherDealers = dealers.filter(d => d.status !== 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              <CardTitle>Dealer Approvals</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDealers} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
          </div>
          <CardDescription>
            Review and approve or reject new dealer registrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingDealers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
                <p className="font-semibold">No pending approvals.</p>
                <p className="text-sm">All dealer applications have been reviewed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDealers.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${dealer.id}`} />
                              <AvatarFallback>{dealer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{dealer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{dealer.company}</TableCell>
                    <TableCell>
                        <div>{dealer.email}</div>
                        <div className="text-muted-foreground">{dealer.phone}</div>
                    </TableCell>
                    <TableCell>{dealer.gstin}</TableCell>
                    <TableCell>{format(new Date(dealer.createdAt.seconds * 1000), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleUpdateStatus(dealer.id, "approved")}
                          disabled={updatingId === dealer.id}
                        >
                           {updatingId === dealer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(dealer.id, "rejected")}
                          disabled={updatingId === dealer.id}
                        >
                           {updatingId === dealer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {otherDealers.length > 0 && (
          <Card>
              <CardHeader>
                  <CardTitle>Reviewed Applications</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Dealer</TableHead>
                              <TableHead>Company</TableHead>
                              <TableHead>Status</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {otherDealers.map(dealer => (
                              <TableRow key={dealer.id}>
                                  <TableCell>{dealer.name}</TableCell>
                                  <TableCell>{dealer.company}</TableCell>
                                  <TableCell>
                                      <Badge variant={dealer.status === 'approved' ? 'default' : 'destructive'}>
                                          {dealer.status}
                                      </Badge>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      )}

    </div>
  );
}
