import React from "react";
import { NavLink } from "react-router-dom";
// Using lucide icons for potential consistency, though Heroicons are fine too
import {
  Home,
  CalendarDays,
  Settings,
  BellDot,
  PackagePlus,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType; // Use ElementType for Lucide icons
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/schedule", label: "Schedule", icon: CalendarDays },
  { path: "/manual", label: "Feed Now", icon: PackagePlus }, // Changed icon
  { path: "/notifications", label: "Alerts", icon: BellDot },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface BottomNavProps {
  notificationCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ notificationCount }) => {
  return (
    // Use theme colors for background and border
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <ul className="flex justify-around items-center h-16 max-w-screen-md mx-auto">
        {" "}
        {/* Optional: Max width */}
        {navItems.map((item) => (
          <li key={item.path} className="flex-1 text-center">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                // Use theme colors for active/inactive states
                `inline-flex flex-col items-center justify-center p-2 rounded-lg relative w-16 h-16 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
              end
            >
              <item.icon className="h-5 w-5 mb-0.5" strokeWidth={2} />
              <span className="text-xs font-medium block">{item.label}</span>
              {item.path === "/notifications" && notificationCount > 0 && (
                // Use destructive color for notification badge
                <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] leading-tight text-center font-bold border-2 border-card">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
