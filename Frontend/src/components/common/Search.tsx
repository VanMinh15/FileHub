import { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSelectUser?: (userId: string) => void;
  results?: Array<{ id: string; name: string; email: string }>;
  className?: string;
  message?: string;
  isError?: boolean;
}

export const SearchBar = ({
  placeholder,
  onSearch,
  onSelectUser,
  results = [],
  className,
  message,
  isError,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 300),
    [onSearch]
  );

  // Cancel debounced call on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(!!value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.cancel();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        onSearch(inputValue);
      }
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn("pl-8", isError && "border-red-500")}
          onFocus={() => setIsOpen(true)}
        />
      </form>
      {message && (
        <div
          className={cn(
            "text-sm mt-1",
            isError ? "text-red-500" : "text-green-500"
          )}
        >
          {message}
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-background rounded-md shadow-lg border border-border max-h-60 overflow-auto z-50">
          {results.map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-muted cursor-pointer"
              onClick={() => {
                setInputValue(result.name);
                setIsOpen(false);
                onSelectUser?.(result.id);
              }}
            >
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-muted-foreground">
                {result.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
