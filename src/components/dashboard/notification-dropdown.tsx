
"use client";

import {
  Bell,
  CheckCircle,
  Package,
  AlertTriangle,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, onSnapshot, orderBy, Timestamp, updateDoc, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "next/navigation";
import type { Role } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SidebarMenuButton } from "../ui/sidebar";

type NotificationIcon = "CheckCircle" | "Package" | "AlertTriangle" | "User" | "XCircle";

interface Notification {
  id: string;
  icon: NotificationIcon;
  title: string;
  description: string;
  timestamp: Timestamp;
  read: boolean;
  link?: string;
  userId: string;
}

const iconMap: Record<NotificationIcon, React.ReactNode> = {
  CheckCircle: <CheckCircle className="h-4 w-4 text-green-500" />,
  Package: <Package className="h-4 w-4 text-blue-500" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  User: <User className="h-4 w-4 text-purple-500" />,
  XCircle: <XCircle className="h-4 w-4 text-red-500" />,
};


export function NotificationDropdown({ isSidebarItem }: { isSidebarItem?: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as Role | null;
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you'd get the current user's ID from auth state
    const getCurrentUserId = () => {
        switch(role) {
            case "farmer": return "farmer-rohan";
            case "green-guardian": return "warehouse-manager";
            case "dealer": return "dealer-user";
            default: return null;
        }
    }
    
    const userId = getCurrentUserId();

    if (!userId) {
        setNotifications([]);
        return;
    }

    const q = query(
        collection(db, "notifications"), 
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedNotifications: Notification[] = [];
        querySnapshot.forEach((doc) => {
            fetchedNotifications.push({ id: doc.id, ...doc.data() } as Notification);
        });
        
        setNotifications(fetchedNotifications);
    }, (error) => {
        console.error("Error fetching notifications, likely due to missing index:", error);
        // Fallback for when index is building
        const fallbackQuery = query(collection(db, "notifications"), where("userId", "==", userId));
        const fallbackUnsubscribe = onSnapshot(fallbackQuery, (querySnapshot) => {
            const fetchedNotifications: Notification[] = [];
            querySnapshot.forEach((doc) => {
                fetchedNotifications.push({ id: doc.id, ...doc.data() } as Notification);
            });
            fetchedNotifications.sort((a, b) => {
                if (a.timestamp && b.timestamp) {
                    return b.timestamp.toMillis() - a.timestamp.toMillis()
                }
                return 0;
            });
            setNotifications(fetchedNotifications);
        });
        return () => fallbackUnsubscribe();
    });

    return () => unsubscribe();
  }, [role]);
  

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await updateDoc(doc(db, "notifications", id), { read: true, readAt: serverTimestamp() });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Could not mark notification as read. Please try again.",
      });
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    try {
      // Optimistic update
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      const batch = writeBatch(db);
      unread.forEach(n => {
        batch.update(doc(db, "notifications", n.id), { read: true, readAt: serverTimestamp() });
      });
      await batch.commit();
      toast({ title: "All notifications marked as read" });
    } catch (err) {
      console.error("Failed to mark all as read", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not mark all as read. Please try again.",
      });
    }
  };

  const handleItemClick = async (n: Notification) => {
    if (!n.read) await markAsRead(n.id);
    if (n.link) {
      // Navigate to link
      window.location.href = n.link;
    }
  };

  const trigger = isSidebarItem ? (
    <SidebarMenuButton>
        <Bell />
        <span>Notifications</span>
        {unreadCount > 0 && (
            <Badge className="ml-auto">{unreadCount}</Badge>
        )}
    </SidebarMenuButton>
  ) : (
    <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{unreadCount}</Badge>
      )}
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
                 <p className="text-center text-sm text-muted-foreground p-4">No new notifications.</p>
            ) : notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={cn("flex items-start gap-3 p-3 cursor-pointer", !notification.read && "bg-accent")} 
              onClick={() => handleItemClick(notification)}
            >
                <div className="flex-shrink-0 mt-1">{iconMap[notification.icon]}</div>
                <div className="flex-grow">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    {notification.timestamp && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            {formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true })}
                        </p>
                    )}
                </div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />}
            </DropdownMenuItem>
            ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button variant="link" size="sm" className="w-full">View all notifications</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
