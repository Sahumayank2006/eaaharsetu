"use client";

import { useState, useMemo } from "react";
import { 
  Bell, 
  AlertTriangle, 
  ThermometerSnowflake, 
  ThermometerSun, 
  Droplets, 
  Droplet,
  XCircle,
  CheckCircle,
  Clock,
  Info,
  Loader2,
  Wheat,
  PackageCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertInfo,
  SpoilagePrediction,
  generateAlerts,
  predictShelfLifeImpact,
  SAMPLE_STORAGE_ITEMS,
  SAMPLE_WEATHER_DATA,
  WeatherData,
  StorageItem
} from "@/lib/warehouse-predictions";

interface WarehouseAlertsProps {
  warehouseId: string;
  temperature: number;
  humidity: number;
  refreshing?: boolean;
  onAcknowledge?: (alertId: string) => void;
  className?: string;
}

export function WarehouseAlerts({
  warehouseId = 'W01',
  temperature,
  humidity,
  refreshing = false,
  onAcknowledge,
  className = ""
}: WarehouseAlertsProps) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Get sample weather data
  const weather = useMemo(() => {
    return SAMPLE_WEATHER_DATA[warehouseId] || SAMPLE_WEATHER_DATA.W01;
  }, [warehouseId]);

  // Get sample storage items for this warehouse
  const storageItems = useMemo(() => {
    // In a real app, we'd filter by warehouseId from a database
    return SAMPLE_STORAGE_ITEMS;
  }, []);

  // Generate predictions for items
  const predictions = useMemo(() => {
    return storageItems.map(item => 
      predictShelfLifeImpact(
        item, 
        temperature, 
        humidity,
        weather.forecast
      )
    );
  }, [storageItems, temperature, humidity, weather.forecast]);

  // Generate alerts based on conditions and predictions
  const alerts = useMemo(() => {
    return generateAlerts(warehouseId, temperature, humidity, predictions);
  }, [warehouseId, temperature, humidity, predictions]);

  // Filter out acknowledged alerts
  const activeAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const alertId = `${alert.type}-${alert.timestamp}`;
      return !acknowledgedAlerts.has(alertId);
    });
  }, [alerts, acknowledgedAlerts]);

  // Handle alert acknowledgement
  const handleAcknowledge = (alert: AlertInfo) => {
    const alertId = `${alert.type}-${alert.timestamp}`;
    const newAcknowledged = new Set(acknowledgedAlerts);
    newAcknowledged.add(alertId);
    setAcknowledgedAlerts(newAcknowledged);
    
    if (onAcknowledge) {
      onAcknowledge(alertId);
    }
  };

  // Group alerts by severity for display
  const alertsByPriority = {
    critical: activeAlerts.filter(a => a.severity === 'critical'),
    high: activeAlerts.filter(a => a.severity === 'high'),
    medium: activeAlerts.filter(a => a.severity === 'medium'),
    low: activeAlerts.filter(a => a.severity === 'low'),
  };
  
  // Get alert icon
  const getAlertIcon = (type: AlertInfo['type'], severity: AlertInfo['severity']) => {
    if (type === 'temperature') {
      return severity === 'critical' || severity === 'high' 
        ? <ThermometerSun className="h-5 w-5 text-red-500" /> 
        : <ThermometerSnowflake className="h-5 w-5 text-blue-500" />;
    }
    if (type === 'humidity') {
      return severity === 'critical' || severity === 'high'
        ? <Droplets className="h-5 w-5 text-blue-600" />
        : <Droplet className="h-5 w-5 text-blue-400" />;
    }
    if (type === 'spoilage') {
      return <Wheat className="h-5 w-5 text-amber-500" />;
    }
    if (type === 'weather') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <Info className="h-5 w-5 text-gray-500" />;
  };

  // Get color classes for severity
  const getSeverityClasses = (severity: AlertInfo['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300';
      case 'high':
        return 'bg-orange-50 border-orange-300 text-orange-800 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300';
      case 'medium':
        return 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300';
      case 'low':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300';
      default:
        return 'bg-slate-50 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300';
    }
  };

  return (
    <Card className={`w-full border-0 shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600/80 shadow-lg shadow-red-500/20">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Warehouse Alerts
          </CardTitle>
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="rounded-lg">
              {activeAlerts.length}
            </Badge>
          )}
        </div>
        {refreshing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              No active alerts. All systems operating within normal parameters.
            </p>
          </div>
        ) : (
          <>
            {/* Critical Alerts */}
            {alertsByPriority.critical.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Critical Alerts
                </h3>
                {alertsByPriority.critical.map((alert, i) => (
                  <div 
                    key={`${alert.type}-${i}-${alert.timestamp}`} 
                    className={`p-3 rounded-xl border ${getSeverityClasses(alert.severity)} text-sm`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {getAlertIcon(alert.type, alert.severity)}
                        <div className="ml-2">
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                          
                          {/* Expandable details */}
                          {expandedItem === `${alert.type}-${i}-${alert.timestamp}` && (
                            <div className="mt-2 space-y-2">
                              {alert.suggestedAction && (
                                <p className="text-sm font-medium">
                                  Suggested Action: {alert.suggestedAction}
                                </p>
                              )}
                              
                              {alert.affectedItems && alert.affectedItems.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-sm font-medium mb-1">Affected Items:</p>
                                  <ul className="list-disc list-inside text-xs space-y-1">
                                    {alert.affectedItems.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(alert.timestamp).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedItem(
                            expandedItem === `${alert.type}-${i}-${alert.timestamp}` 
                              ? null 
                              : `${alert.type}-${i}-${alert.timestamp}`
                          )}
                        >
                          {expandedItem === `${alert.type}-${i}-${alert.timestamp}` ? 'Less' : 'More'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleAcknowledge(alert)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* High Alerts */}
            {alertsByPriority.high.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-orange-800 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  High Priority Alerts
                </h3>
                {alertsByPriority.high.map((alert, i) => (
                  <div 
                    key={`${alert.type}-${i}-${alert.timestamp}`} 
                    className={`p-3 rounded-md border ${getSeverityClasses(alert.severity)} text-sm`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {getAlertIcon(alert.type, alert.severity)}
                        <div className="ml-2">
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                          
                          {/* Expandable details */}
                          {expandedItem === `${alert.type}-${i}-${alert.timestamp}` && (
                            <div className="mt-2 space-y-2">
                              {alert.suggestedAction && (
                                <p className="text-sm font-medium">
                                  Suggested Action: {alert.suggestedAction}
                                </p>
                              )}
                              
                              {alert.affectedItems && alert.affectedItems.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-sm font-medium mb-1">Affected Items:</p>
                                  <ul className="list-disc list-inside text-xs space-y-1">
                                    {alert.affectedItems.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(alert.timestamp).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedItem(
                            expandedItem === `${alert.type}-${i}-${alert.timestamp}` 
                              ? null 
                              : `${alert.type}-${i}-${alert.timestamp}`
                          )}
                        >
                          {expandedItem === `${alert.type}-${i}-${alert.timestamp}` ? 'Less' : 'More'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleAcknowledge(alert)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medium Alerts */}
            {alertsByPriority.medium.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-amber-800 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Medium Priority Alerts
                </h3>
                {alertsByPriority.medium.map((alert, i) => (
                  <div 
                    key={`${alert.type}-${i}-${alert.timestamp}`} 
                    className={`p-3 rounded-md border ${getSeverityClasses(alert.severity)} text-sm`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        {getAlertIcon(alert.type, alert.severity)}
                        <div className="ml-2">
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleAcknowledge(alert)}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Spoilage Predictions */}
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <PackageCheck className="h-4 w-4 mr-1 text-blue-600" />
            Shelf Life Predictions
          </h3>
          
          <div className="space-y-3">
            {predictions
              .sort((a, b) => a.currentShelfLife - b.currentShelfLife)
              .map(prediction => (
                <div 
                  key={prediction.itemId} 
                  className="p-3 border rounded-md bg-white"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{prediction.itemName}</div>
                    <Badge 
                      variant={
                        prediction.riskLevel === 'critical' ? 'destructive' :
                        prediction.riskLevel === 'high' ? 'outline' : 
                        prediction.riskLevel === 'medium' ? 'secondary' : 
                        'default'
                      }
                    >
                      {prediction.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <div>{prediction.category}</div>
                    <div>{prediction.currentShelfLife} days remaining</div>
                  </div>
                  
                  <Progress 
                    value={(prediction.currentShelfLife / prediction.originalShelfLife) * 100}
                    className={
                      prediction.riskLevel === 'critical' ? 'text-red-500' :
                      prediction.riskLevel === 'high' ? 'text-orange-500' : 
                      prediction.riskLevel === 'medium' ? 'text-amber-500' : 
                      'text-green-500'
                    }
                  />
                  
                  <p className="text-xs mt-2 text-gray-600">{prediction.recommendation}</p>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}