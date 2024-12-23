import { Cloud } from "lucide-react";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthForm } from "@/components/common/auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ResetPasswordForm } from "@/components/common/resetPass";
import { Toaster } from "@/components/ui/toaster";

function MainContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-24 relative">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-primary/50"></div>
                <Cloud className="relative h-14 w-14 text-primary" />
              </div>
              <span className="text-5xl font-bold">FileHub</span>
            </div>
            <div className="absolute right-4 ">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
          </Routes>
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
