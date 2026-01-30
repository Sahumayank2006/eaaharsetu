
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { CalendarPlus } from "lucide-react";
import { useTranslation } from "@/hooks/use-language-font";

export function SlotBooking() {
  const { lang, t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('warehouse_slot_booking', "Warehouse Slot Booking")}</CardTitle>
        <CardDescription>
          {t('warehouse_slot_booking_desc', "Schedule a time to drop off your produce at a nearby warehouse to ensure space and reduce wait times.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-4">
            {t('slot_booking_cta', "Click the button below to find a warehouse and book your slot.")}
        </p>
        <Button asChild size="lg">
            <Link href={`/dashboard/book-slot?role=farmer&lang=${lang}`}>
                <CalendarPlus className="mr-2 h-5 w-5" />
                {t('book_new_slot', "Book a New Slot")}
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
