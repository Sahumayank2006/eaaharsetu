
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle, Clock, MoreHorizontal, User, XCircle, Loader2, Trash2, Check, Ban, ChevronDown, ChevronUp } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, onSnapshot, query, Timestamp, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/hooks/use-language-font";

interface Slot {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerAvatar: string;
    cropType: string;
    quantity: number;
    unit: string;
    bookingDate: Timestamp;
    status: string;
}

const getStatusBadge = (status: string, t: (key: string, defaultText: string) => string) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"><CheckCircle className="mr-1 h-3 w-3"/>{t('completed', status)}</Badge>;
        case 'upcoming':
            return <Badge className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg"><Clock className="mr-1 h-3 w-3"/>{t('upcoming', status)}</Badge>;
        case 'cancelled':
            return <Badge className="bg-red-500 text-white hover:bg-red-600 rounded-lg"><XCircle className="mr-1 h-3 w-3"/>{t('cancelled', status)}</Badge>;
        case 'accepted':
            return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"><Check className="mr-1 h-3 w-3"/>{t('accepted', status)}</Badge>;
        case 'rejected':
            return <Badge className="bg-red-500 text-white hover:bg-red-600 rounded-lg"><Ban className="mr-1 h-3 w-3"/>{t('rejected', status)}</Badge>;
        default:
            return <Badge variant="outline" className="rounded-lg">{t(status.toLowerCase(), status)}</Badge>;
    }
}

export function WarehouseSlotVisibility() {
    const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { t } = useTranslation();
    const isInitialLoad = useRef(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const INITIAL_DISPLAY_COUNT = 4;

    useEffect(() => {
        const q = query(collection(db, "slots"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const slots: Slot[] = [];
            querySnapshot.forEach((doc) => {
                slots.push({ id: doc.id, ...doc.data() } as Slot);
            });
            setBookedSlots(slots);
            
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
            } else {
                 querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        toast({
                            title: t('new_slot_booked', "New Slot Booked!"),
                            description: t('new_slot_booked_desc', `A farmer has booked a slot. Kindly check.`)
                        });
                    }
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast, t]);

    const handleUpdateStatus = async (slot: Slot, status: "Accepted" | "Rejected") => {
        const slotRef = doc(db, "slots", slot.id);
        try {
            await updateDoc(slotRef, { status });

            // Notify farmer
             await addDoc(collection(db, "notifications"), {
                userId: slot.farmerId,
                icon: status === "Accepted" ? "CheckCircle" : "XCircle",
                title: t('booking_status_title', `Booking ${status}!`),
                description: t('booking_status_desc', `Your booking for ${slot.quantity} ${slot.unit} of ${slot.cropType} has been ${status.toLowerCase()}.`),
                timestamp: serverTimestamp(),
                read: false,
            });

            toast({
                title: t('slot_updated', "Slot Updated"),
                description: t('slot_updated_desc', `Booking ${slot.id} has been marked as ${status}.`)
            });
        } catch (error) {
            console.error("Error updating slot status:", error);
            toast({
                variant: "destructive",
                title: t('update_failed', "Update Failed"),
                description: t('update_failed_desc', "Could not update the slot status. Please try again.")
            });
        }
    };
    
    const handleDeleteSlot = async (slot: Slot | null) => {
        if (!slot) return;
        const slotRef = doc(db, "slots", slot.id);
        try {
            await deleteDoc(slotRef);
            
            await addDoc(collection(db, "notifications"), {
                userId: slot.farmerId,
                icon: "XCircle",
                title: t('booking_deleted_title', "Booking Deleted by Warehouse"),
                description: t('booking_deleted_desc', `Your booking for ${slot.quantity} ${slot.unit} of ${slot.cropType} on ${format(slot.bookingDate.toDate(), "PPP")} has been removed by the warehouse manager.`),
                timestamp: serverTimestamp(),
                read: false,
            });

            toast({
                title: t('slot_deleted', "Slot Deleted"),
                description: t('slot_deleted_desc', `Booking ${slot.id} has been permanently deleted.`)
            });
        } catch (error) {
            console.error("Error deleting slot:", error);
             toast({
                variant: "destructive",
                title: t('deletion_failed', "Deletion Failed"),
                description: t('deletion_failed_desc', "Could not delete the slot. Please try again.")
            });
        } finally {
            setDialogOpen(false);
            setSelectedSlot(null);
        }
    };

  const displayedSlots = isExpanded ? bookedSlots : bookedSlots.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreSlots = bookedSlots.length > INITIAL_DISPLAY_COUNT;

  return (
    <Card className="w-full mx-2 sm:mx-0 border-0 shadow-md">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              {t('upcoming_slot_bookings', "Upcoming Slot Bookings")}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              {t('upcoming_slot_bookings_desc', "Review and manage scheduled drop-offs from farmers.")}
            </CardDescription>
          </div>
          {hasMoreSlots && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 rounded-xl"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {t('show_less', "Show Less")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {t('show_all', `Show All (${bookedSlots.length})`)}
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {loading ? (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="rounded-xl border border-muted overflow-hidden">
                <Table className="min-w-full">
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead className="text-xs sm:text-sm">{t('farmer', "Farmer")}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">{t('crop_type', "Crop Type")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t('quantity', "Quantity")}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">{t('arrival_date', "Arrival Date")}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t('status', "Status")}</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">{t('actions', "Actions")}</TableHead>
                    </TableRow>
                </TableHeader>
            <TableBody>
                {displayedSlots.map((slot) => (
                <TableRow key={slot.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="p-2 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-6 w-6 sm:h-9 sm:w-9 flex-shrink-0 rounded-lg">
                        <AvatarImage src={slot.farmerAvatar} alt={slot.farmerName} />
                        <AvatarFallback className="text-xs rounded-lg">{slot.farmerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <span className="font-medium text-xs sm:text-sm truncate block">{slot.farmerName}</span>
                            <span className="text-xs text-muted-foreground sm:hidden">{slot.cropType}</span>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden sm:table-cell text-xs sm:text-sm">{slot.cropType}</TableCell>
                    <TableCell className="p-2 sm:p-4 text-xs sm:text-sm font-medium">{slot.quantity} {slot.unit}</TableCell>
                    <TableCell className="p-2 sm:p-4 hidden md:table-cell text-xs sm:text-sm">{format(slot.bookingDate.toDate(), "PPP")}</TableCell>
                    <TableCell className="p-2 sm:p-4">{getStatusBadge(slot.status, t)}</TableCell>
                    <TableCell className="p-2 sm:p-4 text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-lg">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('actions', "Actions")}</DropdownMenuLabel>
                            <DropdownMenuItem 
                                disabled={slot.status !== 'Upcoming'}
                                onClick={() => handleUpdateStatus(slot, 'Accepted')}
                            >
                            <Check className="mr-2 h-4 w-4" />
                            {t('accept', "Accept")}
                            </DropdownMenuItem>
                             <DropdownMenuItem 
                                className="text-destructive"
                                disabled={slot.status !== 'Upcoming'}
                                onClick={() => handleUpdateStatus(slot, 'Rejected')}
                            >
                            <Ban className="mr-2 h-4 w-4" />
                            {t('reject', "Reject")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                toast({
                                    title: t('farmer_profile', "Farmer Profile"),
                                    description: t('farmer_profile_desc', `Viewing profile of ${slot.farmerName}. Contact: ${slot.farmerId}`),
                                });
                            }}>
                                <User className="mr-2 h-4 w-4" />
                                {t('view_farmer_profile', "View Farmer Profile")}
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onClick={() => setSelectedSlot(slot)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('delete_permanently', "Delete Permanently")}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
                </Table>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('are_you_sure', "Are you absolutely sure?")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete_booking_confirmation', `This action cannot be undone. This will permanently delete the booking for ${selectedSlot?.farmerName}'s ${selectedSlot?.cropType} and notify them.`)}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedSlot(null)}>{t('cancel', "Cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSlot(selectedSlot)}>
                        {t('yes_delete_it', "Yes, delete it")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
