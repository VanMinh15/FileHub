interface FileHistoryProps {
  receiverId?: string;
}

export const FileHistory = ({ receiverId }: FileHistoryProps) => {
  // Implement fetch logic for file history

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">File History</h2>
      <div className="space-y-2">
        {/* Implement file history list here */}
        <p className="text-muted-foreground">No files shared yet</p>
      </div>
    </div>
  );
};
