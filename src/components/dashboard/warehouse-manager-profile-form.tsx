"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText, User, Fingerprint, Phone, Building, MapPin, Briefcase, Mail, Shield, Settings, Camera, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase/firebase";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits."),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters."),
  warehouseId: z.string().min(2, "Warehouse ID is required."),
  warehouseName: z.string().min(3, "Warehouse name is required."),
  address: z.string().min(10, "Please provide a complete address."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
  experience: z.string().min(1, "Experience is required."),
  department: z.string().min(2, "Department is required."),
  profilePicture: z.string().optional(),
  
  // Settings
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  slotAlerts: z.boolean().default(true),
  temperatureAlerts: z.boolean().default(true),
  humidityAlerts: z.boolean().default(true),
  inventoryAlerts: z.boolean().default(true),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const WAREHOUSE_MANAGER_ID = "warehouse-manager-001"; // In production, this would be dynamic

export function WarehouseManagerProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      employeeId: "",
      warehouseId: "",
      warehouseName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      experience: "",
      department: "",
      emailNotifications: true,
      smsNotifications: true,
      slotAlerts: true,
      temperatureAlerts: true,
      humidityAlerts: true,
      inventoryAlerts: true,
    },
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/warehouse-manager/profile?managerId=${WAREHOUSE_MANAGER_ID}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          form.reset(result.data as ProfileFormData);
          if (result.data.profilePicture) {
            setProfilePicture(result.data.profilePicture as string);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Profile",
          description: "Could not load your profile data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [form, toast]);

  const onSubmit = async (values: ProfileFormData) => {
    setIsSaving(true);
    try {
      // Ensure latest uploaded profile picture is included
      if (profilePicture) {
        values.profilePicture = profilePicture;
      }
      const response = await fetch('/api/warehouse-manager/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          managerId: WAREHOUSE_MANAGER_ID,
          ...values,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Profile Saved Successfully!",
          description: "Your warehouse manager profile has been updated.",
        });
      } else {
        throw new Error(result.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select a valid image file.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    try {
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
      const path = `profile-pictures/warehouse-managers/${WAREHOUSE_MANAGER_ID}-${Date.now()}-${safeName}`;
      const ref = storageRef(storage, path);
      const snapshot = await uploadBytes(ref, file);
      const url = await getDownloadURL(snapshot.ref);
      setProfilePicture(url);
      form.setValue("profilePicture", url, { shouldDirty: true });
      toast({ title: "Profile picture updated" });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "We couldn't upload your image. Please try again.",
      });
    } finally {
      setUploading(false);
      // reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Your personal and professional details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile picture upload */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profilePicture || undefined} alt="Profile picture" />
                  <AvatarFallback>
                    {(form.getValues("fullName")?.[0] || "W").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-3">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button type="button" variant="secondary" onClick={handleSelectProfileImage} disabled={uploading}>
                    <Camera className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  {profilePicture ? (
                    <span className="text-sm text-muted-foreground truncate max-w-[240px]">Photo set</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No photo uploaded</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address*
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Mobile Number*
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        Employee ID*
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your employee ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Warehouse Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Warehouse Information
          </CardTitle>
          <CardDescription>
            Details about your assigned warehouse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Warehouse ID*
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter warehouse ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Warehouse Name*
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter warehouse name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Department*
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="quality-control">Quality Control</SelectItem>
                        <SelectItem value="inventory">Inventory Management</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience*
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Warehouse Address*
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter complete warehouse address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure your alert and notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <FormDescription>
                          Receive important updates via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMS Notifications</FormLabel>
                        <FormDescription>
                          Receive critical alerts via SMS
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slotAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Slot Booking Alerts</FormLabel>
                        <FormDescription>
                          Get notified of new slot bookings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperatureAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Temperature Alerts</FormLabel>
                        <FormDescription>
                          Alert when temperature is out of range
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="humidityAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Humidity Alerts</FormLabel>
                        <FormDescription>
                          Alert when humidity is out of range
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inventoryAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Inventory Alerts</FormLabel>
                        <FormDescription>
                          Alert for low stock and inventory changes
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSaving}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Save Profile & Settings
                    </>
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => form.reset()}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Reset Changes
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}