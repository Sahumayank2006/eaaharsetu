
"use client";

import React, { useMemo } from "react";
import {
	MapContainer,
	TileLayer,
	CircleMarker,
	Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

type WarehousePoint = {
	id: string;
	name: string;
	state: string;
	lat: number;
	lng: number;
	capacity: number; // tons (demo)
};

const stateSeeds: Array<{ state: string; lat: number; lng: number }> = [
	{ state: "Jammu & Kashmir", lat: 33.5, lng: 75.0 },
	{ state: "Himachal Pradesh", lat: 31.1, lng: 77.2 },
	{ state: "Punjab", lat: 31.2, lng: 75.3 },
	{ state: "Uttarakhand", lat: 30.3, lng: 79.1 },
	{ state: "Haryana", lat: 29.0, lng: 76.0 },
	{ state: "Delhi", lat: 28.6, lng: 77.2 },
	{ state: "Rajasthan", lat: 26.9, lng: 75.8 },
	{ state: "Uttar Pradesh", lat: 26.8, lng: 80.9 },
	{ state: "Bihar", lat: 25.6, lng: 85.1 },
	{ state: "Jharkhand", lat: 23.6, lng: 85.3 },
	{ state: "West Bengal", lat: 22.6, lng: 88.4 },
	{ state: "Sikkim", lat: 27.5, lng: 88.5 },
	{ state: "Assam", lat: 26.2, lng: 91.7 },
	{ state: "Meghalaya", lat: 25.6, lng: 91.9 },
	{ state: "Nagaland", lat: 26.1, lng: 94.1 },
	{ state: "Manipur", lat: 24.8, lng: 93.9 },
	{ state: "Mizoram", lat: 23.7, lng: 92.7 },
	{ state: "Tripura", lat: 23.8, lng: 91.3 },
	{ state: "Arunachal Pradesh", lat: 27.1, lng: 93.6 },
	{ state: "Madhya Pradesh", lat: 23.3, lng: 77.4 },
	{ state: "Gujarat", lat: 23.0, lng: 72.6 },
	{ state: "Maharashtra", lat: 19.0, lng: 73.0 },
	{ state: "Goa", lat: 15.5, lng: 74.0 },
	{ state: "Karnataka", lat: 13.0, lng: 77.6 },
	{ state: "Kerala", lat: 10.5, lng: 76.2 },
	{ state: "Tamil Nadu", lat: 13.1, lng: 80.3 },
	{ state: "Telangana", lat: 17.4, lng: 78.5 },
	{ state: "Andhra Pradesh", lat: 16.5, lng: 80.6 },
	{ state: "Odisha", lat: 20.3, lng: 85.8 },
	{ state: "Chhattisgarh", lat: 21.2, lng: 81.6 },
	{ state: "Puducherry", lat: 11.9, lng: 79.8 },
	{ state: "Ladakh", lat: 34.2, lng: 77.6 },
	{ state: "Andaman & Nicobar", lat: 11.67, lng: 92.74 },
	{ state: "Lakshadweep", lat: 10.57, lng: 72.64 },
	{ state: "Chandigarh", lat: 30.74, lng: 76.79 },
	{ state: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.3, lng: 72.9 },
];

function seededRandom(seed: number) {
	let t = seed >>> 0;
	return function () {
		t = (t + 0x6d2b79f5) >>> 0;
		let x = Math.imul(t ^ (t >>> 15), 1 | t);
		x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
		return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
	};
}

export default function IndiaWarehouseMap() {
	const warehouses: WarehousePoint[] = useMemo(() => {
		const rnd = seededRandom(42);
		const pts: WarehousePoint[] = [];
		let id = 1;
		for (const s of stateSeeds) {
			const count = 2 + Math.floor(rnd() * 4); // 2..5 per state
			for (let i = 0; i < count; i++) {
				const jitterLat = (rnd() - 0.5) * 1.0; // ±0.5°
				const jitterLng = (rnd() - 0.5) * 1.0; // ±0.5°
				pts.push({
					id: `W${String(id).padStart(3, "0")}`,
					name: `Warehouse ${String(id).padStart(3, "0")}`,
					state: s.state,
					lat: s.lat + jitterLat,
					lng: s.lng + jitterLng,
					capacity: Math.floor(50 + rnd() * 950),
				});
				id++;
			}
		}
		return pts.slice(0, Math.max(100, pts.length));
	}, []);

	return (
		<Card className="hover:shadow-md transition-shadow overflow-hidden">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
				<div className="space-y-1">
					<CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Warehouse className="h-5 w-5 text-primary" />
						Our Warehouse Network (Demo)
					</CardTitle>
					<CardDescription className="text-sm text-gray-600">
						Interactive map of India showing current warehouse locations
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<div className="w-full h-[360px] rounded-lg overflow-hidden border">
						<MapContainer
							center={[22.5, 79]}
							zoom={5}
							minZoom={4}
							maxZoom={12}
							scrollWheelZoom={false}
							className="h-full w-full"
					 >
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png"
							/>
							{warehouses.map((w) => (
								<CircleMarker
									key={w.id}
									center={[w.lat, w.lng]}
									radius={5}
									pathOptions={{
										color: "hsl(142, 71%, 45%)",
										fillColor: "hsl(142, 71%, 45%)",
										fillOpacity: 0.85,
									}}
							 >
									<Tooltip direction="top" offset={[0, -6]} opacity={1} className="text-xs">
										<div className="text-xs">
											<div className="font-medium">{w.name}</div>
											<div className="text-muted-foreground">{w.state}</div>
											<div className="text-muted-foreground">Capacity: {w.capacity} tons</div>
										</div>
									</Tooltip>
								</CircleMarker>
							))}
						</MapContainer>
				</div>
			</CardContent>
		</Card>
	);
}
