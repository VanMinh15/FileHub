import { useState } from "react";
import { searchReceivers } from "@/services/dashboardApi";

interface SearchResults {
  id: string;
  name: string;
  email: string;
}

export const useSearch = (userId: string | undefined) => {
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [pageIndex] = useState(1);
  const [pageSize] = useState(10);

  const handleSearch = async (query: string) => {
    if (!userId) {
      setSearchMessage("User ID is required");
      setIsError(true);
      return;
    }

    try {
      const response = await searchReceivers({
        keyword: query,
        senderID: userId,
        pageIndex,
        pageSize,
      });

      if (response.success) {
        const formattedResults =
          response.data?.map((r) => ({
            id: r.id,
            name: r.userName,
            email: r.email,
          })) || [];

        setSearchResults(formattedResults);
        setIsError(false);
      } else {
        setSearchResults([]);
        setSearchMessage(response.message || "Search failed");
        setIsError(true);
      }
    } catch (error) {
      setSearchResults([]);
      setSearchMessage("Search failed - please try again");
      setIsError(true);
    }
  };

  return {
    searchResults,
    searchMessage,
    isError,
    handleSearch,
  };
};
