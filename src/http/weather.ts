import {
  ICoords,
  IForecastData,
  IGeocodingResponse,
  IWeatherData,
} from "@/lib/types";
import { API_CONFIG } from "./config";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }
  async getCurrentWeather({ lat, lon }: ICoords): Promise<IWeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.fetchData<IWeatherData>(url);
  }
  async getForecast({ lat, lon }: ICoords): Promise<IForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.fetchData<IForecastData>(url);
  }
  async reverseGeoCode({ lat, lon }: ICoords): Promise<IGeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat,
      lon,
      limit: 1,
    });
    return this.fetchData<IGeocodingResponse[]>(url);
  }

  async searchLocations(query: string): Promise<IGeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: "5",
    });
    return this.fetchData<IGeocodingResponse[]>(url);
  }
}

export default new WeatherAPI();
