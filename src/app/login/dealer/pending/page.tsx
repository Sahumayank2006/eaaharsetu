
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <Card className="w-full max-w-md text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-yellow-100 text-yellow-600 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">Application Pending</CardTitle>
                    <CardDescription>Your registration is currently under review.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Thank you for registering. Our admin team is reviewing your application. You will receive an email notification once your account is approved. This usually takes 24-48 hours.</p>
                    <Button asChild className="mt-6 w-full">
                        <Link href="/">Return to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
