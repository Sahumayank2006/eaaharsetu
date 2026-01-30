
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save, Crosshair } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FarmLocationMap() {
    const { toast } = useToast();

    const handleSaveLocation = () => {
        toast({
            title: "Location Saved",
            description: "Your farm location has been updated.",
        });
    };

    const handleDetectLocation = () => {
        toast({
            title: "Detecting Location...",
            description: "Please wait while we fetch your current location.",
        });
    };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Farm Location</h2>
          <p className="text-muted-foreground">
            Pin your exact farm location for accurate logistics and service delivery.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-lg shadow-emerald-500/20">
          <MapPin className="h-5 w-5 text-white" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Enter your farm's address or GPS coordinates" 
                        className="pl-10 rounded-xl border-muted"
                        defaultValue="123 eAaharSetu Lane, Farmer's Ville, Sokoto"
                    />
                </div>
                <Button variant="outline" onClick={handleDetectLocation} className="rounded-xl">
                    <Crosshair className="mr-2 h-4 w-4"/>
                    Detect Location
                </Button>
                <Button onClick={handleSaveLocation} className="rounded-xl shadow-md shadow-primary/20">
                    <Save className="mr-2 h-4 w-4"/>
                    Save Location
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
