
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
} from "lucide-react";
import Link from "next/link";
import { FarmLocationMap } from "./farm-location-map";
import { NearestWarehouses } from "./nearest-warehouses";
import { SlotBooking } from "./slot-booking";
import { useTranslation } from "@/hooks/use-language-font";


export default function FarmerDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <FarmLocationMap />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <NearestWarehouses />
        <SlotBooking />
      </div>
      
    </div>
  );
}
