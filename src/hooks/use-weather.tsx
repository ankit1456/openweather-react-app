import weatherAPI from "@/http/weather";
import { ICoords } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_QUERY_KEY = {
  weather: (coords: ICoords) => ["weather", coords],
  forecast: (coords: ICoords) => ["forecast", coords],
  location: (coords: ICoords) => ["location", coords],
  search: (query: string) => ["location-search", query],
} as const;

export const useWeatherQuery = (coords: ICoords | null) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEY.weather(coords ?? { lat: 0, lon: 0 }),
    queryFn: async () => (coords ? weatherAPI.getCurrentWeather(coords) : null),
    enabled: !!coords,
  });
};

export const useForecastQuery = (coords: ICoords | null) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEY.forecast(coords ?? { lat: 0, lon: 0 }),
    queryFn: async () => (coords ? weatherAPI.getForecast(coords) : null),
    enabled: !!coords,
  });
};

export const useReverseGeoCodeQuery = (coords: ICoords | null) => {
  return useQuery({
    queryKey: WEATHER_QUERY_KEY.location(coords ?? { lat: 0, lon: 0 }),
    queryFn: async () => (coords ? weatherAPI.reverseGeoCode(coords) : null),
    enabled: !!coords,
  });
};

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: WEATHER_QUERY_KEY.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length >= 3,
  });
}
