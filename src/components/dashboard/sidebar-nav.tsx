
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Carrot,
  Handshake,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  Library,
  LineChart,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Warehouse,
  Truck,
  Map,
  User,
  Store,
  Lightbulb,
  Landmark,
  CalendarCheck,
  Settings,
  Bell,
  LogOut,
  MoreHorizontal,
  Languages,
  UserCheck,
  FileText,
  Brain,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/use-language-font";
import { content } from "@/contexts/language-context";

const navItemsContent = {
  farmer: [
      { href: "/dashboard", labelKey: "dashboard", defaultLabel: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/slot-history", labelKey: "slot_history", defaultLabel: "Slot History", icon: CalendarCheck },
  ],
  dealer: [
      { href: "/dashboard", labelKey: "marketplace", defaultLabel: "Marketplace", icon: ShoppingBag },
      { href: "/dashboard/orders", labelKey: "my_orders", defaultLabel: "My Orders", icon: Package },
  ],
  "green-guardian": [
      { href: "/dashboard", labelKey: "warehouse_overview", defaultLabel: "Warehouse Overview", icon: Warehouse },
      { href: "/dashboard/inventory", labelKey: "inventory", defaultLabel: "Inventory", icon: Package },
      { href: "/dashboard/ml-prediction", labelKey: "ml_prediction", defaultLabel: "ML Prediction", icon: Brain },
      { href: "/dashboard/slot-management", labelKey: "slot_management", defaultLabel: "Slot Management", icon: CalendarCheck },
      { href: "/dashboard/route-optimization", labelKey: "logistics", defaultLabel: "Logistics", icon: Truck },
      { href: "/dashboard/alerts", labelKey: "alerts", defaultLabel: "Alerts", icon: Bell },
      { href: "/dashboard/analytics", labelKey: "analytics", defaultLabel: "Analytics", icon: LineChart },
      { href: "/dashboard/reports", labelKey: "reports", defaultLabel: "Reports", icon: FileText },
  ],
  logistics: [
      { href: "/dashboard", labelKey: "logistics_overview", defaultLabel: "Logistics Overview", icon: Truck },
      { href: "/dashboard/route-optimization", labelKey: "route_optimization", defaultLabel: "Route Optimization", icon: Map },
      { href: "/dashboard/delivery-tracking", labelKey: "delivery_tracking", defaultLabel: "Delivery Tracking", icon: Package },
  ],
  admin: [
      { href: "/dashboard", labelKey: "overview", defaultLabel: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/user-management", labelKey: "user_management", defaultLabel: "User Management", icon: Users },
      { href: "/dashboard/transactions", labelKey: "transactions", defaultLabel: "Transactions", icon: Handshake },
      { href: "/dashboard/analytics", labelKey: "platform_analytics", defaultLabel: "Platform Analytics", icon: LineChart },
      { href: "/dashboard/notifications", labelKey: "notifications", defaultLabel: "Notifications", icon: Bell },
  ],
};

const roleNameKeys = {
  farmer: "Farmer",
  dealer: "Dealer",
  admin: "Admin",
  "green-guardian": "Warehouse Manager",
  logistics: "Logistics",
};

function getRoleName(role: Role, t: (key: string, defaultValue: string) => string) {
  const roleKey = role.replace(/-/g, '_');
  const defaultName = roleNameKeys[role] || "User";
  return t(roleKey, defaultName);
}

export function SidebarNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, setLang, t } = useTranslation();
  const role = (searchParams.get("role") as Role) || "farmer";

  const currentNavItems = navItemsContent[role] || navItemsContent.farmer;
  const roleQuery = `?role=${role}&lang=${lang}`;
  const currentRoleName = getRoleName(role, t);

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <div className="flex items-center justify-center p-2">
          <Image src="https://i.ibb.co/JwHdxbZ6/Generated-Image-September-10-2025-7-55-PM.png" alt="eAaharSetu Logo" width={180} height={60} className="drop-shadow-sm" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu className="space-y-1">
          {currentNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{ children: t(item.labelKey, item.defaultLabel) }}
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                      : "hover:bg-muted"
                  )}
                >
                  <Link href={`${item.href}${roleQuery}`}>
                    <item.icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
                    <span className="font-medium">{t(item.labelKey, item.defaultLabel)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          <div className="my-4 border-t border-sidebar-border/50" />

            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="rounded-xl hover:bg-muted">
                            <Languages className="h-4 w-4" />
                            <span className="font-medium">{t('language', 'Language')}</span>
                            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{content[lang].langName}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                        <DropdownMenuItem onClick={() => setLang('en')} className="rounded-lg">English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLang('hi')} className="rounded-lg">हिंदी</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLang('bn')} className="rounded-lg">বাংলা</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLang('te')} className="rounded-lg">తెలుగు</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLang('mr')} className="rounded-lg">मराठी</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLang('ta')} className="rounded-lg">தமிழ்</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="rounded-xl hover:bg-muted">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{t('profile', 'Profile')}</span>
                            <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-xl p-2" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal p-3">
                        <div className="flex items-center gap-3">
                           <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${role}`} alt="User avatar" />
                              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                              {currentRoleName.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex flex-col space-y-1">
                              <p className="text-sm font-semibold leading-none">
                                {currentRoleName}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {role}@eaaharsetu.com
                              </p>
                           </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link href={`/dashboard/profile${roleQuery}`}>
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("profile", "Profile")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link href={`/dashboard/settings${roleQuery}`}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t("settings", "Settings")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="rounded-lg text-destructive focus:text-destructive">
                        <Link href="/">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{t("logout", "Log out")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            {role === 'farmer' && (
                 <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground font-medium">{t("total_revenue", "Total Revenue")}</p>
                    <p className="text-xl font-bold text-primary">₹1,25,430</p>
                </div>
            )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        <div className="flex flex-col gap-3 rounded-xl p-4 bg-gradient-to-br from-muted/80 to-muted/40">
           <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${role}`} alt="User avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {currentRoleName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-none">
                  {currentRoleName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                  {role}@eaaharsetu.com
                  </p>                    
              </div>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
