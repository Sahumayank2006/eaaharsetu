
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Loader2, Mail, Phone, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().length(10, "Phone number must be 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  gstin: z.string().length(15, "GSTIN must be 15 characters."),
});

export default function DealerRegistrationPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      password: "",
      gstin: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // In a real app, you would also create a Firebase Auth user here
      // For this demo, we'll just create a Firestore document
      
      await addDoc(collection(db, "dealer-registrations"), {
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        gstin: values.gstin,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      toast({
        title: "Registration Submitted!",
        description: "Your application is under review. We will notify you upon approval.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not submit your registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-muted p-4">
              <Card className="w-full max-w-md text-center p-6">
                  <CardHeader>
                      <CardTitle className="text-2xl">Thank You!</CardTitle>
                      <CardDescription>Your registration has been submitted successfully.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">Your application is now pending approval from our administration team. You will receive an email notification once your account has been reviewed.</p>
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button asChild className="w-full">
                            <Link href="/login/dealer">Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Return to Home</Link>
                        </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Dealer Registration</CardTitle>
          <CardDescription>
            Join our network by filling out the form below. Your application will be reviewed by an admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Building className="h-4 w-4"/>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4"/>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4"/>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="gstin"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4"/>GSTIN</FormLabel>
                        <FormControl>
                            <Input placeholder="15-character GSTIN" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit for Approval"
                )}
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login/dealer" className="underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
