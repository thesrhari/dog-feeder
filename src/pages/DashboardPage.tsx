import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Wifi,
  Zap,
  BatteryCharging,
  CircleCheck,
  CircleX,
  Clock,
  CalendarClock,
  Inbox,
  CirclePlus,
  ChevronRight,
  Dog,
  Bone,
} from "lucide-react"; // Added Dog, Bone
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed Separator as we use grid layout now
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FeederStatus, FeederFoodLevel, Schedule, DayOfWeek } from "../types";
import {
  formatDistanceToNow,
  differenceInSeconds,
  isAfter,
  addMinutes,
} from "date-fns";

// --- Mock Data & Helper Functions (Keep getNextScheduledFeed, MOCK_SCHEDULES) ---
const getNextScheduledFeed = (
  schedules: Schedule[],
  now: Date
): { time: Date; quantity: number } | null => {
  // ... (previous implementation remains the same) ...
  const sortedEnabledSchedules = schedules
    .filter((s) => s.enabled)
    .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time string HH:MM

  if (sortedEnabledSchedules.length === 0) return null;

  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentDayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    currentDay
  ] as DayOfWeek;
  const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  let nextFeed: { time: Date; quantity: number } | null = null;

  // Find the next feed today
  for (const schedule of sortedEnabledSchedules) {
    const isDaily = schedule.frequency === "Daily";
    const isOnSpecificDay =
      schedule.frequency === "Specific Days" &&
      schedule.days.includes(currentDayStr);

    if (isDaily || isOnSpecificDay) {
      if (schedule.time > currentTimeStr) {
        const [hours, minutes] = schedule.time.split(":").map(Number);
        const feedTime = new Date(now);
        feedTime.setHours(hours, minutes, 0, 0);
        nextFeed = { time: feedTime, quantity: schedule.quantity };
        break;
      }
    }
  }

  // If no feed found for today, find the first feed for tomorrow (or the next scheduled day)
  if (!nextFeed) {
    for (let i = 1; i <= 7; i++) {
      const nextCheckDate = new Date(now);
      nextCheckDate.setDate(now.getDate() + i);
      const nextDay = nextCheckDate.getDay();
      const nextDayStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        nextDay
      ] as DayOfWeek;

      for (const schedule of sortedEnabledSchedules) {
        const isDaily = schedule.frequency === "Daily";
        const isOnSpecificDay =
          schedule.frequency === "Specific Days" &&
          schedule.days.includes(nextDayStr);

        if (isDaily || isOnSpecificDay) {
          const [hours, minutes] = schedule.time.split(":").map(Number);
          const feedTime = new Date(nextCheckDate);
          feedTime.setHours(hours, minutes, 0, 0);
          nextFeed = { time: feedTime, quantity: schedule.quantity };
          return nextFeed;
        }
      }
    }
  }

  return nextFeed;
};

const MOCK_SCHEDULES: Schedule[] = [
  {
    id: 1,
    time: "08:00",
    quantity: 50,
    frequency: "Daily",
    days: [],
    enabled: true,
  },
  {
    id: 2,
    time: "18:00",
    quantity: 60,
    frequency: "Daily",
    days: [],
    enabled: true,
  },
  {
    id: 3,
    time: "12:00",
    quantity: 40,
    frequency: "Specific Days",
    days: ["Sat", "Sun"],
    enabled: true,
  },
];

const DashboardPage: React.FC = () => {
  const { toast } = useToast();
  // --- State variables (keep as before) ---
  const [feederStatus, setFeederStatus] = useState<FeederStatus>({
    connected: true,
    power: "AC",
    batteryLevel: undefined,
    lastFed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    foodLevel: "Okay",
  });
  const [feedQuantity, setFeedQuantity] = useState<number>(30);
  const [isFeedNowDialogOpen, setIsFeedNowDialogOpen] =
    useState<boolean>(false);
  const [nextFeedDetails, setNextFeedDetails] = useState<{
    time: Date;
    quantity: number;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- useEffect hooks for simulation and next feed calculation (keep as before) ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // --- Simulate Scheduled Feed Logic (keep as before) ---
      const nextPotentialFeed = getNextScheduledFeed(
        MOCK_SCHEDULES,
        addMinutes(now, -1)
      );

      if (nextPotentialFeed) {
        const lastFedTime = new Date(feederStatus.lastFed);
        if (
          isAfter(now, nextPotentialFeed.time) &&
          differenceInSeconds(now, lastFedTime) > 60
        ) {
          const scheduleMatch = MOCK_SCHEDULES.find(
            (s) =>
              s.time ===
                `${String(nextPotentialFeed.time.getHours()).padStart(
                  2,
                  "0"
                )}:${String(nextPotentialFeed.time.getMinutes()).padStart(
                  2,
                  "0"
                )}` &&
              s.quantity === nextPotentialFeed.quantity &&
              s.enabled
          );

          if (
            scheduleMatch &&
            differenceInSeconds(now, nextPotentialFeed.time) < 120
          ) {
            console.log(
              `Simulating scheduled feed: ${scheduleMatch.quantity}g at ${scheduleMatch.time}`
            );
            setFeederStatus((prev) => ({
              ...prev,
              lastFed: now.toISOString(),
            }));
            toast({
              title: "Dinner Time!", // Friendlier title
              description: `Dispensed ${scheduleMatch.quantity}g automatically.`,
              variant: "default",
              // Optional: Add an icon
              // action: <ToastAction altText="Okay">Okay</ToastAction>, // If needed
            });
          }
        }
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [feederStatus.lastFed, toast]);

  useEffect(() => {
    const now = new Date();
    const next = getNextScheduledFeed(MOCK_SCHEDULES, now);
    setNextFeedDetails(next);
  }, [currentTime]); // Removed MOCK_SCHEDULES dependency unless it can change

  // --- Event Handlers (keep as before) ---
  const handleFeedNow = useCallback(() => {
    const quantity = feedQuantity;
    if (quantity < 10 || quantity > 200) {
      toast({
        title: "Oops!",
        description: "Amount must be 10-200g.",
        variant: "destructive",
      });
      return;
    }
    console.log(`Feeding ${quantity}g now...`);
    const now = new Date();
    setFeederStatus((prev) => ({ ...prev, lastFed: now.toISOString() }));
    setIsFeedNowDialogOpen(false);
    setFeedQuantity(30);
    toast({ title: "Treat Time!", description: `Dispensing ${quantity}g.` });
  }, [feedQuantity, toast]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) setFeedQuantity(value);
    else if (e.target.value === "") setFeedQuantity(0);
  };

  // --- Display Helpers ---
  const getFoodLevelInfo = (
    level: FeederFoodLevel
  ): {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  } => {
    switch (level) {
      case "Full":
        return {
          text: "Full",
          variant: "default",
          icon: <CircleCheck className="text-paw-green" size={16} />,
        }; // Use explicit green
      case "Okay":
        return {
          text: "Okay",
          variant: "secondary",
          icon: <CircleCheck className="text-yellow-500" size={16} />,
        }; // Explicit yellow/orange
      case "Low":
        return {
          text: "Low",
          variant: "outline",
          icon: <CircleX className="text-orange-500" size={16} />,
        }; // Explicit orange/warning
      case "Empty":
        return {
          text: "Empty",
          variant: "destructive",
          icon: <CircleX className="text-red-600" size={16} />,
        }; // Explicit red
      default:
        return {
          text: "Unknown",
          variant: "secondary",
          icon: <CircleX size={16} />,
        };
    }
  };

  const getConnectionInfo = (
    connected: boolean
  ): {
    text: string;
    variant: "default" | "destructive";
    icon: React.ReactNode;
  } => {
    return connected
      ? {
          text: "Connected",
          variant: "default",
          icon: <Wifi className="text-paw-green" size={16} />,
        } // Use explicit green
      : {
          text: "Offline",
          variant: "destructive",
          icon: <Wifi className="text-red-600" size={16} />,
        }; // Explicit red
  };

  return (
    <div className="space-y-6">
      {/* --- Title (More Engaging) --- */}
      <div className="flex items-center gap-3">
        <Dog size={32} className="text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Feeder Dashboard {/* Or make name dynamic from settings */}
        </h1>
      </div>

      {/* --- Feeder Status Card (Reverted Layout) --- */}
      <Card className="bg-card/80 backdrop-blur-sm">
        {" "}
        {/* Add subtle transparency */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox size={20} /> Feeder Status
          </CardTitle>
          {/* <CardDescription>Overview of your primary feeder.</CardDescription> */}
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm pt-2">
          {/* Connection Status */}
          <div className="flex items-center justify-between space-x-2 col-span-2 sm:col-span-1">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
              {getConnectionInfo(feederStatus.connected).icon} Connection
            </span>
            <Badge
              variant={getConnectionInfo(feederStatus.connected).variant}
              className="flex items-center gap-1 px-2 py-0.5"
            >
              {getConnectionInfo(feederStatus.connected).text}
            </Badge>
          </div>

          {/* Food Level */}
          <div className="flex items-center justify-between space-x-2 col-span-2 sm:col-span-1">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
              <Bone size={16} /> Food Level
            </span>
            <Badge
              variant={getFoodLevelInfo(feederStatus.foodLevel).variant}
              className="flex items-center gap-1 px-2 py-0.5"
            >
              {/* {getFoodLevelInfo(feederStatus.foodLevel).icon} */}
              {getFoodLevelInfo(feederStatus.foodLevel).text}
            </Badge>
          </div>

          {/* Power Source */}
          <div className="flex items-center justify-between space-x-2 col-span-2 sm:col-span-1">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
              {feederStatus.power === "AC" ? (
                <Zap size={16} />
              ) : (
                <BatteryCharging size={16} />
              )}
              Power
            </span>
            <Badge variant="outline" className="px-2 py-0.5">
              {feederStatus.power === "AC"
                ? "Mains"
                : `Battery ${
                    feederStatus.batteryLevel
                      ? `(${feederStatus.batteryLevel}%)`
                      : ""
                  }`}
            </Badge>
          </div>

          {/* Last Fed */}
          <div className="flex items-center justify-between space-x-2 col-span-2 sm:col-span-1">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
              <Clock size={16} /> Last Fed
            </span>
            <span className="font-medium text-foreground">
              {feederStatus.lastFed
                ? formatDistanceToNow(new Date(feederStatus.lastFed), {
                    addSuffix: true,
                  })
                : "Never"}
            </span>
          </div>

          {/* Next Scheduled Feed */}
          <div className="flex items-center justify-between space-x-2 col-span-2">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
              <CalendarClock size={16} /> Next Meal
            </span>
            <span className="font-medium text-foreground text-right">
              {nextFeedDetails
                ? `${formatDistanceToNow(nextFeedDetails.time, {
                    addSuffix: true,
                  })} (${nextFeedDetails.quantity}g)`
                : "None Scheduled"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* --- Quick Actions Card (Keep as is) --- */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CirclePlus size={20} /> Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog
            open={isFeedNowDialogOpen}
            onOpenChange={setIsFeedNowDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="default" className="w-full sm:w-auto">
                {" "}
                {/* Use Accent Color */}
                <CirclePlus className="mr-2 h-4 w-4" /> Feed Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Manual Feed</DialogTitle>
                <DialogDescription>
                  Dispense a specific amount of food immediately.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity (g)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={feedQuantity}
                    onChange={handleQuantityChange}
                    min="10"
                    max="200"
                    step="5"
                    className="col-span-3"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleFeedNow}
                  disabled={feedQuantity < 10 || feedQuantity > 200}
                >
                  Dispense Food
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* --- Link to Schedule Card (Keep as is) --- */}
      <Card className="bg-card/80 backdrop-blur-sm hover:bg-muted/30 transition-colors">
        <NavLink to="/schedule" className="block rounded-lg">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarClock className="text-primary" size={24} />
              <div>
                <p className="font-semibold">View Schedule</p>
                <p className="text-sm text-muted-foreground">
                  Manage automated feeding times.
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </CardContent>
        </NavLink>
      </Card>
    </div>
  );
};

export default DashboardPage;
