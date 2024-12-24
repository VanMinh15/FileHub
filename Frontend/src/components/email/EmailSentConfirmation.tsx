import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmailSentConfirmationProps {
  email: string;
  onBack: () => void;
}

export const EmailSentConfirmation = ({
  email,
  onBack,
}: EmailSentConfirmationProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">
          We've sent a password reset link to:
        </p>
        <p className="font-medium">{email}</p>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          If you don't see the email in your inbox, please check your spam
          folder.
        </p>
        <p>The link will expire in 15 minutes.</p>
      </div>

      <Button onClick={onBack} variant="outline" className="w-full">
        Back to Login
      </Button>
    </Card>
  );
};
