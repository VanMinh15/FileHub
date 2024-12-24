import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, googleLogin } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GoogleLogin } from "@react-oauth/google";
import { loginSchema, LoginFormData } from "@/utils/validation";

interface LoginProps {
  loading: boolean;
  addToast: (
    title: string,
    description?: string,
    variant?: "default" | "destructive" | "success"
  ) => void;
  setShowResetPassword: (show: boolean) => void;
}

export function LoginForm({
  loading,
  addToast,
  setShowResetPassword,
}: LoginProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      addToast("Login successful", undefined, "success");
    } catch (err: any) {
      const errorMessage = typeof err === "string" ? err : "Login failed";
      addToast("Login failed", errorMessage, "destructive");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      addToast("Login failed", "No credentials received", "destructive");
      return;
    }

    try {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      addToast("Login successful", undefined, "success");
    } catch (err: any) {
      const errorMessage =
        typeof err === "string" ? err : "Google login failed";
      addToast("Login failed", errorMessage, "destructive");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="pl-10 border-black [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              disabled={loading || isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 border-black [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              disabled={loading || isSubmitting}
            />
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
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button
          variant="link"
          className="px-0 font-normal text-xs"
          onClick={() => setShowResetPassword(true)}
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

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            addToast(
              "Google login failed",
              "Authentication failed",
              "destructive"
            );
          }}
          theme="outline"
          shape="rectangular"
          text="continue_with"
          useOneTap={false}
          width={300}
        />
      </div>
    </form>
  );
}
