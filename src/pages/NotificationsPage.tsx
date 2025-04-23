import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Bell,
  Info,
  TriangleAlert,
  CircleX,
  Trash2,
  Archive,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Notification, NotificationType } from "../types";
import { formatDistanceToNow, format } from "date-fns";

const initialNotifications: Notification[] = [
  // Keep mock data as before
  {
    id: 1,
    type: "error",
    message: "Feeder jammed. Please check the dispenser unit.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: "warning",
    message: "Low food level detected. Refill soon.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: "info",
    message: "Scheduled feed at 6:00 PM completed successfully (60g).",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 4,
    type: "info",
    message: "Firmware v1.2.3 update available. Go to Device Management.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 5,
    type: "warning",
    message: "Feeder lost Wi-Fi connection briefly and reconnected.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diffDays = (now.getTime() - timestamp.getTime()) / (1000 * 3600 * 24);
  if (diffDays < 1) return formatDistanceToNow(timestamp, { addSuffix: true });
  if (diffDays < 7) return format(timestamp, "eee 'at' p");
  return format(timestamp, "MMM d, yyyy");
};

interface NotificationsPageProps {
  updateCount?: (count: number) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  updateCount,
}) => {
  const { toast } = useToast();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    if (updateCount) updateCount(unreadCount);
  }, [unreadCount, updateCount]);

  // --- Handlers (keep from previous version) ---
  const markAsRead = useCallback((id: number) => {
    /* ... */ setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);
  const deleteNotification = useCallback(
    (id: number) => {
      /* ... */ setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast({ title: "Notification Deleted", variant: "default" });
    },
    [toast]
  );
  const clearAll = useCallback(() => {
    /* ... */ if (window.confirm("Clear all notifications?")) {
      setNotifications([]);
      toast({ title: "Notifications Cleared" });
    }
  }, [toast]);

  // Map notification type to border color class and icon
  const getNotificationPresentation = (
    type: NotificationType
  ): { borderClass: string; icon: React.ReactNode } => {
    switch (type) {
      case "error":
        return {
          borderClass: "border-destructive",
          icon: <CircleX className="h-5 w-5 text-destructive flex-shrink-0" />,
        };
      case "warning":
        return {
          borderClass: "border-warning",
          icon: (
            <TriangleAlert className="h-5 w-5 text-warning flex-shrink-0" />
          ),
        }; // Use warning color variable
      case "info":
      default:
        return {
          borderClass: "border-primary",
          icon: <Info className="h-5 w-5 text-primary flex-shrink-0" />,
        }; // Use primary color variable
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        {notifications.length > 0 && (
          <Button onClick={clearAll} variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" /> Clear All
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          {" "}
          {/* Dashed border */}
          <CardHeader>
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-xl">All Clear!</CardTitle>
            <CardDescription>You have no new notifications.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifications
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((notification) => {
                  const { borderClass, icon } = getNotificationPresentation(
                    notification.type
                  );
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 flex items-start justify-between gap-3 border-l-4 ${borderClass} ${
                        notification.read
                          ? "opacity-70 bg-muted/30 hover:bg-muted/40"
                          : "bg-card hover:bg-accent/50"
                      } transition-colors`} // Added hover effect
                    >
                      {/* Content */}
                      <div className="flex items-start flex-grow min-w-0">
                        {" "}
                        {/* Allow shrinking */}
                        {icon}
                        <div className="ml-3 space-y-1 flex-grow">
                          <p
                            className={`text-sm leading-snug ${
                              !notification.read
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="link"
                            size="sm"
                            className="text-xs h-7 px-1 text-primary"
                            title="Mark as read"
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
