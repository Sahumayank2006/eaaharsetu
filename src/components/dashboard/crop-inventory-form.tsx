
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Upload, Crosshair, Package } from "lucide-react";
import { format } from "date-fns";

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
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  cropName: z.string().min(2, "Crop name must be at least 2 characters."),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  unit: z.string().min(1, "Unit is required."),
  qualityCertificate: z.any().optional(),
  expectedPrice: z.coerce.number().positive("Price must be a positive number."),
  harvestDate: z.date(),
  storageDetails: z.string().min(1, "Storage location is required."),
  transportRequired: z.enum(["yes", "no"]),
  cropLocation: z.string().min(3, "Location is required."),
  additionalNotes: z.string().optional(),
});

export function CropInventoryForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: "",
      quantity: 0,
      unit: "kg",
      harvestDate: new Date(),
      storageDetails: "Farm",
      expectedPrice: 0,
      cropLocation: "",
      transportRequired: "no",
      additionalNotes: "",
    },
  });
  
  const handleDetectLocation = () => {
    toast({
        title: "Detecting Location...",
        description: "Please wait while we fetch your current location.",
    });
    // In a real app, you would use navigator.geolocation here
    // and then form.setValue('cropLocation', detectedLocation);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Crop Listed!",
      description: `${values.quantity}${values.unit} of ${values.cropName} has been listed for sale.`,
    });
    form.reset();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add a New Crop to Your Inventory</h2>
          <p className="text-muted-foreground">
            Fill out the details below to list your produce on the marketplace.
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-lg shadow-emerald-500/20">
          <Package className="h-5 w-5 text-white" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="cropName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name of Crop</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., Wheat, Rice, Tomato" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormDescription>What crop are you selling?</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity Available</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="100" className="rounded-xl border-muted" {...field} />
                                    </FormControl>
                                    <FormDescription>How much do you have to sell?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger className="rounded-xl border-muted">
                                                <SelectValue placeholder="Select a unit" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                <SelectItem value="quintal">Quintals</SelectItem>
                                                <SelectItem value="ton">Tons</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Unit of measurement.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="qualityCertificate"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quality Proof (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="file" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormDescription>Upload photos or certificates if available.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expectedPrice"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price Expectation</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="2000" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormDescription>What price do you want per unit? (e.g., Rs per quintal)</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="harvestDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Harvest Date</FormLabel>
                                    <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "pl-3 text-left font-normal rounded-xl border-muted",
                                            !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                            format(field.value, "PPP")
                                            ) : (
                                            <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                    </Popover>
                                    <FormDescription>When was the crop harvested?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="storageDetails"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Storage Location</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="rounded-xl border-muted">
                                            <SelectValue placeholder="Select storage type" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Farm">Farm</SelectItem>
                                            <SelectItem value="Warehouse">Warehouse</SelectItem>
                                            <SelectItem value="Cold storage">Cold storage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Where is the crop stored?</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="transportRequired"
                            render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Need Transport?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="yes" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="no" />
                                        </FormControl>
                                        <FormLabel className="font-normal">No</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>Do you want us to help arrange transport?</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cropLocation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Crop Location</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                  <Input placeholder="e.g., Farm Address or GPS coordinates" className="rounded-xl border-muted" {...field} />
                                  </FormControl>
                                  <Button type="button" variant="outline" onClick={handleDetectLocation} className="rounded-xl">
                                    <Crosshair className="mr-2 h-4 w-4" />
                                    Detect
                                  </Button>
                                </div>
                                <FormDescription>Where is your field or crop stored?</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="additionalNotes"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Additional Notes (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Add anything else buyers should know about your crop." className="rounded-xl border-muted min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                <Button type="submit" size="lg" className="w-full md:w-auto mt-8 rounded-xl shadow-md shadow-primary/20">
                    <Upload className="mr-2 h-4 w-4" /> Add Crop to Inventory
                </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
