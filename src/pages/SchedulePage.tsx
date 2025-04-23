import React, { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Clock, CalendarDays } from "lucide-react"; // Removed Power icons
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator"; // Not used currently
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import ScheduleForm from "../components/ScheduleForm";
import { Schedule } from "../types";

const initialSchedules: Schedule[] = [
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
    enabled: false,
  },
];

const SchedulePage: React.FC = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // --- Handlers (keep from previous version) ---
  const handleAddSchedule = useCallback(() => {
    /* ... */ setEditingSchedule(null);
    setIsModalOpen(true);
  }, []);
  const handleEditSchedule = useCallback((schedule: Schedule) => {
    /* ... */ setEditingSchedule(schedule);
    setIsModalOpen(true);
  }, []);
  const handleDeleteSchedule = useCallback(
    (id: number, time: string) => {
      /* ... */ if (window.confirm(`Delete ${time} schedule?`)) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        toast({
          title: "Schedule Deleted",
          description: `Schedule for ${time} removed.`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );
  const handleSaveSchedule = useCallback(
    (scheduleData: Omit<Schedule, "id" | "enabled">) => {
      /* ... */ let savedSchedule: Schedule | undefined;
      setSchedules((prev) => {
        if (editingSchedule) {
          const updated = prev.map((s) =>
            s.id === editingSchedule.id
              ? { ...editingSchedule, ...scheduleData }
              : s
          );
          savedSchedule = updated.find((s) => s.id === editingSchedule.id);
          return updated;
        } else {
          const newId =
            prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
          const newSch = { ...scheduleData, id: newId, enabled: true };
          savedSchedule = newSch;
          return [...prev, newSch];
        }
      });
      setIsModalOpen(false);
      setEditingSchedule(null);
      toast({
        title: `Schedule ${editingSchedule ? "Updated" : "Added"}`,
        description: `Feeding time set for ${savedSchedule?.time} (${savedSchedule?.quantity}g).`,
      });
    },
    [editingSchedule, toast]
  );
  const toggleEnableSchedule = useCallback(
    (id: number, currentEnabled: boolean) => {
      /* ... */ setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      );
      toast({
        title: `Schedule ${currentEnabled ? "Disabled" : "Enabled"}`,
        description: `The schedule will ${
          currentEnabled ? "no longer run" : "now run"
        } automatically.`,
      });
    },
    [toast]
  );

  // --- Render Logic ---
  const getFrequencyText = (schedule: Schedule): string => {
    if (schedule.frequency === "Specific Days") {
      return schedule.days.length > 0
        ? schedule.days.join(", ")
        : "No days selected";
    }
    return schedule.frequency;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Feeding Schedule
        </h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSchedule}>
              <Plus className="mr-2 h-4 w-4" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
              </DialogTitle>
            </DialogHeader>
            <ScheduleForm
              key={editingSchedule ? editingSchedule.id : "new"}
              initialData={editingSchedule}
              onSave={handleSaveSchedule}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule List */}
      {schedules.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-xl">No Schedules Yet</CardTitle>
            <CardDescription>
              Click "Add Schedule" to set up automatic feedings.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className={`transition-opacity ${
                !schedule.enabled ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                {/* Left Side: Info */}
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Clock
                      size={18}
                      className={
                        schedule.enabled
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                    <span
                      className={
                        !schedule.enabled
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }
                    >
                      {schedule.time}
                    </span>
                    <Badge variant="secondary" className="font-medium">
                      {schedule.quantity}g
                    </Badge>{" "}
                    {/* Use secondary for quantity */}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                    {" "}
                    {/* Indent */}
                    <CalendarDays size={14} />
                    <span>{getFrequencyText(schedule)}</span>
                  </div>
                </div>

                {/* Right Side: Controls */}
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <Switch
                    id={`toggle-${schedule.id}`}
                    checked={schedule.enabled}
                    onCheckedChange={() =>
                      toggleEnableSchedule(schedule.id, schedule.enabled)
                    }
                    aria-label={
                      schedule.enabled ? "Disable schedule" : "Enable schedule"
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSchedule(schedule)}
                    aria-label={`Edit schedule at ${schedule.time}`}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteSchedule(schedule.id, schedule.time)
                    }
                    aria-label={`Delete schedule at ${schedule.time}`}
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
