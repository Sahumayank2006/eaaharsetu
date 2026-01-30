"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Barcode, CalendarIcon, Package, Weight } from "lucide-react";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cropName: z.string().min(2, "Crop name must be at least 2 characters."),
  batchNumber: z.string().optional(),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  harvestDate: z.date(),
});

export function CropUpload() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: "",
      batchNumber: "",
      quantity: 0,
      harvestDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Crop Uploaded!",
      description: `${values.quantity} units of ${values.cropName} have been added to your inventory.`,
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Crop</CardTitle>
        <CardDescription>
          Add a new batch of crops to your inventory. Scan a barcode for quick
          details input.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
              <FormField
                control={form.control}
                name="cropName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Organic Tomatoes" {...field} />
                    </FormControl>
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
                      <FormLabel>Quantity (in kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                                "pl-3 text-left font-normal",
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="A-123-XYZ" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a batch number for better tracking.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto">
                <Package className="mr-2 h-4 w-4" /> Add to Inventory
              </Button>
            </form>
          </Form>

          <div className="flex-shrink-0 md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 space-y-4">
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              <Button variant="outline" className="w-full justify-start">
                <Barcode className="mr-2 h-4 w-4" /> Scan Barcode
              </Button>
              <p className="text-xs text-muted-foreground">
                Use barcode scanning for faster data entry from your mobile device.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
