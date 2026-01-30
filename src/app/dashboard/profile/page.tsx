
"use client";

import { ProfileManagement } from "@/components/dashboard/profile-management";
import { FarmerProfileForm } from "@/components/dashboard/farmer-profile-form";
import { WarehouseManagerProfileForm } from "@/components/dashboard/warehouse-manager-profile-form";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "admin";

  // For admin role, show the comprehensive profile management
  if (role === "admin") {
    return (
      <div className="w-full p-6">
        <ProfileManagement />
      </div>
    );
  }

  // For other roles, show their specific profile forms
  const getProfileContent = () => {
    switch (role) {
      case "green-guardian":
        return <WarehouseManagerProfileForm />;
      case "farmer":
      default:
        return <FarmerProfileForm />;
    }
  };

  return (
    <div className="space-y-6">
      {getProfileContent()}
    </div>
  );
}
