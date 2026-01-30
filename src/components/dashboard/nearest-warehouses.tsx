
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Warehouse, CalendarPlus } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-language-font";

const mockWarehouses = [
  {
    id: 1,
    name: "Gwalior Central Warehousing",
    distance: "5 km",
    availability: "Available",
    availabilityKey: "available",
    imageUrl: "https://picsum.photos/seed/gwalior-central/400/200",
    dataAiHint: "large warehouse"
  },
  {
    id: 2,
    name: "Malwa Agri Storage, Gwalior",
    distance: "8 km",
    availability: "Limited Slots",
    availabilityKey: "limited_slots",
    imageUrl: "https://picsum.photos/seed/malwa-agri/400/200",
    dataAiHint: "modern warehouse"
  },
  {
    id: 3,
    name: "Chambal Cold Storage, Morena",
    distance: "40 km",
    availability: "Full",
    availabilityKey: "full",
    imageUrl: "https://picsum.photos/seed/chambal-cold/400/200",
    dataAiHint: "cold storage"
  },
];

export function NearestWarehouses() {
  const { lang, t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Warehouse /> {t('nearest_warehouses', "Nearest Warehouses")}</CardTitle>
        <CardDescription>
          {t('nearest_warehouses_desc', "Find available storage facilities near your farm location.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="overflow-hidden">
            <Link href={`/dashboard/book-slot?role=farmer&lang=${lang}&warehouse=${warehouse.id}`} passHref>
                <div className="relative h-32 w-full cursor-pointer">
                    <Image
                        src={warehouse.imageUrl}
                        alt={warehouse.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 hover:scale-105"
                        data-ai-hint={warehouse.dataAiHint}
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-2 left-2">
                         <Badge 
                            variant={
                                warehouse.availability === "Available" ? "default" :
                                warehouse.availability === "Limited Slots" ? "secondary" : "destructive"
                            }
                            className={
                                warehouse.availability === "Available" ? "bg-green-600 text-white" :
                                warehouse.availability === "Limited Slots" ? "bg-amber-500 text-white" : ""
                            }
                        >
                            {t(warehouse.availabilityKey, warehouse.availability)}
                        </Badge>
                    </div>
                </div>
            </Link>
            <div className="p-4">
              <h4 className="font-semibold">{warehouse.name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {t('approx', 'Approx.')} {warehouse.distance} {t('away', "away")}
              </p>
              <Button 
                asChild 
                size="sm"
                className="w-full mt-4"
                disabled={warehouse.availability === "Full"}
              >
                <Link href={`/dashboard/book-slot?role=farmer&lang=${lang}&warehouse=${warehouse.id}`}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    {t('book_slot', "Book Slot")}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
