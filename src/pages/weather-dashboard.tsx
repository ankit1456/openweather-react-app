import CurrentWeather from "@/components/current-weather";
import { FavoriteCities } from "@/components/favorite-cities";
import HourlyTemperature from "@/components/hourly-temperature";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/weather-details";
import WeatherForecast from "@/components/weather-forecast";
import useGeolocation from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeoCodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboardPage = () => {
  const {
    coords,
    isLoading: isLocationLoading,
    error: locationError,
    getLocation,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coords);
  const forecastQuery = useForecastQuery(coords);

  const locationQuery = useReverseGeoCodeQuery(coords);

  const handleRefresh = () => {
    if (!coords) return;

    weatherQuery.refetch();
    forecastQuery.refetch();
    locationQuery.refetch();
  };

  if (isLocationLoading) return <LoadingSkeleton />;
  if (locationError)
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" className="w-fit" onClick={getLocation}>
            <MapPin className="size-4" />
            <span className="mb-0.5">Enable Location</span>
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (!coords)
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather</p>
          <Button variant="outline" className="w-fit" onClick={getLocation}>
            <MapPin className="size-4" />
            <span className="mb-0.5">Enable Location</span>
          </Button>
        </AlertDescription>
      </Alert>
    );

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again!</p>
          <Button variant="outline" className="w-fit" onClick={handleRefresh}>
            <MapPin className="size-4" />
            <span className="mb-0.5">retry</span>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <LoadingSkeleton />;
  }

  const locationName = locationQuery.data?.[0];
  return (
    <div className="space-y-4">
      <FavoriteCities />
      <div className="flex items-center justify-between ">
        <h1 className="text-xl font-semibold tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`size-4 ${
              weatherQuery.isFetching || forecastQuery.isFetching
                ? "animate-spin"
                : ""
            }`}
          />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboardPage;
