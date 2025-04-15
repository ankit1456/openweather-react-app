import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useLocationSearch } from "@/hooks/use-weather";

import { useFavorites } from "@/hooks/use-favorites";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { favorites } = useFavorites();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    setQuery("");
    navigate(`/city/${name?.toLocaleLowerCase()}?lat=${lat}&lon=${lon}`);
  };
  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start text-sm text-muted-foreground sm:pr-12 sm:w-48 lg:w-64"
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
      >
        <Search className="h-4 w-4 mt-.5" />
        <span className="hidden sm:block">Search cities...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search cities..."
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No cities found.</CommandEmpty>
          )}

          {favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((city) => (
                <CommandItem
                  key={city.id}
                  value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>{city.name}</span>
                  {city.state && (
                    <span className="text-sm text-muted-foreground">
                      , {city.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {city.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-2 w-2" />
                    clear all
                  </Button>
                </div>
                {history.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                    {item.state && (
                      <span className="text-sm text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {item.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations?.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{location.name}</span>
                  {location.state && (
                    <span className="text-sm text-muted-foreground">
                      , {location.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
