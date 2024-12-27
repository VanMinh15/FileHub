import { Header } from "../components/layout/Header";
import { FileUpload } from "../components/filehub/FileUpload";
import { FileHistory } from "../components/filehub/FileHistory";
import { useParams } from "react-router-dom";

export const FileHub = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileHistory receiverId={userId} />
          </div>
          <div className="lg:col-span-1">
            <FileUpload receiverId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
};
