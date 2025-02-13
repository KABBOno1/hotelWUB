import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BedDouble, Users, CalendarDays } from "lucide-react";
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-sidebar-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hotel Manager
            </h1>
          </div>
          <nav className="px-3 py-4 space-y-1">
            <NavLink href="/" active={location === "/"}>
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>
            <NavLink href="/rooms" active={location === "/rooms"}>
              <BedDouble className="h-5 w-5 mr-3" />
              Rooms
            </NavLink>
            <NavLink href="/guests" active={location === "/guests"}>
              <Users className="h-5 w-5 mr-3" />
              Guests
            </NavLink>
            <NavLink href="/reservations" active={location === "/reservations"}>
              <CalendarDays className="h-5 w-5 mr-3" />
              Reservations
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            <Router />
          </div>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {children}
      </a>
    </Link>
  );
}

export default App;