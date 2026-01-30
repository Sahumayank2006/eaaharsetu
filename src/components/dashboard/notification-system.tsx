"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Archive,
  Trash2,
  Star,
  StarOff,
  Volume2,
  VolumeX,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  User,
  Package,
  TrendingUp,
  MapPin,
  Zap
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample notification data
const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Critical Temperature Alert",
    message: "Warehouse G-001 temperature has exceeded safe limits (35°C). Immediate attention required.",
    time: "2 minutes ago",
    read: false,
    starred: true,
    category: "system",
    priority: "high",
    location: "Gwalior Warehouse G-001",
    actions: ["View Details", "Acknowledge", "Dispatch Team"]
  },
  {
    id: 2,
    type: "success",
    title: "Transaction Completed",
    message: "Payment of ₹45,000 from Raj Traders has been successfully processed.",
    time: "15 minutes ago",
    read: false,
    starred: false,
    category: "transaction",
    priority: "medium",
    actions: ["View Receipt", "Send Confirmation"]
  },
  {
    id: 3,
    type: "info",
    title: "New User Registration",
    message: "Farmer Suresh Kumar from Morena has registered and is pending approval.",
    time: "1 hour ago",
    read: true,
    starred: false,
    category: "user",
    priority: "low",
    actions: ["Review Profile", "Approve", "Reject"]
  },
  {
    id: 4,
    type: "warning",
    title: "Stock Level Warning",
    message: "Tomatoes stock at Bhind warehouse is running low (15% remaining).",
    time: "2 hours ago",
    read: false,
    starred: false,
    category: "inventory",
    priority: "medium",
    location: "Bhind Warehouse B-003",
    actions: ["Reorder", "Transfer Stock", "Contact Suppliers"]
  },
  {
    id: 5,
    type: "success",
    title: "Route Optimization Complete",
    message: "AI has optimized delivery routes for today, saving 25% on fuel costs.",
    time: "3 hours ago",
    read: true,
    starred: true,
    category: "logistics",
    priority: "low",
    actions: ["View Routes", "Download Report"]
  },
  {
    id: 6,
    type: "info",
    title: "Weekly Performance Report",
    message: "Platform performance summary for Week 38 is ready for review.",
    time: "1 day ago",
    read: true,
    starred: false,
    category: "reports",
    priority: "low",
    actions: ["View Report", "Share", "Download"]
  },
  {
    id: 7,
    type: "alert",
    title: "Payment Failed",
    message: "Payment of ₹12,500 from Green Valley Farms has failed. Multiple retry attempts unsuccessful.",
    time: "1 day ago",
    read: false,
    starred: false,
    category: "transaction",
    priority: "high",
    actions: ["Retry Payment", "Contact Customer", "Manual Review"]
  },
  {
    id: 8,
    type: "warning",
    title: "Server Maintenance Scheduled",
    message: "Platform will undergo maintenance on Oct 15, 2024 from 2:00 AM to 4:00 AM IST.",
    time: "2 days ago",
    read: true,
    starred: false,
    category: "system",
    priority: "medium",
    actions: ["View Details", "Notify Users", "Reschedule"]
  }
];

// Notification settings
const notificationSettings = {
  email: {
    system: true,
    transactions: true,
    users: false,
    inventory: true,
    logistics: false,
    reports: false
  },
  push: {
    system: true,
    transactions: true,
    users: true,
    inventory: true,
    logistics: true,
    reports: false
  },
  sms: {
    system: true,
    transactions: false,
    users: false,
    inventory: false,
    logistics: false,
    reports: false
  }
};

export function NotificationSystem() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [settings, setSettings] = useState(notificationSettings);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "unread" && !notification.read) ||
                         (selectedFilter === "starred" && notification.starred) ||
                         notification.category === selectedFilter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const starredCount = notifications.filter(n => n.starred).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <Clock className="h-5 w-5 text-yellow-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleMarkAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log("Mark as read:", id);
  };

  const handleStarToggle = (id: number) => {
    // In a real app, this would toggle the starred status
    console.log("Toggle star:", id);
  };

  const handleDeleteNotification = (id: number) => {
    // In a real app, this would delete the notification
    console.log("Delete notification:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount} unread, {starredCount} starred
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send a custom notification to users or teams
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="farmers">Farmers</SelectItem>
                      <SelectItem value="dealers">Dealers</SelectItem>
                      <SelectItem value="logistics">Logistics Partners</SelectItem>
                      <SelectItem value="warehouses">Warehouse Managers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Notification title" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Notification message" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsComposeOpen(false)}>
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
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
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
                <SelectItem value="starred">Starred ({starredCount})</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                  }`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {notification.location && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {notification.location}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                          {notification.actions && (
                            <div className="flex gap-1">
                              {notification.actions.slice(0, 2).map((action, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Action:", action);
                                  }}
                                >
                                  {action}
                                </Button>
                              ))}
                              {notification.actions.length > 2 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  +{notification.actions.length - 2} more
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(notification.id);
                          }}
                        >
                          {notification.starred ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark as {notification.read ? 'Unread' : 'Read'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStarToggle(notification.id)}>
                              {notification.starred ? (
                                <>
                                  <StarOff className="h-4 w-4 mr-2" />
                                  Remove Star
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  Add Star
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5" />
                  <h3 className="font-medium">Email Notifications</h3>
                </div>
                <div className="space-y-3 ml-7">
                  {Object.entries(settings.email).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label htmlFor={`email-${category}`} className="capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={`email-${category}`}
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, [category]: checked }
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5" />
                  <h3 className="font-medium">Push Notifications</h3>
                </div>
                <div className="space-y-3 ml-7">
                  {Object.entries(settings.push).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label htmlFor={`push-${category}`} className="capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={`push-${category}`}
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({
                            ...prev,
                            push: { ...prev.push, [category]: checked }
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-5 w-5" />
                  <h3 className="font-medium">SMS Notifications</h3>
                </div>
                <div className="space-y-3 ml-7">
                  {Object.entries(settings.sms).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label htmlFor={`sms-${category}`} className="capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Switch
                        id={`sms-${category}`}
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({
                            ...prev,
                            sms: { ...prev.sms, [category]: checked }
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage all notifications at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
                <Button variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive All Read
                </Button>
                <Button variant="outline">
                  <VolumeX className="h-4 w-4 mr-2" />
                  Disable All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}