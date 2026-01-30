"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, ChefHat } from "lucide-react";

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
import { suggestSurplusMealPlans } from "@/ai/flows/suggest-surplus-meal-plans";
import type { SuggestSurplusMealPlansOutput } from "@/ai/flows/suggest-surplus-meal-plans";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  surplusCrops: z.string().min(10, "Please list at least one crop and its quantity."),
});

export function MealPlanner() {
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<SuggestSurplusMealPlansOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surplusCrops: "Tomatoes - 20kg\nCucumbers - 15kg\nSpinach - 5kg",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMealPlans(null);
    try {
      const cropsArray = values.surplusCrops.split('\n').filter(line => line.trim() !== '');
      const result = await suggestSurplusMealPlans({ surplusCrops: cropsArray });
      setMealPlans(result);
      toast({
        title: "Meal Plans Generated!",
        description: "AI has created some delicious ideas for your surplus crops.",
      });
    } catch (error) {
      console.error("Meal plan generation failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate meal plans. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Surplus Crop Meal Planner</h2>
          <p className="text-muted-foreground">
            Turn your surplus into delicious meals. List your excess crops and let our AI chef suggest recipes.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600/80 shadow-lg shadow-orange-500/20">
          <ChefHat className="h-5 w-5 text-white" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="surplusCrops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Surplus Crops</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Carrots - 10kg&#10;Zucchini - 5kg"
                        className="min-h-[150px] rounded-xl border-muted"
                        {...field}
                      />
                    </FormControl>
                     <FormMessage />
                     <p className="text-xs text-muted-foreground">List each crop on a new line with its quantity.</p>
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="rounded-xl shadow-md shadow-primary/20">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Meal Plans
              </Button>
            </form>
          </Form>
          <div className="space-y-4">
              <h3 className="text-lg font-semibold">Suggested Meal Plans</h3>
              {isLoading && (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-xl bg-muted/30">
                      <p className="text-muted-foreground">Our AI chef is thinking...</p>
                  </div>
              )}
              {mealPlans && mealPlans.mealPlans.length > 0 && (
                  <Card className="bg-muted/30 max-h-[400px] overflow-y-auto border-0">
                  <CardContent className="p-6 space-y-4">
                      {mealPlans.mealPlans.map((plan, index) => (
                      <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
                          <h4 className="font-semibold flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <ChefHat className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              Idea #{index + 1}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{plan}</p>
                      </div>
                      ))}
                  </CardContent>
                  </Card>
              )}
              {!isLoading && !mealPlans && (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-xl bg-muted/30">
                      <p className="text-muted-foreground">Meal ideas will appear here.</p>
                  </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
