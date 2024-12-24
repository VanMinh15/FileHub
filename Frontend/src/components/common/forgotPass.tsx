import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/authApi";
import { forgotPasswordSchema } from "@/utils/validation";
import { EmailSentConfirmation } from "../email/EmailSentConfirmation";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBack: () => void;
  addToast: (
    title: string,
    description?: string,
    variant?: "default" | "destructive" | "success"
  ) => void;
}

export function ForgotPassword({ onBack, addToast }: ForgotPasswordProps) {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data.email);
      if (response.success) {
        setEmailSent(true);
      } else {
        addToast("Error", response.message, "destructive");
      }
    } catch (error) {
      addToast(
        "Password Reset Failed",
        "Failed to process password reset request",
        "destructive"
      );
    }
  };

  if (emailSent) {
    return <EmailSentConfirmation email={watch("email")} onBack={onBack} />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⚪</span>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  );
}
