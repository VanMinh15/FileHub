import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/dashboardApi";
import { toast } from "@/hooks/useToast";

interface UploadFileProps {
  receiverId: string;
  onUploadSuccess?: () => void;
}

export const UploadFile = ({
  receiverId,
  onUploadSuccess,
}: UploadFileProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file, receiverId);
      if (response.success) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        onUploadSuccess?.();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to upload file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isUploading}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <Upload className="h-4 w-4 mr-2" />
      {isUploading ? "Uploading..." : "Upload"}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </Button>
  );
};
