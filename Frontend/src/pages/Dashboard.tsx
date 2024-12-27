import { ContactsList } from "../components/dashboard/ContactsList";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { SearchBar } from "../components/common/Search";
import { Header } from "../components/layout/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useSearch } from "@/hooks/useSearch";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchResults, searchMessage, isError, handleSearch } = useSearch(
    user?.id
  );
  const navigate = useNavigate();

  const handleUserSelect = (userId: string) => {
    navigate(`/filehub/${userId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar - Contacts */}
          <div className="md:col-span-1 space-y-4">
            <SearchBar
              placeholder="Find contacts"
              onSearch={handleSearch}
              className="w-full"
            />
            <ContactsList contacts={[]} />
          </div>

          {/* Main content - Activities */}
          <div className="md:col-span-3 space-y-4">
            <SearchBar
              placeholder="Find receivers"
              onSearch={handleSearch}
              results={searchResults}
              onSelectUser={handleUserSelect}
              className="w-full"
              message={searchMessage}
              isError={isError}
            />
            <ActivityFeed activities={[]} />
          </div>
        </div>
      </main>
    </div>
  );
};
