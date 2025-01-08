import { Header } from "../components/layout/Header";
import { FileUpload } from "../components/filehub/FileUpload";
import { FileHistory } from "../components/filehub/FileHistory";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const FileHub = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container max-w-5xl mx-auto px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/dash-board")}
          className="flex items-center gap-3 hover:bg-accent px-6 text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Button>
      </div>
      <main className="flex-1 container max-w-5xl mx-auto px-6 flex flex-col">
        <div className="flex-1 overflow-auto mb-6 rounded-lg border shadow-sm">
          <FileHistory receiverId={userId} />
        </div>
        <div className="sticky bottom-0 bg-background pt-4 pb-6">
          <FileUpload receiverId={userId} />
        </div>
      </main>
    </div>
  );
};
