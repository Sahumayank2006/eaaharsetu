
"use client";

import {
  Bot,
  CloudSun,
  Droplets,
  Newspaper,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";

const cropAdvisory = {
  crop: "Tomatoes",
  soilType: "Loamy Soil",
  location: "Nashik, Maharashtra",
  fertilizer: "Recommends NPK 19-19-19 at current growth stage.",
  pesticide: "Proactive spraying for blight recommended due to high humidity.",
  irrigation: "Slightly increase watering frequency for the next 3 days.",
};

const weatherAlerts = {
  location: "Nashik, Maharashtra",
  currentTemp: "32°C",
  forecast: "Partly cloudy with a 40% chance of afternoon showers.",
  wind: "12 km/h SW",
  humidity: "68%",
  recommendation: "Ensure proper drainage in fields to prevent waterlogging if showers occur.",
};

const schemes = [
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance against failure due to natural calamities, pests or diseases.",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.",
    deadline: "31st July 2024",
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    description: "Provides farmers with timely access to credit for their cultivation and other needs.",
    eligibility: "All farmers, rural artisans, and fishermen.",
    deadline: "Open year-round",
  },
];


export function AdvisoryDashboard() {
  const { toast } = useToast();
  
  const handleLearnMore = (schemeName: string) => {
    toast({
      title: "Opening Scheme Details",
      description: `Loading full information for ${schemeName}...`,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advisory & Alerts</h2>
          <p className="text-muted-foreground">
            Your personalized hub for AI-driven advice, weather alerts, and important updates.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600/80 shadow-lg shadow-indigo-500/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  AI Crop Advisory
                </CardTitle>
                <CardDescription>
                    For your {cropAdvisory.crop} in {cropAdvisory.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl">
                    <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-200">Fertilizer Recommendation</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{cropAdvisory.fertilizer}</p>
                </div>
                 <div className="space-y-2 p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-xl">
                    <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-200">Pest & Disease Alert</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{cropAdvisory.pesticide}</p>
                </div>
                 <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl">
                    <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Irrigation Advice</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{cropAdvisory.irrigation}</p>
                </div>
            </CardContent>
        </Card>

         <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CloudSun className="h-5 w-5 text-primary" />
                  </div>
                  Localized Weather Alert
                </CardTitle>
                <CardDescription>
                    {weatherAlerts.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-around items-center p-4 bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/20 rounded-xl">
                    <div className="text-center">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 mx-auto w-fit mb-2">
                          <Thermometer className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="font-bold text-xl">{weatherAlerts.currentTemp}</p>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                     <div className="text-center">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mx-auto w-fit mb-2">
                          <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="font-bold text-xl">{weatherAlerts.humidity}</p>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                     <div className="text-center">
                        <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 mx-auto w-fit mb-2">
                          <Wind className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <p className="font-bold text-xl">{weatherAlerts.wind}</p>
                        <p className="text-xs text-muted-foreground">Wind</p>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                     <h4 className="font-semibold text-sm">Forecast</h4>
                     <p className="text-sm text-muted-foreground mt-1">{weatherAlerts.forecast}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                     <h4 className="font-semibold text-sm">Protective Action</h4>
                     <p className="text-sm text-muted-foreground mt-1">{weatherAlerts.recommendation}</p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Newspaper className="h-5 w-5 text-primary" />
                  </div>
                  Government Scheme Updates
                </CardTitle>
                <CardDescription>
                    Stay informed about schemes you might be eligible for.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {schemes.map((scheme, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{scheme.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-lg" onClick={() => handleLearnMore(scheme.name)}>Learn More</Button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-muted flex flex-wrap gap-4 text-xs">
                           <div><span className="font-semibold">Eligibility:</span> {scheme.eligibility}</div>
                           <Badge className={`rounded-lg ${scheme.deadline.includes("Open") ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}>
                            Deadline: {scheme.deadline}
                           </Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

    </div>
  );
}
