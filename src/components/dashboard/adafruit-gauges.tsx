"use client";

import React, { useEffect, useState, useRef } from "react";
import { RefreshCw, WifiOff, Wifi, Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";

const ADAFRUIT_USERNAME = process.env.NEXT_PUBLIC_ADAFRUIT_USERNAME || "sillypari";
const ADAFRUIT_API_KEY = process.env.NEXT_PUBLIC_ADAFRUIT_IO_KEY || "";
const API_BASE = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}`;
const REFRESH_INTERVAL = 30000; // 30s

const GAUGE_RADIUS = 70;
const GAUGE_STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function strokeOffsetFor(value: number, min: number, max: number) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return CIRCUMFERENCE - pct * CIRCUMFERENCE;
}

async function fetchLast(feedKey: string) {
  const res = await fetch(`${API_BASE}/feeds/${feedKey}/data/last`, {
    headers: {
      'X-AIO-Key': ADAFRUIT_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${feedKey} ${res.status}: ${errorText}`);
  }
  const json = await res.json();
  return {
    value: Number(json.value),
    timestamp: json.created_at,
  };
}

// Modern Gauge Component
function ModernGauge({ 
  value, 
  min, 
  max, 
  unit, 
  label, 
  gradientId, 
  gradientColors, 
  icon: Icon,
  accentColor,
  minValue,
  maxValue,
  lastUpdated
}: { 
  value: number | null; 
  min: number; 
  max: number; 
  unit: string; 
  label: string;
  gradientId: string;
  gradientColors: { start: string; mid: string; end: string };
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  minValue: number | null;
  maxValue: number | null;
  lastUpdated: string | null;
}) {
  const displayValue = value !== null ? value.toFixed(1) : '--';
  const strokeOffset = value !== null ? strokeOffsetFor(value, min, max) : CIRCUMFERENCE;
  const percentage = value !== null ? Math.round(((value - min) / (max - min)) * 100) : 0;

  return (
    <div className="relative group">
      {/* Card with glassmorphism effect */}
      <div className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        {/* Decorative background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-5 rounded-2xl`} />
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${accentColor} shadow-lg`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </div>
          <div className="text-xs text-gray-400 font-medium">{percentage}%</div>
        </div>

        {/* Gauge Container */}
        <div className="relative flex items-center justify-center py-4">
          {/* Outer glow ring */}
          <div className={`absolute w-40 h-40 rounded-full bg-gradient-to-br ${accentColor} opacity-10 blur-xl animate-pulse`} />
          
          {/* SVG Gauge */}
          <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors.start} />
                <stop offset="50%" stopColor={gradientColors.mid} />
                <stop offset="100%" stopColor={gradientColors.end} />
              </linearGradient>
              <filter id={`${gradientId}-glow`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Background track */}
            <circle 
              cx="80" cy="80" r={GAUGE_RADIUS} 
              strokeWidth={GAUGE_STROKE} 
              stroke="#e5e7eb" 
              fill="none"
              opacity="0.5"
            />
            
            {/* Progress arc with glow */}
            <circle
              cx="80" cy="80" r={GAUGE_RADIUS}
              strokeWidth={GAUGE_STROKE}
              stroke={`url(#${gradientId})`}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              fill="none"
              filter={`url(#${gradientId}-glow)`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {displayValue}
            </span>
            <span className="text-sm font-medium text-gray-500">{unit}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/50">
            <TrendingDown className="h-3 w-3 text-blue-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Min</div>
              <div className="text-sm font-bold text-gray-700">
                {minValue !== null ? minValue.toFixed(1) : '—'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50/50">
            <TrendingUp className="h-3 w-3 text-red-500" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Max</div>
              <div className="text-sm font-bold text-gray-700">
                {maxValue !== null ? maxValue.toFixed(1) : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Last updated */}
        <div className="relative text-center mt-3">
          <span className="text-[10px] text-gray-400">
            Updated: {lastUpdated ?? '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdafruitGauges() {
  const [temp, setTemp] = useState<number | null>(null);
  const [hum, setHum] = useState<number | null>(null);
  const [tempMin, setTempMin] = useState<number | null>(null);
  const [tempMax, setTempMax] = useState<number | null>(null);
  const [humMin, setHumMin] = useState<number | null>(null);
  const [humMax, setHumMax] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const updateFromFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [t, h] = await Promise.all([
        fetchLast("temperature"),
        fetchLast("humidity"),
      ]);

      if (!mounted.current) return;

      setTemp(Number.isFinite(t.value) ? t.value : null);
      setHum(Number.isFinite(h.value) ? h.value : null);
      setLastUpdated(new Date(t.timestamp || h.timestamp).toLocaleString());

      setTempMin(prev => (prev === null ? t.value : Math.min(prev, t.value)));
      setTempMax(prev => (prev === null ? t.value : Math.max(prev, t.value)));
      setHumMin(prev => (prev === null ? h.value : Math.min(prev, h.value)));
      setHumMax(prev => (prev === null ? h.value : Math.max(prev, h.value)));

      const timeDiff = Date.now() - new Date(t.timestamp).getTime();
      setIsOnline(timeDiff < 120000);
    } catch (err: any) {
      console.error(err);
      if (!mounted.current) return;
      setError(String(err?.message || err));
      setIsOnline(false);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    updateFromFeed();
    const id = setInterval(updateFromFeed, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Live Gauges</h3>
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-300 shadow-sm
            ${isOnline 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200' 
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-200'
            }
          `}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Online' : 'Offline'}
            {isOnline && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
          </div>
          
          {/* Refresh Button */}
          <button 
            onClick={updateFromFeed} 
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-xl border border-red-100 shadow-sm">
          <span className="font-medium">Error:</span> {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature Gauge */}
          <ModernGauge
            value={temp}
            min={0}
            max={50}
            unit="°C"
            label="Temperature"
            gradientId="tempGradient"
            gradientColors={{ start: "#fbbf24", mid: "#f97316", end: "#ef4444" }}
            icon={Thermometer}
            accentColor="from-orange-500 to-red-500"
            minValue={tempMin}
            maxValue={tempMax}
            lastUpdated={lastUpdated}
          />

          {/* Humidity Gauge */}
          <ModernGauge
            value={hum}
            min={0}
            max={100}
            unit="%"
            label="Humidity"
            gradientId="humGradient"
            gradientColors={{ start: "#22d3ee", mid: "#0ea5e9", end: "#0369a1" }}
            icon={Droplets}
            accentColor="from-cyan-500 to-blue-500"
            minValue={humMin}
            maxValue={humMax}
            lastUpdated={lastUpdated}
          />
        </div>
      )}
    </div>
  );
}
