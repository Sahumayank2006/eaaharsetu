# IoT Sensor Integration Setup

## Overview
This system integrates real IoT sensor data from your ESP32/DHT sensors via Node-RED into the AaharSetu warehouse management dashboard.

## Features Implemented

### 1. **Real-time Data Display**
- Live temperature and humidity averages calculated from CSV data
- Dynamic status indicators (Optimal/High/Low ranges)
- Auto-refresh every 30 seconds

### 2. **Interactive Charts**
- Temperature and humidity trends over last 12 hours
- Dual Y-axis charts for better visualization 
- Real-time data updates

### 3. **Node-RED Dashboard Integration**
- Embedded iframe showing your Node-RED dashboard
- Direct link to full dashboard in new tab
- Live indicator showing real-time status

## File Structure

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

## Setup Instructions

### 1. **Update CSV File Path**
Edit `src/app/api/sensor-data/route.ts` and change the path to your actual CSV file:

```typescript
const SENSOR_DATA_PATH = 'c:\\Users\\Parikshit\\Desktop\\PyGames\\IOT\\SensorData\\W01.csv';
```

### 2. **CSV File Format**
Ensure your CSV file follows this format:
```csv
timestamp,temperature,humidity,warehouse_id
2024-09-13T00:00:00Z,18.5,65.2,W01
2024-09-13T00:30:00Z,18.3,65.8,W01
...
```

### 3. **Node-RED Dashboard URL**
Update the iframe URL in `green-guardian-dashboard.tsx` if your Node-RED URL is different:
```typescript
src="http://127.0.0.1:1880/ui/#!/0?socketid=YOUR_SOCKET_ID"
```

## API Endpoints

### `/api/sensor-data?type=stats`
Returns calculated statistics:
```json
{
  "success": true,
  "data": {
    "avgTemperature": 19.4,
    "avgHumidity": 65.2,
    "minTemperature": 17.0,
    "maxTemperature": 21.5,
    "totalReadings": 25,
    "lastReading": {...}
  }
}
```

### `/api/sensor-data?type=chart&hours=12`
Returns chart-formatted data for last 12 hours:
```json
{
  "success": true,
  "data": [
    {
      "time": "12:00 PM",
      "temperature": 21.5,
      "humidity": 62.8
    }
  ]
}
```

## Temperature & Humidity Ranges

### Temperature Status:
- **Optimal**: 15°C - 25°C (Green)
- **Low**: < 15°C (Blue)
- **High**: > 25°C (Red)

### Humidity Status:
- **Stable**: 45% - 75% (Green)
- **Low**: < 45% (Amber)
- **High**: > 75% (Red)

## Troubleshooting

### 1. **CSV File Not Found**
- Check the file path in `sensor-data/route.ts`
- Ensure the file exists and is readable
- Falls back to sample data if file missing

### 2. **Node-RED Dashboard Not Loading**
- Verify Node-RED is running on localhost:1880
- Check firewall settings
- Update iframe URL with correct socket ID

### 3. **Data Not Refreshing**
- Check browser console for API errors
- Verify CSV file is being updated by your IoT system
- Use the Refresh button to manually update

## Next Steps

1. **Replace sample CSV path** with your actual IoT data file
2. **Update Node-RED URL** with your specific dashboard link
3. **Test the integration** by accessing the warehouse manager dashboard
4. **Monitor logs** for any API errors or data issues

## Dashboard Access

To view the updated dashboard:
1. Go to: `http://localhost:3000/dashboard?role=green-guardian`
2. Navigate to the Warehouse Manager dashboard
3. View real-time temperature/humidity data and charts
4. Use the embedded Node-RED dashboard for live controls

The system will automatically read from your CSV file and display real calculations instead of dummy data!