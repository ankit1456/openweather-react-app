import { ICoords } from "@/lib/types";
import { useEffect, useState } from "react";

interface IGeolocationState {
  coords: ICoords | null;
  isLoading: boolean;
  error: string | null;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<IGeolocationState>({
    coords: null,
    isLoading: false,
    error: null,
  });

  const getLocation = () => {
    setLocation((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    if (!navigator.geolocation) {
      setLocation({
        coords: null,
        isLoading: false,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          coords: { lat: latitude, lon: longitude },
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "An unknown error occurred.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }

        setLocation({
          coords: null,
          isLoading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { getLocation, ...location };
};

export default useGeolocation;
