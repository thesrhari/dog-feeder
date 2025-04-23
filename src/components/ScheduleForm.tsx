import React, { useState, useEffect, useMemo } from "react";
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
import { DialogFooter } from "@/components/ui/dialog"; // Import DialogFooter
import { Schedule, DayOfWeek, ScheduleFrequency } from "../types";

type ScheduleFormData = Omit<Schedule, "id" | "enabled">;

interface ScheduleFormProps {
  initialData?: Schedule | null;
  onSave: (scheduleData: ScheduleFormData) => void;
  onCancel: () => void;
}

const daysOfWeek: DayOfWeek[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [time, setTime] = useState("08:00");
  const [quantity, setQuantity] = useState(50);
  const [frequency, setFrequency] = useState<ScheduleFrequency>("Daily");
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    if (initialData) {
      setTime(initialData.time || "08:00");
      setQuantity(initialData.quantity || 50);
      setFrequency(initialData.frequency || "Daily");
      setSelectedDays(initialData.days || []);
    } else {
      setTime("08:00");
      setQuantity(50);
      setFrequency("Daily");
      setSelectedDays([]);
    }
  }, [initialData]);

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort(
            (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
          )
    );
  };

  const isFormValid = useMemo(() => {
    if (frequency === "Specific Days" && selectedDays.length === 0)
      return false;
    if (quantity < 10 || quantity > 200) return false;
    // Basic time check (not empty)
    if (!time) return false;
    return true;
  }, [frequency, selectedDays, quantity, time]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!isFormValid) return;
    onSave({
      time,
      quantity,
      frequency,
      days: frequency === "Specific Days" ? selectedDays : [],
    });
  };

  return (
    // Removed form tag, actions handled by footer buttons now
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Quantity (g)
        </Label>
        <Input
          id="quantity"
          type="number"
          min="10"
          max="200"
          step="5"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="frequency" className="text-right">
          Frequency
        </Label>
        <Select
          value={frequency}
          onValueChange={(value: string) =>
            setFrequency(value as ScheduleFrequency)
          }
        >
          <SelectTrigger id="frequency" className="col-span-3">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Specific Days">Specific Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "Specific Days" && (
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">Days</Label>
          <div className="col-span-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  type="button"
                  // Use primary variant when selected, outline otherwise
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(day)}
                  className="h-8 px-3"
                >
                  {day}
                </Button>
              ))}
            </div>
            {selectedDays.length === 0 && (
              <p className="text-xs text-destructive">
                Please select at least one day.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer is now part of the component */}
      <DialogFooter className="mt-4 pt-4 border-t">
        {" "}
        {/* Added border */}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!isFormValid}
        >
          {initialData ? "Update Schedule" : "Add Schedule"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ScheduleForm;
