
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, MapPin, Truck, Package, Clock } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

const myCrops = [
    { id: "crop-1", label: "5000kg of Wheat" },
    { id: "crop-2", label: "800kg of Rice" },
] as const;

const formSchema = z.object({
  crops: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  pickupLocation: z.string().min(3, "Pickup location is required."),
  deliveryLocation: z.string().min(3, "Delivery location is required."),
  transportType: z.string().min(1, "Please select a transport type."),
  pickupDate: z.date(),
  pickupTime: z.string().optional(),
});

export function RequestTransportForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crops: [],
      pickupLocation: "Farm A, Nashik District",
      deliveryLocation: "",
      pickupDate: new Date(),
      transportType: "truck",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Transport Requested!",
      description: "Your request has been submitted. You will be notified once a transporter accepts it.",
    });
    form.reset();
  }

  return (
    <Card className="border-0 shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              New Transport Request
            </CardTitle>
            <CardDescription>Fill out the details below to schedule a pickup for your crops.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="crops"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Select Crop(s) to Transport</FormLabel>
                                <FormDescription>
                                Select the inventory you want to move.
                                </FormDescription>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                            {myCrops.map((item) => (
                                <FormField
                                key={item.id}
                                control={form.control}
                                name="crops"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== item.id
                                                    )
                                                );
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        {item.label}
                                        </FormLabel>
                                    </FormItem>
                                    );
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="pickupLocation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter farm or storage address" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deliveryLocation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter warehouse or buyer address" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="transportType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Transport Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl border-muted">
                                            <SelectValue placeholder="Select a vehicle type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="truck">Truck</SelectItem>
                                        <SelectItem value="tempo">Tempo</SelectItem>
                                        <SelectItem value="van">Van</SelectItem>
                                        <SelectItem value="any">Any Available</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="pickupDate"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Desired Pickup Date</FormLabel>
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
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="pickupTime"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Time Window</FormLabel>
                                <FormControl>
                                    <Input type="time" className="rounded-xl border-muted" {...field} />
                                </FormControl>
                                <FormDescription>Optional: Specify a time.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                
                    <Button type="submit" size="lg" className="rounded-xl shadow-md shadow-primary/20">
                        <Truck className="mr-2 h-4 w-4" /> Submit Transport Request
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}

    