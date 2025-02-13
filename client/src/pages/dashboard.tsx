import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Room, Guest, Reservation } from "@shared/schema";
import { BedDouble, Users, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery<Room[]>({ 
    queryKey: ["/api/rooms"] 
  });
  const { data: guests = [], isLoading: isLoadingGuests } = useQuery<Guest[]>({ 
    queryKey: ["/api/guests"] 
  });
  const { data: reservations = [], isLoading: isLoadingReservations } = useQuery<Reservation[]>({ 
    queryKey: ["/api/reservations"] 
  });

  const availableRooms = rooms.filter(room => room.status === 'available').length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to WUB Hotel
          </span>
        </h1>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingRooms ? "-" : rooms.length}</div>
              <p className="text-xs text-muted-foreground">
                {availableRooms} available
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingGuests ? "-" : guests.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered guests
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingReservations ? "-" : reservations.length}</div>
              <p className="text-xs text-muted-foreground">
                Current bookings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <div className="h-4 w-4 rounded-full bg-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingRooms ? "-" : `${Math.round((rooms.length - availableRooms) / rooms.length * 100)}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Room utilization
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}