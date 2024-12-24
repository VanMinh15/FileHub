import { Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-24 relative">
          <Link
            to="/"
            className="flex items-center space-x-6 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-primary/50"></div>
              <Cloud className="relative h-14 w-14 text-primary" />
            </div>
            <span className="text-5xl font-bold">FileHub</span>
          </Link>
          <div className="absolute right-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
