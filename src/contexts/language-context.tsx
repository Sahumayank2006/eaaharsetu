
"use client"

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Role } from '@/lib/types';
import { Sprout, ShoppingBag, Warehouse, ShieldCheck, IndianRupee, Leaf, Users, Shield, CircleDot, Cloud, Heart, Tractor, Award, Wheat, UserCheck } from 'lucide-react';
import { translateText } from '@/lib/translate';

// English content is now the source of truth
export const content = {
  en: {
    langName: "English",
    welcome: "Welcome to eAaharSetu",
    tagline: "Transforming Agriculture with a Single Digital Platform",
    chooseRole: "Choose Your Role to Get Started",
    roles: [
      { role: "farmer" as Role, title: "Farmer", titleKey: "farmer", description: "Manage your crops, predict spoilage, and reduce waste.", descriptionKey: "farmer_desc", icon: Sprout },
      { role: "dealer" as Role, title: "Dealer", titleKey: "dealer", description: "Browse surplus crops, place orders, and track deliveries.", descriptionKey: "dealer_desc", icon: ShoppingBag },
      { role: "green-guardian" as Role, title: "Warehouse Manager", titleKey: "green-guardian", description: "Monitor storage, manage inventory, and ensure quality.", descriptionKey: "green-guardian_desc", icon: Warehouse },
      { role: "admin" as Role, title: "Admin", titleKey: "admin", description: "Oversee the platform, manage users, and view analytics.", descriptionKey: "admin_desc", icon: ShieldCheck },
    ],
    continueAs: "Continue as",
    topPerformers: "Top Performers",
    guidelinesTitle: "Standard Guidelines",
    farmer_handbook: "Farmer Handbook",
    dealer_manual: "Dealer Operations Manual",
    warehouse_practices: "Warehouse Best Practices",
    platform_policy: "Platform Usage Policy",
    valueSaved: "Value Saved this year",
    grainsSaved: "Grains Saved",
    peopleFed: "People Fed (Est.)",
    tons: "Tons",
    kg: "kg",
    grainsSavedUnit: "Grains Saved",
    logistics_head: "Logistics Head",
    warehouse_manager: "Warehouse Manager",
    top_farmer: "Top Farmer",
    quality_control_lead: "Quality Control Lead",
    top_dealer: "Top Dealer",
    eco_farmer: "Eco-Farmer",
    logistics_coordinator: "Logistics Coordinator",
    impactStats: [
      { icon: Warehouse, value: "150+", label: "Warehouses Connected", labelKey: "warehouses_connected" },
      { icon: Leaf, value: "5,000+ Tons", label: "Food Saved from Waste", labelKey: "food_saved" },
      { icon: IndianRupee, value: "₹25 Cr+", label: "Value Created for Farmers", labelKey: "value_created" },
      { icon: Users, value: "25,000+", label: "People Fed", labelKey: "people_fed" },
    ],
    footerRights: "All rights reserved.",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Log out",
    language: "Language",
    notifications: "Notifications",
    farmer: "Farmer",
    dealer: "Dealer",
    "green-guardian": "Warehouse Manager",
    logistics: "Logistics",
    admin: "Admin",
    dashboard_overview: "Dashboard Overview",
    slot_history: "Slot History",
    your_bookings: "Your Bookings",
    your_bookings_desc: "A list of all your warehouse bookings.",
    warehouse: "Warehouse",
    crop_type: "Crop Type",
    quantity: "Quantity",
    booking_date: "Booking Date",
    status: "Status",
    completed: "Completed",
    upcoming: "Upcoming",
    cancelled: "Cancelled",
    no_bookings_found: "No bookings found.",
    no_bookings_desc: "You haven't booked any warehouse slots yet.",
    marketplace: "Marketplace",
    my_orders: "My Orders",
    warehouse_overview: "Warehouse Overview",
    inventory: "Inventory",
    slot_management: "Slot Management",
    alerts: "Alerts",
    analytics: "Analytics",
    logistics_overview: "Logistics Overview",
    route_optimization: "Route Optimization",
    delivery_tracking: "Delivery Tracking",
    overview: "Overview",
    user_management: "User Management",
    transactions: "Transactions",
    platform_analytics: "Platform Analytics",
    show_all: "Show All",
    show_less: "Show Less",
    are_you_sure: "Are you absolutely sure?",
    delete_booking_confirmation: "This action cannot be undone. This will permanently delete the booking for {farmerName}'s {cropType} and notify them.",
    cancel: "Cancel",
    yes_delete_it: "Yes, delete it",
    new_slot_booked: "New Slot Booked!",
    new_slot_booked_desc: "A farmer has booked a slot. Kindly check.",
    booking_status_title: "Booking {status}!",
    booking_status_desc: "Your booking for {quantity} {unit} of {cropType} has been {status}.",
    slot_updated: "Slot Updated",
    slot_updated_desc: "Booking {id} has been marked as {status}.",
    update_failed: "Update Failed",
    update_failed_desc: "Could not update the slot status. Please try again.",
    booking_deleted_title: "Booking Deleted by Warehouse",
    booking_deleted_desc: "Your booking for {quantity} {unit} of {cropType} on {date} has been removed by the warehouse manager.",
    slot_deleted: "Slot Deleted",
    slot_deleted_desc: "Booking {id} has been permanently deleted.",
    deletion_failed: "Deletion Failed",
    deletion_failed_desc: "Could not delete the slot. Please try again.",
    upcoming_slot_bookings: "Upcoming Slot Bookings",
    upcoming_slot_bookings_desc: "Review and manage scheduled drop-offs from farmers.",
    farmer_profile: "Farmer Profile",
    actions: "Actions",
    accept: "Accept",
    reject: "Reject",
    view_farmer_profile: "View Farmer Profile",
    delete_permanently: "Delete Permanently",
    accepted: "Accepted",
    rejected: "Rejected",
    book_warehouse_slot_title: "Book a Warehouse Slot",
    book_warehouse_slot_desc: "Fill in the details to reserve your spot at a selected warehouse.",
    select_warehouse: "Select Warehouse*",
    warehouse_placeholder: "Choose a warehouse from the list...",
    warehouse1: "Gwalior Central Warehousing (5km away)",
    warehouse2: "Malwa Agri Storage, Gwalior (8km away)",
    warehouse3: "Chambal Cold Storage, Morena (40km away)",
    select_crop: "Select Crop*",
    rice: "Rice",
    wheat: "Wheat",
    maize: "Maize",
    loose_quantity: "Loose Quantity",
    jute_bags: "No. of Jute Bags",
    quintal: "Quintal",
    ton: "Ton",
    pick_date: "Pick a date",
    confirm_booking: "Confirm Booking",
    booking_success_title: "Slot Booked Successfully!",
    booking_generated_desc: "Slot has been generated",
    booking_error_title: "Booking Failed",
    booking_error_desc: "Could not save your booking. Please try again.",
    nearest_warehouses: "Nearest Warehouses",
    nearest_warehouses_desc: "Find available storage facilities near your farm location.",
    available: "Available",
    limited_slots: "Limited Slots",
    full: "Full",
    approx: "Approx.",
    away: "away",
    book_slot: "Book Slot",
    warehouse_slot_booking: "Warehouse Slot Booking",
    warehouse_slot_booking_desc: "Schedule a time to drop off your produce at a nearby warehouse to ensure space and reduce wait times.",
    slot_booking_cta: "Click the button below to find a warehouse and book your slot.",
    book_new_slot: "Book a New Slot",
    total_inventory: "Total Inventory",
    across_categories: "Across 3 categories",
    avg_temp: "Avg. Temperature",
    range: "range",
    low: "Low",
    high: "High",
    optimal: "Optimal",
    avg_humidity: "Avg. Humidity",
    conditions: "conditions",
    stable: "Stable",
    local_temp: "Local Temperature",
    updated_5_min_ago: "Updated 5 min ago",
    warehouse_alerts: "Warehouse Alerts",
    active: "Active",
    critical_alerts: "Critical alerts",
    sensor_dashboard_title: "Real-time Sensor Dashboard",
    sensor_dashboard_desc: "Temperature and humidity over last 12 hours from IoT sensors",
    refresh: "Refresh",
    temperature: "Temperature",
    humidity: "Humidity",
    no_sensor_data: "No sensor data available",
    stock_level_tracker: "Stock Level Tracker",
    stock_level_desc: "Current, incoming, and outgoing stock levels by category",
    'in_stock_(kg)': "In Stock (kg)",
    'incoming_(kg)': "Incoming (kg)",
    'outgoing_(kg)': "Outgoing (kg)",
    live_iot_dashboard: "Live IoT Dashboard",
    live_iot_desc: "Real-time Node-RED dashboard with live sensor feeds and controls",
    open_full: "Open Full",
    live: "LIVE",
    offline: "OFFLINE",
    retry: "Retry",
    sensor_data_error: "Failed to load sensor data",
    farmer_desc: "Manage your crops, predict spoilage, and reduce waste.",
    dealer_desc: "Browse surplus crops, place orders, and track deliveries.",
    "green-guardian_desc": "Monitor storage, manage inventory, and ensure quality.",
    admin_desc: "Oversee the platform, manage users, and view analytics.",
    warehouses_connected: "Warehouses Connected",
    food_saved: "Food Saved from Waste",
    value_created: "Value Created for Farmers",
    people_fed: "People Fed",
    dealer_approvals: "Dealer Approvals",
  },
  hi: { langName: "हिंदी" },
  bn: { langName: "বাংলা" },
  te: { langName: "తెలుగు" },
  mr: { langName: "मराठी" },
  ta: { langName: "தமிழ்" },
};

export type LangKey = keyof typeof content;

type Translations = { [key: string]: string | any };

interface LanguageContextType {
    lang: LangKey;
    setLang: (lang: LangKey) => void;
    t: (key: string, defaultValue: string) => string;
    loading: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (_key, defaultValue) => defaultValue,
    loading: false,
});

const flattenObject = (obj: any, prefix = ''): {[key: string]: string} => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else if (typeof obj[k] === 'string') {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {} as {[key: string]: string});
};


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<LangKey>('en');
    const [translations, setTranslations] = useState<Translations>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const classes = ['lang-en', 'lang-hi', 'lang-bn', 'lang-te', 'lang-ta', 'lang-mr'];
        document.body.classList.remove(...classes);
        document.body.classList.add(`lang-${lang}`);

        if (lang === 'en') {
            setTranslations({});
            setLoading(false);
            return;
        }

        const translateContent = async () => {
            setLoading(true);
            try {
                const sourceContent = content.en;
                const flatContent = flattenObject(sourceContent);
                const textsToTranslate = Object.values(flatContent);
                
                // This is a simplified approach; a real implementation would batch these.
                const translatedTexts = await Promise.all(
                    textsToTranslate.map(text => translateText(text, lang))
                );

                const newTranslations: Translations = {};
                Object.keys(flatContent).forEach((key, index) => {
                    newTranslations[key] = translatedTexts[index];
                });
                
                setTranslations(newTranslations);

            } catch (error) {
                console.error("Translation failed:", error);
            } finally {
                setLoading(false);
            }
        };

        translateContent();
    }, [lang]);

    const t = useCallback((key: string, defaultValue: string): string => {
        if (lang === 'en' || loading) {
            return defaultValue;
        }
        return translations[key] || defaultValue;
    }, [lang, translations, loading]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};
