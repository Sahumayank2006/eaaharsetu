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
  Wheat,
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
import { useToast } from "@/hooks/use-toast";

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
  const [cart, setCart] = useState<number[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (cropId: number, cropName: string) => {
    if (cart.includes(cropId)) {
      toast({
        title: "Already in cart",
        description: `${cropName} is already in your cart.`,
      });
      return;
    }
    setCart([...cart, cropId]);
    toast({
      title: "Added to cart",
      description: `${cropName} has been added to your cart.`,
    });
  };

  const handleMoreFilters = () => {
    toast({
      title: "Coming Soon",
      description: "Advanced filters will be available in the next update.",
    });
  };

  const filteredCrops = mockCrops.filter((crop) => {
    const searchMatch = crop.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const locationMatch = location === "all" || crop.location === location;
    const expiryMatch = expiry === "all" || (parseInt(crop.expiry) <= parseInt(expiry));
    return searchMatch && locationMatch && expiryMatch;
  });

  return (
    <Card className="w-full border-0 shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Wheat className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">Browse Surplus Crops</CardTitle>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by crop name..."
              className="pl-10 rounded-xl border-muted bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[180px] rounded-xl">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Nashik, Maharashtra">Nashik</SelectItem>
              <SelectItem value="Pune, Maharashtra">Pune</SelectItem>
              <SelectItem value="Nagpur, Maharashtra">Nagpur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="w-full md:w-[180px] rounded-xl">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Expires within" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Any time</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="120">120 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto rounded-xl" onClick={handleMoreFilters}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.id} className="overflow-hidden group border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={crop.image}
                  alt={crop.name}
                  fill
                  style={{objectFit: 'cover'}}
                  className="transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={crop.dataAiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-foreground backdrop-blur-sm shadow-sm">
                  Expires in {crop.expiry}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{crop.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{crop.farmer}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pb-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{crop.quantity} kg available</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3 border-t bg-muted/30">
                <div className="text-xl font-bold text-primary">
                  ₹{crop.price.toFixed(0)}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    /quintal
                  </span>
                </div>
                <Button size="sm" className="rounded-full shadow-md" onClick={() => handleAddToCart(crop.id, crop.name)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {cart.includes(crop.id) ? "In Cart" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredCrops.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No crops match your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
