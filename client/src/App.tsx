import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-screen bg-sidebar p-4">
            <h1 className="text-2xl font-bold text-sidebar-foreground mb-8">Hotel Manager</h1>
            <nav className="space-y-2">
              <Link href="/" className="block p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded">
                Dashboard
              </Link>
              <Link href="/rooms" className="block p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded">
                Rooms
              </Link>
              <Link href="/guests" className="block p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded">
                Guests
              </Link>
              <Link href="/reservations" className="block p-2 text-sidebar-foreground hover:bg-sidebar-accent rounded">
                Reservations
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <Router />
          </div>
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;