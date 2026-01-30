
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advisory & Alerts</CardTitle>
          <CardDescription>
            Your personalized hub for AI-driven advice, weather alerts, and important updates.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI Crop Advisory</CardTitle>
                <CardDescription>
                    For your {cropAdvisory.crop} in {cropAdvisory.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm">Fertilizer Recommendation</h4>
                    <p className="text-sm text-muted-foreground">{cropAdvisory.fertilizer}</p>
                </div>
                 <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm">Pest & Disease Alert</h4>
                    <p className="text-sm text-muted-foreground">{cropAdvisory.pesticide}</p>
                </div>
                 <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm">Irrigation Advice</h4>
                    <p className="text-sm text-muted-foreground">{cropAdvisory.irrigation}</p>
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CloudSun /> Localized Weather Alert</CardTitle>
                <CardDescription>
                    {weatherAlerts.location}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-around items-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                        <Thermometer className="mx-auto h-6 w-6 text-primary" />
                        <p className="font-bold text-xl">{weatherAlerts.currentTemp}</p>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                     <div className="text-center">
                        <Droplets className="mx-auto h-6 w-6 text-primary" />
                        <p className="font-bold text-xl">{weatherAlerts.humidity}</p>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                     <div className="text-center">
                        <Wind className="mx-auto h-6 w-6 text-primary" />
                        <p className="font-bold text-xl">{weatherAlerts.wind}</p>
                        <p className="text-xs text-muted-foreground">Wind</p>
                    </div>
                </div>
                <div>
                     <h4 className="font-semibold text-sm">Forecast</h4>
                     <p className="text-sm text-muted-foreground">{weatherAlerts.forecast}</p>
                </div>
                <div>
                     <h4 className="font-semibold text-sm">Protective Action</h4>
                     <p className="text-sm text-muted-foreground">{weatherAlerts.recommendation}</p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Newspaper /> Government Scheme Updates</CardTitle>
                <CardDescription>
                    Stay informed about schemes you might be eligible for.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {schemes.map((scheme, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{scheme.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
                            </div>
                            <Button variant="secondary" size="sm">Learn More</Button>
                        </div>
                        <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs">
                           <div><span className="font-semibold">Eligibility:</span> {scheme.eligibility}</div>
                           <Badge variant={scheme.deadline.includes("Open") ? "default" : "destructive"}>
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
