
"use client";

import { useSearchParams } from "next/navigation";
import {
  Bell,
  Home,
  Languages,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  Menu,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import type { Role } from "@/lib/types";
import { LanguageContext, content } from "@/contexts/language-context";
import type { LangKey } from "@/contexts/language-context";
import { NotificationDropdown } from "./notification-dropdown";

function getRoleName(role: Role | null, lang: 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta') {
  if (!role) return lang === 'en' ? "User" : "उपयोगकर्ता";
  
  const roleKey = role.replace(/-/g, '_') as keyof (typeof content)['en']['roles'][0];
  const roleInfo = content.en.roles.find(r => r.role === role);
  
  const names: Record<string, string> = {
      farmer: "Farmer",
      dealer: "Dealer",
      admin: "Admin",
      "green-guardian": "Warehouse Manager",
      logistics: "Logistics",
  };
  
  return names[role] || "User";
}


export function Header() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role | null>(null);
  const { lang, t } = useContext(LanguageContext);

  useEffect(() => {
    const newRole = searchParams.get("role") as Role | null;
    setRole(newRole);
  }, [searchParams]);
  
  const currentRoleName = getRoleName(role, lang);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] text-white px-4 shadow-lg shadow-orange-500/10 sm:px-6 lg:px-8">
      {/* Left side - Mobile menu */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden text-white hover:bg-white/10 rounded-lg p-2 transition-colors">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      {/* Center - Title */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Home className="h-4 w-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            {currentRoleName} {t('dashboard', 'Dashboard')}
          </h1>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell - placeholder */}
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
