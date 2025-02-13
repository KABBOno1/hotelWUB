import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BedDouble, Users, CalendarDays, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Rooms from "@/pages/rooms";
import Guests from "@/pages/guests";
import Reservations from "@/pages/reservations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/guests" component={Guests} />
      <Route path="/reservations" component={Reservations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading && <LoadingScreen />}
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Sidebar */}
        <div className={cn(
          "w-full md:w-64 bg-sidebar border-r border-sidebar-border shadow-lg",
          "fixed md:static inset-0 z-40 transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-sidebar-foreground bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              WUB Hotel
            </h1>
            <div className="text-xs text-muted-foreground mt-1">Created by Kabbo</div>
          </div>
          <nav className="px-3 py-4 space-y-1">
            <NavLink href="/" active={location === "/"} onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
            <NavLink href="/rooms" active={location === "/rooms"} onClick={() => setIsMobileMenuOpen(false)}>
              <BedDouble className="h-5 w-5 mr-3" />
              Rooms
            </NavLink>
            <NavLink href="/guests" active={location === "/guests"} onClick={() => setIsMobileMenuOpen(false)}>
              <Users className="h-5 w-5 mr-3" />
              Guests
            </NavLink>
            <NavLink href="/reservations" active={location === "/reservations"} onClick={() => setIsMobileMenuOpen(false)}>
              <CalendarDays className="h-5 w-5 mr-3" />
              Reservations
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto pt-16 md:pt-0">
          <div className="container mx-auto p-4 md:p-8">
            <Router />
          </div>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

function NavLink({ 
  href, 
  children, 
  active, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode; 
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
          "hover:scale-105 active:scale-95",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {children}
      </div>
    </Link>
  );
}

export default App;