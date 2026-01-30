
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, Thermometer, Droplets, CalendarClock, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { predictCropSpoilage } from "@/ai/flows/predict-crop-spoilage";
import type { PredictCropSpoilageOutput } from "@/ai/flows/predict-crop-spoilage";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  cropType: z.string().min(2, "Crop type is required."),
  temperature: z.coerce.number(),
  humidity: z.coerce.number().min(0).max(100),
  storageDays: z.coerce.number().int().min(0),
  historicalSpoilageRate: z.coerce.number().min(0).max(100),
});

export function SpoilagePrediction() {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<PredictCropSpoilageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "Wheat",
      temperature: 20,
      humidity: 60,
      storageDays: 5,
      historicalSpoilageRate: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictCropSpoilage(values);
      setPrediction(result);
      toast({
        title: "Prediction Complete",
        description: "AI analysis of spoilage risk is ready.",
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not generate a prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600/80 shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>AI Spoilage Prediction</CardTitle>
            <CardDescription>
              Enter sensor and historical data to predict crop spoilage risk
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat" {...field} className="rounded-xl border-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="humidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Humidity (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="storageDays"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Storage Duration (Days)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="historicalSpoilageRate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Historical Spoilage (%)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Predict Spoilage
            </Button>
          </form>
        </Form>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prediction Results</h3>
          {isLoading && (
             <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">AI is analyzing data...</p>
             </div>
          )}
          {prediction && (
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Spoilage Risk: 
                        <span className={`text-2xl font-bold ${prediction.predictedSpoilageRisk > 20 ? 'text-destructive' : prediction.predictedSpoilageRisk > 10 ? 'text-amber-500' : 'text-primary'}`}>
                           {prediction.predictedSpoilageRisk.toFixed(1)}%
                        </span>
                    </CardTitle>
                </CardHeader>
              <CardContent>
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Recommendations</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap">
                    {prediction.recommendations}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
          {!isLoading && !prediction && (
             <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Results will appear here.</p>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

    