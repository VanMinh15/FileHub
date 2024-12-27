import { useState } from "react";
import { Button } from "../ui/button";

interface FileUploadProps {
  receiverId?: string;
}

export const FileUpload = ({ receiverId }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    // Implement file upload logic here
    console.log("Uploading files to user:", receiverId);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
      <div className="space-y-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />
        <Button
          onClick={handleUpload}
          disabled={!files.length}
          className="w-full"
        >
          Upload Files
        </Button>
      </div>
    </div>
  );
};
