"use client";

import React, { useEffect, useState, useRef } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

const ADAFRUIT_USERNAME = "sillypari";
const API_BASE = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}`;
const REFRESH_INTERVAL = 30000; // 30s

const GAUGE_RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function strokeOffsetFor(value: number, min: number, max: number) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return CIRCUMFERENCE - pct * CIRCUMFERENCE;
}

async function fetchLast(feedKey: string) {
  const res = await fetch(`${API_BASE}/feeds/${feedKey}/data/last`);
  if (!res.ok) throw new Error(`API ${feedKey} ${res.status}`);
  const json = await res.json();
  return {
    value: Number(json.value),
    timestamp: json.created_at,
  };
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Gauges</h3>
        <div className="flex items-center space-x-3">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
          <button onClick={updateFromFeed} title="Refresh" className="inline-flex items-center px-3 py-1 rounded-md border text-sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Temperature (°C)</div>
            <div className="flex items-center justify-center">
              <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
                <defs>
                  <linearGradient id="gTemp" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#FFD93D" />
                    <stop offset="50%" stopColor="#FF9234" />
                    <stop offset="100%" stopColor="#FF6B6B" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={GAUGE_RADIUS} strokeWidth="18" stroke="#eef2f7" fill="none" />
                <circle
                  cx="100" cy="100" r={GAUGE_RADIUS}
                  strokeWidth="18"
                  stroke="url(#gTemp)"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${temp !== null ? strokeOffsetFor(temp, 0, 50) : CIRCUMFERENCE}`}
                  fill="none"
                />
              </svg>
            </div>
            <div className="text-center mt-2">
              <div className="text-4xl font-bold text-red-600">{temp !== null ? temp.toFixed(1) : '--'}</div>
              <div className="text-sm text-gray-500">Last updated: {lastUpdated ?? '—'}</div>
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <div>Min: <span className="font-semibold">{tempMin !== null ? tempMin.toFixed(1) : '—'}</span></div>
                <div>Max: <span className="font-semibold">{tempMax !== null ? tempMax.toFixed(1) : '—'}</span></div>
              </div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Humidity (%)</div>
            <div className="flex items-center justify-center">
              <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
                <defs>
                  <linearGradient id="gHum" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#48CAE4" />
                    <stop offset="50%" stopColor="#00B4D8" />
                    <stop offset="100%" stopColor="#0077B6" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={GAUGE_RADIUS} strokeWidth="18" stroke="#eef2f7" fill="none" />
                <circle
                  cx="100" cy="100" r={GAUGE_RADIUS}
                  strokeWidth="18"
                  stroke="url(#gHum)"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={`${hum !== null ? strokeOffsetFor(hum, 0, 100) : CIRCUMFERENCE}`}
                  fill="none"
                />
              </svg>
            </div>
            <div className="text-center mt-2">
              <div className="text-4xl font-bold text-sky-600">{hum !== null ? hum.toFixed(1) : '--'}</div>
              <div className="text-sm text-gray-500">Last updated: {lastUpdated ?? '—'}</div>
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <div>Min: <span className="font-semibold">{humMin !== null ? humMin.toFixed(1) : '—'}</span></div>
                <div>Max: <span className="font-semibold">{humMax !== null ? humMax.toFixed(1) : '—'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
