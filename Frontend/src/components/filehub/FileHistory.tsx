import { useEffect, useRef, useState } from "react";
import { Loader2, File, Image, Folder } from "lucide-react";
import { getChatHistory } from "@/services/dashboardApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadFile } from "./UploadFile";

interface FileHistoryProps {
  receiverId?: string;
}

interface ChatActivity {
  id: number;
  name: string;
  type: "File" | "Folder";
  action: string;
  userName: string;
  createdAt: string;
  fileType?: string;
  size?: number;
  itemCount?: number | null;
  permission: string;
  metadata: {
    FileType?: string;
    Size?: string;
    Version: string;
  };
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const FileHistory = ({ receiverId }: FileHistoryProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activities, setActivities] = useState<ChatActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState<string | undefined>(
    undefined
  );
  const loadingRef = useRef(null);

  const fetchChatHistory = async () => {
    if (!receiverId || !user?.id || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await getChatHistory(user.id, receiverId, lastTimestamp);

      if (response.success && response.data) {
        const { items = [], hasMore = false } = response.data;
        setActivities((prev) => [...prev, ...items]);
        setHasMore(hasMore);
        // Use the last item's createdAt as the timestamp for the next fetch
        if (items.length > 0) {
          setLastTimestamp(items[items.length - 1].createdAt);
        }
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchChatHistory();
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [receiverId, lastTimestamp, isLoading, hasMore]);

  // Reset state when receiver changes
  useEffect(() => {
    setActivities([]);
    setHasMore(true);
    setLastTimestamp(undefined);
  }, [receiverId]);

  const getFileIcon = (type: string, fileType?: string) => {
    if (type === "Folder") return <Folder className="h-4 w-4" />;
    if (fileType?.startsWith("image/")) return <Image className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt);
    const dateString = date.toDateString();
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(activity);
    return groups;
  }, {} as Record<string, ChatActivity[]>);

  const otherUserName = activities.find(
    (a) => a.userName !== user?.email
  )?.userName;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="absolute left-1/2 transform -translate-x-1/2">
          <Badge
            variant="secondary"
            className="text-base font-semibold px-6 py-1.5 shadow-sm"
          >
            {otherUserName || "Chat History"}
          </Badge>
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex-1 space-y-6 p-6">
          <div className="flex flex-col gap-6">
            {Object.entries(groupedActivities).map(
              ([dateString, dateActivities]) => (
                <div key={dateString} className="space-y-6">
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative">
                      <span className="text-sm font-medium text-muted-foreground bg-background px-4 py-1.5 rounded-full border shadow-sm">
                        {formatDate(new Date(dateString))}
                      </span>
                    </div>
                  </div>
                  {dateActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      {activity.userName === user?.email ? (
                        <>
                          <div className="flex-1" />
                          <div className="bg-primary/10 rounded-lg p-4 max-w-[80%] shadow-sm hover:shadow transition-shadow">
                            <div className="flex items-center gap-2.5">
                              {getFileIcon(activity.type, activity.fileType)}
                              <div className="text-sm font-medium line-clamp-1">
                                {activity.name}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              <div>{formatFileSize(activity.size)}</div>
                              <div>
                                {formatTime(new Date(activity.createdAt))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-muted rounded-lg p-4 max-w-[80%] shadow-sm hover:shadow transition-shadow">
                            <div className="flex items-center gap-2.5">
                              {getFileIcon(activity.type, activity.fileType)}
                              <div className="text-sm font-medium line-clamp-1">
                                {activity.name}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              <div>{formatFileSize(activity.size)}</div>
                              <div>
                                {formatTime(new Date(activity.createdAt))}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {activities.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-12">
              No files shared yet
            </div>
          )}

          <div ref={loadingRef} className="flex justify-center py-4">
            {isLoading && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
