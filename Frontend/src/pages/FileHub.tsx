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
      <div className="container mx-auto px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dash-board")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <main className="flex-1 container mx-auto px-6 flex flex-col">
        <div className="flex-1 overflow-auto mb-4">
          <FileHistory receiverId={userId} />
        </div>
        <div className="sticky bottom-0 bg-background pt-4">
          <FileUpload receiverId={userId} />
        </div>
      </main>
    </div>
  );
};
