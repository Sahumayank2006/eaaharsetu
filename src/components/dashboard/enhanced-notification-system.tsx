"use client";

import React, { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Users,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Eye,
  Trash2,
  Edit,
  Archive,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX,
  Bookmark,
  Forward,
  Reply,
  Download,
  Share2,
  Flag,
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
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success" | "announcement";
  priority: "low" | "medium" | "high" | "urgent";
  recipient: "all_users" | "farmers" | "dealers" | "warehouse_managers" | "logistics" | "specific_users";
  recipientIds?: string[];
  sender: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  scheduledFor?: string;
  status: "draft" | "scheduled" | "sent" | "archived";
  readBy: string[];
  isStarred: boolean;
  isBookmarked: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  tags: string[];
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "NOT001",
    title: "System Maintenance Scheduled",
    message: "Our platform will undergo scheduled maintenance on December 25th from 2:00 AM to 4:00 AM IST. Please plan your activities accordingly.",
    type: "info",
    priority: "medium",
    recipient: "all_users",
    sender: { id: "ADM001", name: "System Admin", role: "admin" },
    createdAt: "2024-12-20T10:00:00Z",
    scheduledFor: "2024-12-25T02:00:00Z",
    status: "scheduled",
    readBy: ["USR001", "USR002"],
    isStarred: true,
    isBookmarked: false,
    tags: ["maintenance", "system", "important"]
  },
  {
    id: "NOT002",
    title: "New Price Updates Available",
    message: "Market prices have been updated for today. Check the latest rates for wheat, rice, and other commodities.",
    type: "announcement",
    priority: "low",
    recipient: "farmers",
    sender: { id: "ADM001", name: "Market Admin", role: "admin" },
    createdAt: "2024-12-19T08:30:00Z",
    status: "sent",
    readBy: ["USR003", "USR004", "USR005"],
    isStarred: false,
    isBookmarked: true,
    tags: ["prices", "market", "commodity"]
  },
  {
    id: "NOT003",
    title: "Payment Verification Required",
    message: "Your recent transaction needs verification. Please check your payment details and confirm.",
    type: "warning",
    priority: "high",
    recipient: "dealers",
    sender: { id: "ADM002", name: "Finance Team", role: "admin" },
    createdAt: "2024-12-18T14:15:00Z",
    status: "sent",
    readBy: [],
    isStarred: false,
    isBookmarked: false,
    tags: ["payment", "verification", "urgent"]
  },
  {
    id: "NOT004",
    title: "Welcome to AgriMarket!",
    message: "Thank you for joining our platform. Get started by completing your profile and exploring available features.",
    type: "success",
    priority: "low",
    recipient: "specific_users",
    recipientIds: ["USR006", "USR007"],
    sender: { id: "SYS001", name: "System", role: "system" },
    createdAt: "2024-12-17T16:45:00Z",
    status: "sent",
    readBy: ["USR006"],
    isStarred: false,
    isBookmarked: false,
    tags: ["welcome", "onboarding"]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "info": return <Info className="h-4 w-4 text-blue-500" />;
    case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "error": return <X className="h-4 w-4 text-red-500" />;
    case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "announcement": return <MessageSquare className="h-4 w-4 text-purple-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent": return "bg-green-100 text-green-800";
    case "scheduled": return "bg-blue-100 text-blue-800";
    case "draft": return "bg-gray-100 text-gray-800";
    case "archived": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const { toast } = useToast();

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    title: "",
    message: "",
    type: "info" as Notification['type'],
    priority: "medium" as Notification['priority'],
    recipient: "all_users" as Notification['recipient'],
    scheduledFor: "",
    tags: "",
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === "" || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Handle compose submission
  const handleComposeSubmit = () => {
    const newNotification: Notification = {
      id: `NOT${String(notifications.length + 1).padStart(3, '0')}`,
      title: composeForm.title,
      message: composeForm.message,
      type: composeForm.type,
      priority: composeForm.priority,
      recipient: composeForm.recipient,
      sender: { id: "ADM001", name: "Admin User", role: "admin" },
      createdAt: new Date().toISOString(),
      scheduledFor: composeForm.scheduledFor || undefined,
      status: composeForm.scheduledFor ? "scheduled" : "sent",
      readBy: [],
      isStarred: false,
      isBookmarked: false,
      tags: composeForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    setNotifications([newNotification, ...notifications]);
    setIsComposeOpen(false);
    setComposeForm({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      recipient: "all_users",
      scheduledFor: "",
      tags: "",
    });

    toast({
      title: "Notification sent!",
      description: composeForm.scheduledFor ? "Notification scheduled successfully." : "Notification sent to recipients.",
    });
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "archive":
        setNotifications(notifications.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, status: "archived" as const } : n
        ));
        toast({ title: `${selectedNotifications.length} notifications archived` });
        break;
      case "delete":
        setNotifications(notifications.filter(n => !selectedNotifications.includes(n.id)));
        toast({ title: `${selectedNotifications.length} notifications deleted` });
        break;
      case "star":
        setNotifications(notifications.map(n => 
          selectedNotifications.includes(n.id) ? { ...n, isStarred: !n.isStarred } : n
        ));
        toast({ title: `${selectedNotifications.length} notifications starred/unstarred` });
        break;
    }
    setSelectedNotifications([]);
  };

  // Toggle notification selection
  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  // Statistics
  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    unread: notifications.filter(n => n.readBy.length === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-muted-foreground">
            Manage and send notifications to users across the platform
          </p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Compose Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose New Notification</DialogTitle>
              <DialogDescription>
                Create and send notifications to users on the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Notification title"
                    value={composeForm.title}
                    onChange={(e) => setComposeForm({...composeForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={composeForm.type} onValueChange={(value: Notification['type']) => setComposeForm({...composeForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={composeForm.priority} onValueChange={(value: Notification['priority']) => setComposeForm({...composeForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select value={composeForm.recipient} onValueChange={(value: Notification['recipient']) => setComposeForm({...composeForm, recipient: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_users">All Users</SelectItem>
                      <SelectItem value="farmers">Farmers</SelectItem>
                      <SelectItem value="dealers">Dealers</SelectItem>
                      <SelectItem value="warehouse_managers">Warehouse Managers</SelectItem>
                      <SelectItem value="logistics">Logistics Partners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your notification message..."
                  rows={4}
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({...composeForm, message: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={composeForm.scheduledFor}
                    onChange={(e) => setComposeForm({...composeForm, scheduledFor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="urgent, maintenance, payment"
                    value={composeForm.tags}
                    onChange={(e) => setComposeForm({...composeForm, tags: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleComposeSubmit} disabled={!composeForm.title || !composeForm.message}>
                <Send className="h-4 w-4 mr-2" />
                {composeForm.scheduledFor ? "Schedule" : "Send"} Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedNotifications.length} selected
          </span>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("star")}>
              <Star className="h-4 w-4 mr-1" />
              Star/Unstar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Manage and track all platform notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">No notifications found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedNotifications.length === filteredNotifications.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNotifications(filteredNotifications.map(n => n.id));
                        } else {
                          setSelectedNotifications([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Notification</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={() => toggleNotificationSelection(notification.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeIcon(notification.type)}
                          {notification.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          {notification.isBookmarked && <Bookmark className="h-3 w-3 text-blue-500 fill-current" />}
                        </div>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </div>
                          {notification.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {notification.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {notification.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">
                          {notification.recipient.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(notification.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(notification.createdAt), "HH:mm")}
                      </div>
                    </TableCell>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            {notification.isStarred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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
    </div>
  );
}