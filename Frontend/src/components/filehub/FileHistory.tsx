interface FileHistoryProps {
  receiverId?: string;
}

export const FileHistory = ({ receiverId }: FileHistoryProps) => {
  return (
    <div className="flex-1 space-y-4 p-4">
      {/* Example structure - replace with real data */}
      <div className="flex flex-col gap-4">
        {/* Sender (left side) */}
        <div className="flex gap-2">
          <div className="bg-muted rounded-lg p-4 max-w-[80%]">
            <div className="font-medium">Sender</div>
            <div className="text-sm">document.pdf</div>
            <div className="text-xs text-muted-foreground mt-1">
              2 hours ago
            </div>
          </div>
          <div className="flex-1"></div>
        </div>

        {/* Receiver (right side) */}
        <div className="flex gap-2">
          <div className="flex-1"></div>
          <div className="bg-primary/10 rounded-lg p-4 max-w-[80%]">
            <div className="font-medium">You</div>
            <div className="text-sm">response.docx</div>
            <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
          </div>
        </div>
      </div>

      {/* When no files */}
      <div className="text-center text-muted-foreground py-8">
        No files shared yet
      </div>
    </div>
  );
};
