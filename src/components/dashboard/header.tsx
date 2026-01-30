
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
  
  // This is a simplified lookup, for full translation we'd use the `t` function
  // but we can't use hooks at this top level easily.
  const names: Record<string, string> = {
      farmer: "Farmer",
      dealer: "Dealer",
      admin: "Admin",
      "green-guardian": "Warehouse Manager",
      logistics: "Logistics",
  };
  
  // A more robust solution would involve the full `t` function if we restructure
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
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-header text-header-foreground px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-semibold text-center">{currentRoleName} {t('dashboard', 'Dashboard')}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Language dropdown removed from here */}
      </div>
    </header>
  );
}
