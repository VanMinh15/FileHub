import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthForm } from "@/components/common/Auth";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ResetPasswordForm } from "@/components/common/ResetPass";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { useEffect, useState } from "react";
import { initializeFromToken } from "@/store/slices/authSlice";
import { FileHub } from "./pages/FileHub";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await dispatch(initializeFromToken());
      setIsInitialized(true);
    };
    init();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function MainContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-20">
          {/* Hero Section */}
          <div className="lg:w-1/2 space-y-8 flex flex-col justify-center min-h-[calc(100vh-360px)]">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-gray-500">
                FileHub
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Easily exchange, organize, and manage your files with FileHub.
            </p>
          </div>

          {/* Auth Card */}
          <div className="lg:w-1/2 w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthInitializer>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route
                path="/dash-board"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/filehub/:userId"
                element={
                  <ProtectedRoute>
                    <FileHub />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </AuthInitializer>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
