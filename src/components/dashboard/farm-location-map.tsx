
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="bg-muted/30">
        <CardHeader>
            <CardTitle>Your Farm Location</CardTitle>
            <CardDescription>
                Pin your exact farm location for accurate logistics and service delivery.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Enter your farm's address or GPS coordinates" 
                        className="pl-10"
                        defaultValue="123 eAaharSetu Lane, Farmer's Ville, Sokoto"
                    />
                </div>
                <Button variant="outline" onClick={handleDetectLocation}>
                    <Crosshair className="mr-2 h-4 w-4"/>
                    Detect Location
                </Button>
                <Button onClick={handleSaveLocation}>
                    <Save className="mr-2 h-4 w-4"/>
                    Save Location
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
