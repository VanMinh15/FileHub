import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "./login";
import { RegisterForm } from "./register";
import { ForgotPassword } from "./forgotPass";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ToastData {
  id: number;
  title: string;
  description?: string;
  variant: "default" | "destructive" | "success";
}

export function AuthForm() {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(
    "login"
  );

  const addToast = (
    title: string,
    description?: string,
    variant: "default" | "destructive" | "success" = "default"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastProvider>
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-background/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-4xl text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden transition-all duration-300">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as "login" | "register" | "forgot");
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-zinc-200">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <div className="relative mt-8">
                <TabsContent
                  value="login"
                  className="space-y-6 w-full transition-all duration-300 data-[state=inactive]:hidden"
                >
                  <LoginForm
                    loading={loading}
                    addToast={addToast}
                    setShowResetPassword={() => setActiveTab("forgot")}
                  />
                </TabsContent>

                <TabsContent
                  value="forgot"
                  className="space-y-6 w-full transition-all duration-300 data-[state=inactive]:hidden"
                >
                  <ForgotPassword
                    onBack={() => setActiveTab("login")}
                    addToast={addToast}
                  />
                </TabsContent>

                <TabsContent
                  value="register"
                  className="space-y-6 w-full transition-all duration-300 data-[state=inactive]:hidden"
                >
                  <RegisterForm loading={loading} addToast={addToast} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Toast rendering */}
      <ToastViewport />
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          className={cn(
            "dark:text-zinc-50",
            toast.variant === "destructive" &&
              "group destructive dark:border-red-900",
            toast.variant === "success" && "group success dark:border-green-900"
          )}
        >
          <div className="flex flex-1 flex-col">
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          <ToastClose onClick={() => removeToast(toast.id)} />
        </Toast>
      ))}
    </ToastProvider>
  );
}
