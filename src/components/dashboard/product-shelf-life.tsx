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
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              Product Shelf Life
            </CardTitle>
            <CardDescription>
              Predicted remaining lifetime for stored products
            </CardDescription>
          </div>
          
          <Select value={filter} onValueChange={(value) => 
            setFilter(value as "all" | "critical" | "high" | "medium" | "low")
          }>
            <SelectTrigger className="w-[110px]">
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
            <Skeleton className="h-24 w-full" />
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
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
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
    <div className={`p-3 rounded-md border ${getRiskColor(prediction.riskLevel)}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{prediction.itemName}</div>
          <div className="text-xs opacity-80">{prediction.category}</div>
        </div>
        
        <Badge 
          variant={
            prediction.riskLevel === 'critical' ? 'destructive' :
            prediction.riskLevel === 'high' ? 'outline' : 
            'secondary'
          }
        >
          {prediction.riskLevel}
        </Badge>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Shelf life remaining</span>
          <span className={isCloseToExpiry ? 'text-red-600 font-medium' : ''}>
            {prediction.currentShelfLife} days
          </span>
        </div>
        
        <Progress 
          value={percentRemaining} 
          className={
            prediction.riskLevel === 'critical' ? 'text-red-500' : 
            prediction.riskLevel === 'high' ? 'text-orange-500' : 
            prediction.riskLevel === 'medium' ? 'text-yellow-500' : 
            'text-green-500'
          }
        />
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-left">
          <span>Initial: {prediction.originalShelfLife} days</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs h-7 px-2"
        >
          {showDetails ? 'Less' : 'More'}
        </Button>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-xs">
          <div className="p-2 rounded bg-white bg-opacity-50">
            <p className="font-medium mb-1">Recommendation:</p>
            <p>{prediction.recommendation}</p>
            
            {prediction.affectedByTemperature && (
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                <span>Temperature conditions affecting shelf life</span>
              </div>
            )}
            
            {prediction.affectedByHumidity && (
              <div className="flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                <span>Humidity conditions affecting shelf life</span>
              </div>
            )}
            
            {prediction.affectedByWeather && (
              <div className="flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                <span>Weather forecast may further impact shelf life</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}