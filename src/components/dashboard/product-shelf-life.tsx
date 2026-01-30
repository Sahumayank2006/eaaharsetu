"use client";

import { useState } from "react";
import { Clock, AlertTriangle, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpoilagePrediction } from "@/lib/warehouse-predictions";
import { useWarehousePredictions } from "@/hooks/use-warehouse-predictions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductShelfLifeProps {
  warehouseId: string;
  temperature: number;
  humidity: number;
  className?: string;
}

export function ProductShelfLife({ 
  warehouseId, 
  temperature, 
  humidity,
  className = "" 
}: ProductShelfLifeProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  
  const { predictions, isLoading, error } = useWarehousePredictions(
    warehouseId,
    temperature,
    humidity
  );
  
  // Filter predictions based on user selection
  const filteredPredictions = predictions.filter(pred => {
    if (filter === "all") return true;
    return pred.riskLevel === filter;
  });
  
  // Sort predictions: critical first, then by days remaining
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    
    if (riskDiff !== 0) return riskDiff;
    return a.currentShelfLife - b.currentShelfLife;
  });
  
  // Count by risk level
  const counts = {
    critical: predictions.filter(p => p.riskLevel === "critical").length,
    high: predictions.filter(p => p.riskLevel === "high").length,
    medium: predictions.filter(p => p.riskLevel === "medium").length,
    low: predictions.filter(p => p.riskLevel === "low").length,
  };

  return (
    <Card className={`border-0 shadow-md ${className}`}>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              Product Shelf Life
            </CardTitle>
            <CardDescription className="mt-2">
              Predicted remaining lifetime for stored products
            </CardDescription>
          </div>
          
          <Select value={filter} onValueChange={(value) => 
            setFilter(value as "all" | "critical" | "high" | "medium" | "low")
          }>
            <SelectTrigger className="w-[110px] rounded-xl border-muted">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({predictions.length})</SelectItem>
              <SelectItem value="critical" className="text-red-500">
                Critical ({counts.critical})
              </SelectItem>
              <SelectItem value="high" className="text-orange-500">
                High ({counts.high})
              </SelectItem>
              <SelectItem value="medium" className="text-yellow-500">
                Medium ({counts.medium})
              </SelectItem>
              <SelectItem value="low" className="text-green-500">
                Low ({counts.low})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Unable to load predictions
          </div>
        ) : sortedPredictions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No products match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {sortedPredictions.map((prediction) => (
              <ProductShelfLifeCard 
                key={prediction.itemId} 
                prediction={prediction} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProductShelfLifeCardProps {
  prediction: SpoilagePrediction;
}

function ProductShelfLifeCard({ prediction }: ProductShelfLifeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get color based on risk level
  const getRiskColor = (risk: SpoilagePrediction['riskLevel']) => {
    switch (risk) {
      case 'critical': return 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800';
    }
  };
  
  // Calculate the percentage of shelf life remaining
  const percentRemaining = Math.max(
    0, 
    Math.min(
      100, 
      Math.round((prediction.currentShelfLife / prediction.originalShelfLife) * 100)
    )
  );
  
  // Determine if close to expiry
  const isCloseToExpiry = prediction.currentShelfLife <= 14; // Two weeks or less
  
  return (
    <div className={`p-4 rounded-xl border ${getRiskColor(prediction.riskLevel)} transition-all hover:shadow-sm`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">{prediction.itemName}</div>
          <div className="text-xs text-muted-foreground">{prediction.category}</div>
        </div>
        
        <Badge 
          className={`rounded-lg ${
            prediction.riskLevel === 'critical' ? 'bg-red-500 hover:bg-red-600' :
            prediction.riskLevel === 'high' ? 'bg-orange-500 hover:bg-orange-600' : 
            prediction.riskLevel === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-green-500 hover:bg-green-600'
          }`}
        >
          {prediction.riskLevel}
        </Badge>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Shelf life remaining</span>
          <span className={isCloseToExpiry ? 'text-red-600 font-semibold' : 'font-medium'}>
            {prediction.currentShelfLife} days
          </span>
        </div>
        
        <Progress 
          value={percentRemaining} 
          className="h-2"
        />
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <span>Initial: {prediction.originalShelfLife} days</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs h-7 px-2 rounded-lg"
        >
          {showDetails ? 'Less' : 'More'}
        </Button>
      </div>
      
      {showDetails && (
        <div className="mt-3 text-xs">
          <div className="p-3 rounded-lg bg-background/60">
            <p className="font-semibold mb-1">Recommendation:</p>
            <p className="text-muted-foreground">{prediction.recommendation}</p>
            
            {prediction.affectedByTemperature && (
              <div className="flex items-center mt-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Temperature conditions affecting shelf life</span>
              </div>
            )}
            
            {prediction.affectedByHumidity && (
              <div className="flex items-center mt-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Humidity conditions affecting shelf life</span>
              </div>
            )}
            
            {prediction.affectedByWeather && (
              <div className="flex items-center mt-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Weather forecast may further impact shelf life</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}