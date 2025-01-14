import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, FolderUp, File } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { UploadFile } from "./UploadFile";

interface FileUploadProps {
  receiverId?: string;
}

export const FileUpload = ({ receiverId }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click because we have separate buttons
  });

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    // Implement folder creation logic here
    console.log("Creating folder:", folderName);
    setShowNewFolder(false);
    setFolderName("");
  };

  const handleUpload = async () => {
    // Implement file upload logic here
    console.log("Uploading files to user:", receiverId);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-lg border border-border">
      <div
        {...getRootProps()}
        className={`flex flex-col gap-4 ${
          isDragActive
            ? "bg-primary/5 border-2 border-dashed border-primary/50 rounded-md"
            : ""
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <UploadFile
              receiverId={receiverId || ""}
              onUploadSuccess={() => setFiles([])}
            />
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => document.getElementById("folder-input")?.click()}
            >
              <FolderUp size={16} />
              Select Folder
            </Button>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setShowNewFolder(true)}
          >
            <Plus size={16} />
          </Button>
        </div>

        {isDragActive && (
          <div className="text-center py-8 text-primary">
            Drop files here...
          </div>
        )}

        {showNewFolder && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        )}

        {files.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <File size={14} />
                  {file.name}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </div>
              <Button onClick={handleUpload} disabled={!files.length} size="sm">
                Upload Files
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
