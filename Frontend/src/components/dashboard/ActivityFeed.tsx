import { Activity } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col space-y-2 p-3 rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={activity.type === "sent" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {activity.type}
                  </Badge>
                  <time className="text-sm text-muted-foreground">
                    {activity.date}
                  </time>
                </div>
                <p className="text-sm">{activity.description}</p>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                No recent activities
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
