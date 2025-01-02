import { useEffect, useState } from "react";
import { Activity } from "@/types/activity-types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getRecentActivities } from "@/services/dashboardApi";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd-MM-yyyy HH:mm");
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const response = await getRecentActivities({ pageIndex, pageSize });
      if (response.success && response.data) {
        setActivities(response.data);
        setHasMore(response.data.length === pageSize);
        setError(null);
      } else {
        setActivities([]); // Set empty array if no data
        setError(response.message ?? "Failed to fetch activities");
      }
      setLoading(false);
    };

    fetchActivities();
  }, [pageIndex, pageSize]);

  return (
    <Card className="h-[calc(95vh-rem)]">
      {" "}
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <h3 className="text-xl font-semibold tracking-tight">
          Activity History
        </h3>
        <Badge variant="outline">Page {pageIndex}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        {" "}
        <ScrollArea className="flex-1">
          {" "}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading activities...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No activities found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    "flex flex-col w-full max-w-[85%] space-y-2",
                    activity.action === "Sent"
                      ? "ml-auto items-end"
                      : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-sm font-medium">
                      {activity.action === "Sent" ? "You" : activity.userName}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(activity.createdAt)}
                    </time>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      activity.action === "Sent"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            activity.action === "Sent" ? "secondary" : "default"
                          }
                          className="capitalize"
                        >
                          {activity.type}
                        </Badge>
                        <span className="text-sm font-medium">
                          {activity.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-center gap-4 pt-4 mt-2 border-t">
          <Button
            variant="outline"
            onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
            disabled={pageIndex === 1 || loading}
            className="w-[100px]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={!hasMore || loading}
            className="w-[100px]"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
