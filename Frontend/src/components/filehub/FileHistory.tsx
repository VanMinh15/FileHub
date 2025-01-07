import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface FileHistoryProps {
  receiverId?: string;
}

interface FileItem {
  id: string;
  sender: string;
  filename: string;
  timestamp: string;
  // add other necessary fields
}

export const FileHistory = ({ receiverId }: FileHistoryProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);

  const fetchFiles = async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(
          `/api/files?page=${page}&receiverId=${receiverId}`
        );
        const newFiles = await response.json();

        if (newFiles.length === 0) {
          setHasMore(false);
        } else {
          setFiles((prev) => [...prev, ...newFiles]);
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchFiles();
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [page, isLoading, hasMore]);

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex gap-2">
            {file.sender === "You" ? (
              <>
                <div className="flex-1"></div>
                <div className="bg-primary/10 rounded-lg p-4 max-w-[80%]">
                  <div className="font-medium">{file.sender}</div>
                  <div className="text-sm">{file.filename}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {file.timestamp}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <div className="font-medium">{file.sender}</div>
                  <div className="text-sm">{file.filename}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {file.timestamp}
                  </div>
                </div>
                <div className="flex-1"></div>
              </>
            )}
          </div>
        ))}
      </div>

      {files.length === 0 && !isLoading && (
        <div className="text-center text-muted-foreground py-8">
          No files shared yet
        </div>
      )}

      <div ref={loadingRef} className="flex justify-center py-4">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    </div>
  );
};
