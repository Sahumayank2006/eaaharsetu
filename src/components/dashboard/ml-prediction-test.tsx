'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMLPrediction } from '@/hooks/use-ml-prediction';
import { Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export function MLPredictionTest() {
  const [temperature, setTemperature] = useState<number>(30);
  const [humidity, setHumidity] = useState<number>(70);
  const [warehouseId, setWarehouseId] = useState<string>('W01');
  const [cropType, setCropType] = useState<string>('wheat');
  
  const { predict, predictViaAPI, prediction, loading, error, reset } = useMLPrediction();

  const handleDirectPredict = async () => {
    try {
      await predict(temperature, humidity, { warehouse_id: warehouseId, crop_type: cropType });
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleAPIPredict = async () => {
    try {
      await predictViaAPI(temperature, humidity, { 
        warehouse_id: warehouseId, 
        crop_type: cropType,
        use_fallback: true 
      });
    } catch (err) {
      console.error('API prediction failed:', err);
    }
  };

  const getSpoilageRisk = () => {
    return prediction?.spoilage_risk || prediction?.prediction || 0;
  };

  const getRiskLevel = (risk: number) => {
    if (risk > 70) return { label: 'Critical', color: 'text-red-600' };
    if (risk > 40) return { label: 'Warning', color: 'text-orange-600' };
    return { label: 'Optimal', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ML Model Prediction Test</h2>
          <p className="text-muted-foreground">
            Test your trained ML model with sensor data
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600/80 shadow-lg shadow-purple-500/20">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                placeholder="30"
                className="rounded-xl border-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(parseFloat(e.target.value))}
                placeholder="70"
                className="rounded-xl border-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse ID</Label>
              <Input
                id="warehouse"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                placeholder="W01"
                className="rounded-xl border-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Type</Label>
              <Input
                id="crop"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="wheat"
                className="rounded-xl border-muted"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleDirectPredict} 
              disabled={loading}
              className="flex-1 rounded-xl shadow-md shadow-primary/20"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Direct ML API Call
            </Button>
            <Button 
              onClick={handleAPIPredict} 
              disabled={loading}
              variant="secondary"
              className="flex-1 rounded-xl"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Via Next.js API (with Fallback)
            </Button>
            <Button 
              onClick={reset} 
              variant="outline"
              disabled={loading}
              className="rounded-xl"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="rounded-xl border-0 shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {prediction && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              Prediction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-xl bg-muted/30">
                <Label className="text-muted-foreground">Spoilage Risk</Label>
                <div className={`text-3xl font-bold ${getRiskLevel(getSpoilageRisk()).color}`}>
                  {getSpoilageRisk().toFixed(1)}%
                </div>
                <div className="text-sm font-medium">
                  {getRiskLevel(getSpoilageRisk()).label}
                </div>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-muted/30">
                <Label className="text-muted-foreground">Status</Label>
                <div className="text-sm font-mono bg-secondary p-2 rounded-lg">
                  {prediction.status || 'success'}
                </div>
                {prediction.timestamp && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {prediction.recommendations && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Recommendations</Label>
                <div className="p-3 bg-secondary rounded-xl text-sm">
                  {prediction.recommendations}
                </div>
              </div>
            )}

            <details className="text-sm">
              <summary className="cursor-pointer font-medium mb-2">
                View Raw Response
              </summary>
              <pre className="bg-secondary p-3 rounded-xl overflow-auto">
                {JSON.stringify(prediction, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
            API Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>ML Model Endpoint:</strong>
            <code className="ml-2 bg-secondary px-2 py-1 rounded-lg">
              http://172.22.40.105:5000/iot/sensor-data
            </code>
          </div>
          <div>
            <strong>Next.js API Route:</strong>
            <code className="ml-2 bg-secondary px-2 py-1 rounded-lg">
              /api/ml-predict
            </code>
          </div>
          <div className="text-muted-foreground">
            The system will automatically fallback to rule-based predictions if the ML model is unavailable.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
