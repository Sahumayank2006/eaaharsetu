
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Warehouse,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
import { FarmLocationMap } from "./farm-location-map";
import { NearestWarehouses } from "./nearest-warehouses";
import { SlotBooking } from "./slot-booking";
import { useTranslation } from "@/hooks/use-language-font";


export default function FarmerDashboard() {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{t('welcome_farmer', 'Welcome, Farmer')}</h1>
        <p className="text-muted-foreground">
          {t('farmer_dashboard_desc', 'Manage your farm location and book warehouse slots')}
        </p>
      </div>

      {/* Farm Location Map */}
      <FarmLocationMap />
      
      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <NearestWarehouses />
        <SlotBooking />
      </div>
    </div>
  );
}
