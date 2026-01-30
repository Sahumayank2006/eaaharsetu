import axios from 'axios';

export interface AdafruitDataPoint {
  value: number;
  timestamp: string;
  epoch: number;
}

export interface WarehouseSensorData {
  current: {
    temperature: number;
    humidity: number;
    timestamp: string;
    status: 'online' | 'offline';
  };
  extremes: {
    temperature: {
      min: number;
      max: number;
    };
    humidity: {
      min: number;
      max: number;
    };
  };
}

export interface DeviceStatus {
  online: boolean;
  lastUpdate: string;
  minutesSinceUpdate: number;
  error?: string;
}

class AdafruitIOService {
  private username: string;
  private apiKey: string;
  private baseURL: string;
  private headers: { 'X-AIO-Key': string; 'Content-Type': string };

  constructor() {
    this.username = process.env.ADAFRUIT_IO_USERNAME || 'sillypari';
    // Do NOT hard-code API keys. Use an environment variable and set it in your deployment.
    // Example (Windows PowerShell): $env:ADAFRUIT_IO_KEY = "aio_xxx"
    this.apiKey = process.env.ADAFRUIT_IO_KEY || '';
    if (!this.apiKey) {
      console.warn('ADAFRUIT_IO_KEY is not set. Adafruit IO requests will fail until the key is configured.');
    }
    this.baseURL = process.env.ADAFRUIT_IO_BASE_URL || 'https://io.adafruit.com/api/v2';
    this.headers = {
      'X-AIO-Key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get latest sensor reading from a feed
   * @param feedKey - Feed name (e.g., 'temperature', 'humidity')
   * @returns Latest data point
   */
  async getLatestData(feedKey: string): Promise<AdafruitDataPoint> {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.username}/feeds/${feedKey}/data/last`,
        { headers: this.headers }
      );
      return {
        value: parseFloat(response.data.value),
        timestamp: response.data.created_at,
        epoch: response.data.created_epoch
      };
    } catch (error) {
      console.error(`Error fetching latest ${feedKey}:`, error);
      throw error;
    }
  }

  /**
   * Get all warehouse sensor data (temperature, humidity, extremes)
   * @returns Complete warehouse sensor snapshot
   */
  async getAllWarehouseData(): Promise<WarehouseSensorData> {
    try {
      const [temperature, humidity, tempMin, tempMax, humMin, humMax, status] =
        await Promise.all([
          this.getLatestData('temperature'),
          this.getLatestData('humidity'),
          this.getLatestData('temp-min'),
          this.getLatestData('temp-max'),
          this.getLatestData('hum-min'),
          this.getLatestData('hum-max'),
          this.getLatestData('status')
        ]);

      return {
        current: {
          temperature: temperature.value,
          humidity: humidity.value,
          timestamp: temperature.timestamp,
          status: status.value === 1 ? "online" : "offline"
        },
        extremes: {
          temperature: {
            min: tempMin.value,
            max: tempMax.value
          },
          humidity: {
            min: humMin.value,
            max: humMax.value
          }
        }
      };
    } catch (error) {
      console.error('Error fetching warehouse data:', error);
      throw error;
    }
  }

  /**
   * Get historical data with time range
   * @param feedKey - Feed name
   * @param hours - Hours of historical data (default: 24)
   * @returns Array of data points
   */
  async getHistoricalData(feedKey: string, hours: number = 24): Promise<AdafruitDataPoint[]> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - (hours * 60 * 60 * 1000));

      const response = await axios.get(
        `${this.baseURL}/${this.username}/feeds/${feedKey}/data`,
        {
          headers: this.headers,
          params: {
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
          }
        }
      );

      return response.data.map((point: any) => ({
        value: parseFloat(point.value),
        timestamp: point.created_at,
        epoch: point.created_epoch
      }));
    } catch (error) {
      console.error(`Error fetching historical ${feedKey}:`, error);
      throw error;
    }
  }

  /**
   * Get chart-ready data for dashboard visualization
   * @param feedKey - Feed name
   * @param hours - Hours of data
   * @returns Chart data with labels and values
   */
  async getChartData(feedKey: string, hours: number = 24): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.username}/feeds/${feedKey}/data/chart`,
        {
          headers: this.headers,
          params: { hours }
        }
      );

      return {
        feed: feedKey,
        data: response.data.data,
        parameters: response.data.parameters
      };
    } catch (error) {
      console.error(`Error fetching chart data for ${feedKey}:`, error);
      throw error;
    }
  }

  /**
   * Reset extreme values (triggered from admin dashboard)
   * @returns Success status
   */
  async resetExtremes(): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseURL}/${this.username}/feeds/reset-extremes/data`,
        { value: "1" },
        { headers: this.headers }
      );
      return true;
    } catch (error) {
      console.error('Error resetting extremes:', error);
      throw error;
    }
  }

  /**
   * Check sensor status (online/offline)
   * @returns Device status
   */
  async getDeviceStatus(): Promise<DeviceStatus> {
    try {
      const status = await this.getLatestData('status');
      const lastUpdate = new Date(status.timestamp);
      const now = new Date();
      const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

      return {
        online: status.value === 1 && minutesSinceUpdate < 2,
        lastUpdate: status.timestamp,
        minutesSinceUpdate: Math.round(minutesSinceUpdate)
      };
    } catch (error) {
      return {
        online: false,
        lastUpdate: new Date().toISOString(),
        minutesSinceUpdate: 999,
        error: (error as Error).message
      };
    }
  }
}

export const adafruitIOService = new AdafruitIOService();