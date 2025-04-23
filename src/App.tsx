import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BottomNav from "./components/BottomNav";
import DashboardPage from "./pages/DashboardPage";
import SchedulePage from "./pages/SchedulePage";
import ManualFeedPage from "./pages/ManualFeedPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import { Toaster } from "@/components/ui/toaster"; // Correct import path

// Import other pages as they are created (ensure they are .tsx)
// import DeviceManagementPage from './pages/DeviceManagementPage';
// import AccountPage from './pages/AccountPage';
// import HistoryPage from './pages/HistoryPage';

const App: React.FC = () => {
  const [isAuthenticated] = useState<boolean>(true);
  const [notificationCount, setNotificationCount] = useState<number>(3); // Example

  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  // Mock sign in/out
  // const handleSignIn = () => setIsAuthenticated(true);
  // const handleSignOut = () => setIsAuthenticated(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Removed gradient for now */}
        <main className="flex-grow pb-20 container mx-auto px-4 pt-6 sm:pt-8">
          {" "}
          {/* Added more top padding */}
          <Routes>
            {/* Public Route Example */}
            {/* <Route path="/login" element={!isAuthenticated ? <LoginPage onSignIn={handleSignIn} /> : <Navigate to="/" />} /> */}

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/schedule"
              element={
                isAuthenticated ? <SchedulePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/manual"
              element={
                isAuthenticated ? <ManualFeedPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/notifications"
              element={
                isAuthenticated ? (
                  <NotificationsPage updateCount={updateNotificationCount} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />
              }
            />
            {/* Add other routes here */}

            {/* Default redirect */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
            />
          </Routes>
        </main>
        {/* Bottom Navigation */}
        {isAuthenticated && <BottomNav notificationCount={notificationCount} />}
        {/* Shadcn Toaster */}
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
