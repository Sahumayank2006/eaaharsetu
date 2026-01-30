"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";

const mockCrops = [
  {
    id: 1,
    name: "Wheat",
    farmer: "Green Valley Farms",
    location: "Nashik, Maharashtra",
    price: 2100,
    quantity: 5000,
    expiry: "90 days",
    image: "https://i.ibb.co/hx5gjmcZ/Copilot-20250916-195707.png",
    dataAiHint: "wheat field",
    type: "grain"
  },
  {
    id: 2,
    name: "Rice",
    farmer: "Sunrise Agriculture",
    location: "Pune, Maharashtra",
    price: 2400,
    quantity: 3000,
    expiry: "120 days",
    image: "https://i.ibb.co/mCcRCBWN/Copilot-20250916-202230.png",
    dataAiHint: "rice paddy",
    type: "grain"
  },
  {
    id: 3,
    name: "Maize",
    farmer: "Orchard Fresh",
    location: "Nagpur, Maharashtra",
    price: 1800,
    quantity: 4000,
    expiry: "100 days",
    image: "https://i.ibb.co/bX2gG0F/maize.png",
    dataAiHint: "maize corn",
    type: "grain"
  },
];

export function CropBrowser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("all");
  const [expiry, setExpiry] = useState("all");

  const filteredCrops = mockCrops.filter((crop) => {
    const searchMatch = crop.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const locationMatch = location === "all" || crop.location === location;
    const expiryMatch = expiry === "all" || (parseInt(crop.expiry) <= parseInt(expiry));
    return searchMatch && locationMatch && expiryMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browse Surplus Crops</CardTitle>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by crop name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[180px]">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Nashik, Maharashtra">Nashik</SelectItem>
              <SelectItem value="Pune, Maharashtra">Pune</SelectItem>
              <SelectItem value="Nagpur, Maharashtra">Nagpur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="w-full md:w-[180px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Expires within" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any time</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="120">120 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={crop.image}
                  alt={crop.name}
                  fill
                  style={{objectFit: 'cover'}}
                  className="transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={crop.dataAiHint}
                />
                 <Badge variant="secondary" className="absolute top-2 left-2">Expires in {crop.expiry}</Badge>
              </div>
              <CardHeader>
                <CardTitle>{crop.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{crop.farmer}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{crop.quantity} kg available</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-bold text-primary">
                  ₹{crop.price.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /quintal
                  </span>
                </div>
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         {filteredCrops.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="font-semibold">No crops match your filters.</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
