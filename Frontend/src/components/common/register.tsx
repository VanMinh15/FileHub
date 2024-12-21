import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "@/utils/validation";

interface RegisterProps {
  loading: boolean;
  addToast: (
    title: string,
    description?: string,
    variant?: "default" | "destructive" | "success"
  ) => void;
}

export function RegisterForm({ loading, addToast }: RegisterProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    userName?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const errors: { email?: string; userName?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.userName) {
      errors.userName = "Username is required";
    } else if (!USERNAME_REGEX.test(formData.userName)) {
      errors.userName =
        "Username must be 3-20 characters (letters, numbers, underscore)";
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
      await dispatch(register(formData)).unwrap();
      addToast("Registration successful", undefined, "success");
      setFormData({ email: "", userName: "", password: "" });
    } catch (err: any) {
      const errorMessage =
        typeof err === "string" ? err : "Registration failed";
      addToast("Registration failed", errorMessage, "destructive");
    } finally {
      setIsSubmitting(false);
    }
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
              className={cn(
                "pl-10",
                formErrors.email && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
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
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Username"
              className={cn(
                "pl-10",
                formErrors.userName && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
              disabled={loading || isSubmitting}
              value={formData.userName}
              onChange={(e) => {
                setFormData({ ...formData, userName: e.target.value });
                if (formErrors.userName)
                  setFormErrors({ ...formErrors, userName: undefined });
              }}
            />
          </div>
          {formErrors.userName && (
            <p className="text-xs text-red-500">{formErrors.userName}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={cn(
                "pl-10 pr-10",
                formErrors.password && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
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
  );
}
