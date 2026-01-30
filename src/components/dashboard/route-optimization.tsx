
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, Map, Pin, MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { optimizeRoute } from "@/ai/flows/optimize-route";
import type { OptimizeRouteOutput } from "@/ai/flows/optimize-route";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  startLocation: z.string().min(3, "Start location is required."),
  deliveryPoints: z.string().min(3, "At least one delivery point is required."),
  endLocation: z.string().optional(),
});

export function RouteOptimization() {
  const { toast } = useToast();
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizeRouteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: "Warehouse A, Nashik",
      deliveryPoints: "Pune Market\nNagpur Central Storage\nSurat Farms",
      endLocation: "Warehouse A, Nashik",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOptimizedRoute(null);
    try {
      const deliveryPointsArray = values.deliveryPoints.split('\n').filter(line => line.trim() !== '');
      const result = await optimizeRoute({ 
        startLocation: values.startLocation,
        deliveryPoints: deliveryPointsArray,
        endLocation: values.endLocation,
       });
      setOptimizedRoute(result);
      toast({
        title: "Route Optimized!",
        description: "AI has calculated the most efficient route for your deliveries.",
      });
    } catch (error) {
      console.error("Route optimization failed:", error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "Could not optimize the route. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full border-0 shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">AI-Powered Route Optimization</CardTitle>
            <CardDescription>
              Enter your delivery locations to get the most efficient route
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="startLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Start Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Main Warehouse" 
                      className="rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Delivery Points</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Customer A&#10;Customer B"
                      className="min-h-[120px] rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">List each delivery point on a new line.</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">End Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Return to Warehouse" 
                      className="rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">Leave blank to return to the start location.</p>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full rounded-xl shadow-lg shadow-primary/20 h-11"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Optimize Route
            </Button>
          </form>
        </Form>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Optimized Route Plan
          </h3>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl bg-muted/30">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
              <p className="text-muted-foreground font-medium">AI is calculating the best route...</p>
            </div>
          )}
          {optimizedRoute && (
            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-0 shadow-inner max-h-[500px] overflow-y-auto">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Route Summary</CardTitle>
                <div className="flex gap-4 mt-2">
                  <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {optimizedRoute.totalDistance}
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {optimizedRoute.estimatedTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ol className="relative border-l-2 border-primary/30 ml-3">
                  {optimizedRoute.optimizedRoute.map((stop, index) => (
                    <li key={index} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full -left-4 ring-4 ring-white shadow-lg">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </span>
                      <div className="p-3 rounded-xl bg-white shadow-sm">
                        <h4 className="font-semibold text-sm">{stop.location}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{stop.instructions}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
          {!isLoading && !optimizedRoute && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl bg-muted/20">
              <div className="p-4 rounded-full bg-muted mb-3">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Your optimized route will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
