import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/authApi";
import { EMAIL_REGEX } from "@/utils/validation";

interface ForgotPasswordProps {
  onBack: () => void;
  addToast: (
    title: string,
    description?: string,
    variant?: "default" | "destructive" | "success"
  ) => void;
}

export function ForgotPassword({ onBack, addToast }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      addToast(
        "Invalid email",
        "Please enter a valid email address",
        "destructive"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      addToast(
        response.success ? "Success" : "Error",
        response.message,
        response.success ? "success" : "destructive"
      );
      if (response.success) {
        onBack();
      }
    } catch (error) {
      addToast(
        "Password Reset Failed",
        "Failed to process password reset request",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Login
          </Button>
        </div>
      </form>
    </div>
  );
}
