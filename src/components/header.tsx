import { useTheme } from "@/context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import CitySearch from "./city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/">
          <img
            src={isDark ? "/logo.png" : "/logo2.png"}
            alt="logo"
            className="h-12"
          />
        </Link>

        <div className="flex items-center gap-4">
          <CitySearch />
          <div
            className={`cursor-pointer transition-transform duration-400 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="text-yellow-500 transition-all" />
            ) : (
              <Moon className="text-blue-500  transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
