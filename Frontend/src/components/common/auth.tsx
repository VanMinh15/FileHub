// auth.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FormData {
  email: string;
  userName: string;
  password: string;
}

interface FormErrors {
  email?: string;
  userName?: string;
  password?: string;
}

interface ToastData {
  id: number;
  title: string;
  description?: string;
  variant: "default" | "destructive" | "success";
}

const PASSWORD_REGEX = /^.{6,}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;

export function AuthForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    userName: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (activeTab === "register") {
      if (!formData.userName) {
        errors.userName = "Username is required";
      } else if (!USERNAME_REGEX.test(formData.userName)) {
        errors.userName =
          "Username must be 3-20 characters (letters, numbers, underscore)";
      }
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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

  const clearForm = () => {
    setFormData({ email: "", password: "", userName: "" });
    setFormErrors({});
  };

  const handleSubmit = async (type: "login" | "register") => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (type === "login") {
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          register({
            email: formData.email,
            userName: formData.userName,
            password: formData.password,
          })
        ).unwrap();
      }

      addToast(
        `${capitalizeFirstLetter(type)} successfully`,
        undefined,
        "success"
      );
      clearForm();
    } catch (err: any) {
      const errorMessage =
        typeof err === "string" ? err : `${capitalizeFirstLetter(type)} failed`;
      addToast(
        `${capitalizeFirstLetter(type)} failed`,
        errorMessage,
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const renderFormInput = (
    field: keyof FormData,
    type: string,
    placeholder: string,
    Icon: React.ComponentType<any>
  ) => (
    <div className="space-y-1">
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type={
            field === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className={cn(
            "pl-10",
            field === "password" && "pr-10",
            formErrors[field] && "border-red-500"
          )}
          disabled={loading || isSubmitting}
          value={formData[field]}
          onChange={(e) => {
            setFormData({ ...formData, [field]: e.target.value });
            if (formErrors[field]) {
              setFormErrors({ ...formErrors, [field]: undefined });
            }
          }}
          required
        />
        {field === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {formErrors[field] && (
        <p className="text-xs text-red-500">{formErrors[field]}</p>
      )}
    </div>
  );

  return (
    <ToastProvider>
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-background/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-4xl text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "login" | "register")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit("login");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    {renderFormInput("email", "email", "Email", Mail)}
                    {renderFormInput("password", "password", "Password", Lock)}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="link"
                      className="px-0 font-normal text-xs"
                      onClick={() => console.log("Forgot password")}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⚪</span>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loading || isSubmitting}
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit("register");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    {renderFormInput("email", "email", "Email", Mail)}
                    {renderFormInput("userName", "text", "Username", User)}
                    {renderFormInput("password", "password", "Password", Lock)}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⚪</span>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

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
