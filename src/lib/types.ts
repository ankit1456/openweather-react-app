export interface ICoords {
  lat: number;
  lon: number;
}

export interface IWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IWeatherData {
  coord: ICoords;
  weather: IWeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
}

export interface IForecastData {
  list: Array<{
    dt: number;
    main: IWeatherData["main"];
    weather: IWeatherData["weather"];
    wind: IWeatherData["wind"];
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface IGeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
