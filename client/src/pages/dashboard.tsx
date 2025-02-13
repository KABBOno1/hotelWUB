import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Room, Guest, Reservation } from "@shared/schema";

export default function Dashboard() {
  const { data: rooms = [] } = useQuery<Room[]>({ queryKey: ["/api/rooms"] });
  const { data: guests = [] } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ["/api/reservations"] });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rooms.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{guests.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reservations.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
