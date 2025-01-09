import { Cloud } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isMainPage = location.pathname === "/";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(isAuthenticated ? "/dash-board" : "/");
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center h-24 ${
            isMainPage ? "justify-between" : "justify-center"
          }`}
        >
          <Link
            to={isAuthenticated ? "/dash-board" : "/"}
            onClick={handleNavigation}
            className="flex items-center space-x-6 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-primary/50"></div>
              <Cloud className="relative h-14 w-14 text-primary" />
            </div>
            <span className="text-5xl font-bold">FileHub</span>
          </Link>

          <div
            className={`flex items-center space-x-4 ${
              isMainPage ? "" : "absolute right-8"
            }`}
          >
            <ModeToggle />
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="font-medium"
              >
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
