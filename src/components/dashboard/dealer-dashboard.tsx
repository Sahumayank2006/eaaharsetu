import { CropBrowser } from "./crop-browser";

export default function DealerDashboard() {
  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and purchase surplus crops from farmers across India
        </p>
      </div>
      
      <CropBrowser />
    </div>
  );
}
