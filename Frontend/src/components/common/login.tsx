import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/validation";

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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await dispatch(login(formData)).unwrap();
      addToast("Login successful", undefined, "success");
      setFormData({ email: "", password: "" });
    } catch (err: any) {
      const errorMessage = typeof err === "string" ? err : "Login failed";
      addToast("Login failed", errorMessage, "destructive");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-10 border-black [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              disabled={loading || isSubmitting}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (formErrors.email)
                  setFormErrors({ ...formErrors, email: undefined });
              }}
            />
          </div>
          {formErrors.email && (
            <p className="text-xs text-red-500">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 border-black [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              disabled={loading || isSubmitting}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (formErrors.password)
                  setFormErrors({ ...formErrors, password: undefined });
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground group-[:has(input:-webkit-autofill)]:text-black hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-xs text-red-500">{formErrors.password}</p>
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
  );
}
