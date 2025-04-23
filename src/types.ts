// src/types.ts (Optional file)
export type FeederPowerSource = "AC" | "Battery";
export type FeederFoodLevel = "Full" | "Okay" | "Low" | "Empty";
export type ScheduleFrequency = "Daily" | "Specific Days"; // Add 'Weekly' if needed
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type NotificationType = "info" | "warning" | "error";

export interface FeederStatus {
  connected: boolean;
  power: FeederPowerSource;
  batteryLevel?: number; // Optional if only relevant for Battery power
  lastFed: string; // Using string for simplicity, Date object is better
  foodLevel: FeederFoodLevel;
}

export interface Schedule {
  id: number;
  time: string; // Format HH:MM
  quantity: number; // in grams
  frequency: ScheduleFrequency;
  days: DayOfWeek[]; // Empty if frequency is 'Daily'
  enabled: boolean;
}

export interface Settings {
  feederName: string;
  location: string;
  timeZone: string;
  timeSync: boolean;
  notifications: {
    feedConfirm: boolean;
    feederJam: boolean;
    lowFood: boolean;
    connectionLost: boolean;
  };
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
}
