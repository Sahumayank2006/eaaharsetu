"use client";

import { useState, useEffect } from "react";
import { Settings, Bell, Mail, MessageSquare, Thermometer, Droplets, Package, Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  slotAlerts: boolean;
  temperatureAlerts: boolean;
  humidityAlerts: boolean;
  inventoryAlerts: boolean;
}

const WAREHOUSE_MANAGER_ID = "warehouse-manager-001";

export default function WarehouseSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    slotAlerts: true,
    temperatureAlerts: true,
    humidityAlerts: true,
    inventoryAlerts: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/warehouse-manager/settings?managerId=${WAREHOUSE_MANAGER_ID}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Settings",
          description: "Could not load your notification settings.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      // Optimistic update
      setSettings(prev => ({ ...prev, [key]: value }));

      const response = await fetch('/api/warehouse-manager/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          managerId: WAREHOUSE_MANAGER_ID,
          setting: key,
          value,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Revert on error
        setSettings(prev => ({ ...prev, [key]: !value }));
        throw new Error(result.error);
      }

      toast({
        title: "Setting Updated",
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error("Error updating setting:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the setting. Please try again.",
      });
    }
  };

  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/warehouse-manager/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          managerId: WAREHOUSE_MANAGER_ID,
          settings,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Settings Saved",
          description: "All notification settings have been saved successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
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
      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Communication Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates and alerts via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts and urgent notifications via SMS
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(value) => handleSettingChange('smsNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Preferences
          </CardTitle>
          <CardDescription>
            Configure specific types of alerts you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Slot Booking Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when farmers book new warehouse slots
              </p>
            </div>
            <Switch
              checked={settings.slotAlerts}
              onCheckedChange={(value) => handleSettingChange('slotAlerts', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert when warehouse temperature goes outside optimal range (15-25°C)
              </p>
            </div>
            <Switch
              checked={settings.temperatureAlerts}
              onCheckedChange={(value) => handleSettingChange('temperatureAlerts', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Humidity Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert when warehouse humidity goes outside stable range (45-75%)
              </p>
            </div>
            <Switch
              checked={settings.humidityAlerts}
              onCheckedChange={(value) => handleSettingChange('humidityAlerts', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert for low stock levels and significant inventory changes
              </p>
            </div>
            <Switch
              checked={settings.inventoryAlerts}
              onCheckedChange={(value) => handleSettingChange('inventoryAlerts', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button 
              size="lg" 
              onClick={saveAllSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save All Settings
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
