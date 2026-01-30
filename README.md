# AaharSetu - Agricultural Market Platform

An integrated agricultural marketplace platform connecting farmers, dealers, logistics providers, and warehouse managers through sustainable food systems.

## Features

- **Multi-Role Dashboard System**: Specialized interfaces for farmers, dealers, logistics, warehouse managers, and green guardians
- **Crop Management**: Upload, browse, and manage agricultural produce
- **Logistics Integration**: Route optimization and delivery tracking
- **Financial Services**: Integrated payment and financial advisory systems
- **Real-time Analytics**: Live data insights and performance metrics
- **IoT Sensor Integration**: Real-time environmental monitoring for warehouses

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Backend**: Next.js API routes
- **Database**: Firebase
- **IoT Integration**: Node-RED, ESP32/DHT sensors
- **Charts**: Recharts for data visualization

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## IoT Sensor Integration

### Overview
This system integrates real IoT sensor data from ESP32/DHT sensors via Node-RED into the warehouse management dashboard, providing real-time environmental monitoring.

### Features Implemented

#### 1. **Real-time Data Display**
- Live temperature and humidity averages calculated from CSV data
- Dynamic status indicators (Optimal/High/Low ranges)
- Auto-refresh every 30 seconds

#### 2. **Interactive Charts**
- Temperature and humidity trends over last 12 hours
- Dual Y-axis charts for better visualization 
- Real-time data updates

#### 3. **Node-RED Dashboard Integration**
- Embedded iframe showing Node-RED dashboard
- Direct link to full dashboard in new tab
- Live indicator showing real-time status

### Current Real-time Data (Live from ESP32/DHT Sensors)
- **Avg. Temperature**: **25.2°C** (Optimal range)
- **Avg. Humidity**: **60.5%** (Stable conditions)
- **Total Sensor Readings**: 2066 (continuously updated)
- **Temperature Range**: 21.6°C - 31.4°C
- **Humidity Range**: 48.9% - 68.6%

### File Structure

```
src/
├── lib/
│   └── sensor-data.ts          # Utilities for CSV parsing and calculations
├── hooks/
│   └── use-sensor-data.ts      # React hook for fetching sensor data
├── app/
│   └── api/
│       └── sensor-data/
│           └── route.ts        # API endpoint for serving sensor data
└── components/
    └── dashboard/
        └── green-guardian-dashboard.tsx  # Updated warehouse dashboard
```

### Setup Instructions

#### 1. **Update CSV File Path**
Edit `src/app/api/sensor-data/route.ts` and change the path to your actual CSV file:

```typescript
const SENSOR_DATA_PATH = 'c:\\Users\\Parikshit\\Desktop\\PyGames\\IOT\\SensorData\\W01.csv';
```

#### 2. **CSV File Format**
Ensure your CSV file follows this format:
```csv
timestamp,temperature,humidity,warehouse_id
2024-09-13T00:00:00Z,18.5,65.2,W01
2024-09-13T00:30:00Z,18.3,65.8,W01
...
```

#### 3. **Node-RED Dashboard URL**
Update the iframe URL in `green-guardian-dashboard.tsx` if your Node-RED URL is different:
```typescript
src="http://127.0.0.1:1880/ui/#!/0?socketid=YOUR_SOCKET_ID"
```

### API Endpoints

#### `/api/sensor-data?type=stats`
Returns calculated statistics:
```json
{
  "success": true,
  "data": {
    "avgTemperature": 25.2,
    "avgHumidity": 60.5,
    "minTemperature": 21.6,
    "maxTemperature": 31.4,
    "totalReadings": 2066,
    "lastReading": {
      "timestamp": "2025-09-12T20:46:57.281Z",
      "temperature": 31,
      "humidity": 51.4,
      "warehouse_id": "W01"
    }
  }
}
```

#### `/api/sensor-data?type=chart&hours=12`
Returns chart-formatted data for last 12 hours:
```json
{
  "success": true,
  "data": [
    {
      "time": "08:46 PM",
      "temperature": 31.0,
      "humidity": 51.4
    }
  ]
}
```

### Temperature & Humidity Ranges

#### Temperature Status:
- **Optimal**: 15°C - 25°C (Green) ✅
- **Low**: < 15°C (Blue)
- **High**: > 25°C (Red)

#### Humidity Status:
- **Stable**: 45% - 75% (Green) ✅
- **Low**: < 45% (Amber)
- **High**: > 75% (Red)

### Real-time Data Flow

```
ESP32/DHT Sensor → CSV File → API Endpoint → React Hook → Dashboard
     ↓               ↓           ↓            ↓           ↓
  Every few        Real-time   Every 30s    Auto-poll   Live UI
  seconds          updates     refresh      intervals   updates
```

### Troubleshooting

#### 1. **CSV File Not Found**
- Check the file path in `sensor-data/route.ts`
- Ensure the file exists and is readable
- Falls back to sample data if file missing

#### 2. **Node-RED Dashboard Not Loading**
- Verify Node-RED is running on localhost:1880
- Check firewall settings
- Update iframe URL with correct socket ID

#### 3. **Data Not Refreshing**
- Check browser console for API errors
- Verify CSV file is being updated by your IoT system
- Use the Refresh button to manually update

### Dashboard Access

To view the IoT-integrated warehouse dashboard:
1. Go to: `http://localhost:3000/dashboard?role=green-guardian`
2. Navigate to the Warehouse Manager dashboard
3. View real-time temperature/humidity data and charts
4. Use the embedded Node-RED dashboard for live controls

The system automatically reads from your CSV file and displays real calculations instead of dummy data!
