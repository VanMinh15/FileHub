import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { useToast } from "@/hooks/useToast";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Add this hook
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await resetPassword(
        email,
        token,
        data.password,
        data.confirmPassword
      );

      if (response.success) {
        toast({
          description: "Password reset successful",
        });
        // Wait a moment before navigating so user can see the success message
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to reset password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background grid with lowest z-index */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 z-0 pointer-events-none"></div>

      {/* Mode Toggle with highest z-index */}
      <div className="fixed right-4 top-4 z-50">
        <ModeToggle />
      </div>

      {/* Form container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-background/95 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Reset Password
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
