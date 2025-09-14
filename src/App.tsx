import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import AIChat from "./pages/AIChat";
import Settings from "./pages/Settings";
import { User } from "./types";
import { mockUser } from "./data/mockData";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                !isAuthenticated ? (
                  <LoginPage onLogin={handleLogin} />
                ) : (
                  <WelcomePage user={user!} onLogout={handleLogout} />
                )
              } 
            />
            <Route 
              path="/monitoring" 
              element={
                isAuthenticated ? (
                  <MonitoringDashboard user={user!} onLogout={handleLogout} />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/ai-chat" 
              element={
                isAuthenticated ? (
                  <AIChat user={user!} onLogout={handleLogout} />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? (
                  <Settings user={user!} onLogout={handleLogout} />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
