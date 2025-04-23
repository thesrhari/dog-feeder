import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Bell,
  Wifi,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "../types"; // Import type

const timeZones: string[] = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
];

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    feederName: "Kitchen Feeder",
    location: "Kitchen",
    timeZone: "America/New_York",
    timeSync: true,
    notifications: {
      feedConfirm: true,
      feederJam: true,
      lowFood: true,
      connectionLost: false,
    },
  });
  const [hasChanges, setHasChanges] = useState(false); // Track changes

  // --- Handlers ---
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSettings((prev) => ({ ...prev, [name]: value }));
      setHasChanges(true);
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }, []);

  const handleSwitchChange = useCallback(
    (
      name: keyof Settings | keyof Settings["notifications"],
      checked: boolean
    ) => {
      if (name in settings.notifications) {
        // It's a notification setting
        setSettings((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [name]: checked,
          },
        }));
      } else if (name === "timeSync") {
        // It's the timeSync setting
        setSettings((prev) => ({ ...prev, timeSync: checked }));
      }
      setHasChanges(true);
    },
    []
  );

  const handleSaveChanges = useCallback(() => {
    console.log("Saving settings:", settings);
    // API call would go here
    toast({
      title: "Settings Saved",
      description: "Your feeder configuration has been updated.",
    });
    setHasChanges(false); // Reset change tracking
  }, [settings, toast]);

  const renderNotificationToggle = (
    key: keyof Settings["notifications"],
    label: string
  ) => (
    <div key={key} className="flex items-center justify-between space-x-2 py-2">
      <Label
        htmlFor={`notif-${key}`}
        className="text-sm font-medium cursor-pointer"
      >
        {label}
      </Label>
      <Switch
        id={`notif-${key}`}
        checked={settings.notifications[key]}
        onCheckedChange={(checked) => handleSwitchChange(key, checked)}
      />
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Settings
      </h1>

      {/* Feeder Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={20} /> Feeder Configuration
          </CardTitle>
          <CardDescription>
            Basic information and time settings for your feeder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="feederName">Feeder Name</Label>
            <Input
              id="feederName"
              name="feederName"
              value={settings.feederName}
              onChange={handleInputChange}
              placeholder="e.g., Living Room Feeder"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={settings.location}
              onChange={handleInputChange}
              placeholder="e.g., Kitchen Counter"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select
              value={settings.timeZone}
              onValueChange={(value) => handleSelectChange("timeZone", value)}
            >
              <SelectTrigger id="timeZone">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-2 pt-2">
            <Label
              htmlFor="timeSync"
              className="text-sm font-medium cursor-pointer"
            >
              Automatic Time Sync
              <p className="text-xs text-muted-foreground font-normal">
                Keep feeder time updated via network.
              </p>
            </Label>
            <Switch
              id="timeSync"
              checked={settings.timeSync}
              onCheckedChange={(checked) =>
                handleSwitchChange("timeSync", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} /> Notifications
          </CardTitle>
          <CardDescription>
            Choose which alerts you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {" "}
          {/* Use divide for separators */}
          {renderNotificationToggle("feedConfirm", "Feeding Confirmation")}
          {renderNotificationToggle("feederJam", "Feeder Jam Alert")}
          {renderNotificationToggle("lowFood", "Low Food Warning")}
          {renderNotificationToggle("connectionLost", "Connection Lost Alert")}
        </CardContent>
      </Card>

      {/* Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced</CardTitle>
          <CardDescription>Manage devices and user accounts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <NavLink
            to="/devices"
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Device Management
              </span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </NavLink>
          <Separator />
          <NavLink
            to="/account"
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Account & Users
              </span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </NavLink>
        </CardContent>
      </Card>

      {/* Save Button Area */}
      {hasChanges && (
        <div className="sticky bottom-20 md:bottom-4 flex justify-end z-10">
          {" "}
          {/* Sticky save */}
          <Card className="p-2 shadow-lg border-primary">
            <Button onClick={handleSaveChanges} size="lg">
              Save Changes
            </Button>
          </Card>
        </div>
      )}
      {!hasChanges && (
        <div className="mt-6 text-center">
          {/* Optionally show a disabled save button or nothing */}
          {/* <Button disabled size="lg">Save Changes</Button> */}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
