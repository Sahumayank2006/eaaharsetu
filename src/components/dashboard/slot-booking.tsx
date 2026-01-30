
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
import { CalendarPlus, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-language-font";

export function SlotBooking() {
  const { lang, t } = useTranslation();

  return (
    <Card className="w-full border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <CalendarPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{t('warehouse_slot_booking', "Warehouse Slot Booking")}</CardTitle>
            <CardDescription className="text-sm">
              {t('warehouse_slot_booking_desc', "Schedule a time to drop off your produce")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-muted/50">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            {t('slot_booking_cta', "Book your slot now to ensure space availability and reduce wait times at the warehouse.")}
          </p>
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
            <Link href={`/dashboard/book-slot?role=farmer&lang=${lang}`} className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              {t('book_new_slot', "Book a New Slot")}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
