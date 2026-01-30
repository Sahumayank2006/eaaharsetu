
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, Map, Pin } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Route Optimization</CardTitle>
        <CardDescription>
          Enter your start point, delivery locations, and an optional end point to get the most efficient route.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="startLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Warehouse" {...field} />
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
                  <FormLabel>Delivery Points</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Customer A&#10;Customer B"
                      className="min-h-[120px]"
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
                  <FormLabel>End Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Return to Warehouse" {...field} />
                  </FormControl>
                   <FormMessage />
                   <p className="text-xs text-muted-foreground">Leave blank to return to the start location.</p>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
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
            <h3 className="text-lg font-semibold">Optimized Route Plan</h3>
            {isLoading && (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">AI is calculating the best route...</p>
                </div>
            )}
            {optimizedRoute && (
                <Card className="bg-muted/50 max-h-[500px] overflow-y-auto">
                    <CardHeader>
                        <CardTitle className="text-base">Route Summary</CardTitle>
                        <CardDescription>
                            Total Distance: {optimizedRoute.totalDistance} | Estimated Time: {optimizedRoute.estimatedTime}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <ol className="relative border-l border-gray-400 dark:border-gray-700">
                        {optimizedRoute.optimizedRoute.map((stop, index) => (
                            <li key={index} className="mb-6 ml-6">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                    <Pin className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                                </span>
                                <h4 className="font-semibold">{stop.location}</h4>
                                <p className="text-sm text-muted-foreground">{stop.instructions}</p>
                            </li>
                        ))}
                        </ol>
                    </CardContent>
                </Card>
            )}
            {!isLoading && !optimizedRoute && (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Your optimized route will appear here.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
