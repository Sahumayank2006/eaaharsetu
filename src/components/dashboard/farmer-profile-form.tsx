
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText, User, Fingerprint, Phone, Camera } from "lucide-react";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase/firebase";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  mobileNumber: z.string().length(10, "Mobile number must be 10 digits."),
  aadhaarNumber: z.string().length(12, "Aadhaar number must be 12 digits."),
  idProof: z.any().optional(),
  profilePicture: z.any().optional(),
});

export function FarmerProfileForm() {
  const { toast } = useToast();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      aadhaarNumber: "",
    },
  });

  async function uploadProfilePicture(file: File) {
    if (!file) return;
    setUploading(true);
    
    try {
      const storageRef = ref(storage, `profile-pictures/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setProfileUrl(downloadUrl);
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const profileData = {
      ...values,
      profilePictureUrl: profileUrl,
    };
    console.log(profileData);
    toast({
      title: "Profile Saved!",
      description: "Your profile information has been successfully updated.",
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profileUrl} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                        <Camera className="h-4 w-4" />
                        {uploading ? "Uploading..." : "Change Profile Picture"}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            uploadProfilePicture(file);
                          }
                        }}
                        {...field}
                      />
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" />Full Name*</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
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
                        <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4" />Mobile Number*</FormLabel>
                        <FormControl>
                        <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="aadhaarNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Fingerprint className="h-4 w-4" />Aadhaar Number*</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter 12-digit Aadhaar number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="idProof"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload ID Proof*</FormLabel>
                        <FormControl>
                        <Input type="file" {...field} />
                        </FormControl>
                        <FormDescription>Upload Aadhaar or other valid government ID.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <Button type="submit" size="lg">
              <FileText className="mr-2 h-4 w-4" /> Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
