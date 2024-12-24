import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/utils/validation";
import { register as registerUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      addToast("Registration successful", undefined, "success");
      reset();
    } catch (err: any) {
      const errorMessage =
        typeof err === "string" ? err : "Registration failed";
      addToast("Registration failed", errorMessage, "destructive");
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
              className={cn(
                "pl-10",
                errors.email && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
              disabled={loading || isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("userName")}
              type="text"
              placeholder="Username"
              className={cn(
                "pl-10",
                errors.userName && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
              disabled={loading || isSubmitting}
            />
          </div>
          {errors.userName && (
            <p className="text-xs text-red-500">{errors.userName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative [&:has(input:-webkit-autofill)]:text-black">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-red-500",
                "[&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:!bg-opacity-0 [-webkit-text-fill-color:inherit] [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]"
              )}
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
