import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Room, Guest, Reservation, insertReservationSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reservations() {
  const { toast } = useToast();
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ["/api/reservations"] });
  const { data: rooms = [] } = useQuery<Room[]>({ queryKey: ["/api/rooms"] });
  const { data: guests = [] } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });

  const form = useForm({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      guestId: 0,
      roomId: 0,
      checkInDate: new Date(),
      checkOutDate: new Date()
    }
  });

  const createReservation = useMutation({
    mutationFn: async (values: ReturnType<typeof form.getValues>) => {
      return apiRequest("POST", "/api/reservations", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({ title: "Reservation created successfully" });
      form.reset();
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create reservation", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Find guest and room details for display
  const getGuestName = (guestId: number) => {
    return guests.find(g => g.id === guestId)?.name || 'Unknown Guest';
  };

  const getRoomNumber = (roomId: number) => {
    return rooms.find(r => r.id === roomId)?.roomNumber || 'Unknown Room';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Reservations</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Reservation</Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(data => createReservation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="guestId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest" />
                        </SelectTrigger>
                        <SelectContent>
                          {guests.map(guest => (
                            <SelectItem key={guest.id} value={guest.id.toString()}>
                              {guest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms
                            .filter(room => room.status === 'available')
                            .map(room => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.roomNumber} - {room.type}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkInDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkOutDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => 
                              date < form.getValues("checkInDate") || 
                              date < new Date()
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createReservation.isPending}
                >
                  {createReservation.isPending ? "Creating..." : "Create Reservation"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in Date</TableHead>
            <TableHead>Check-out Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map(reservation => (
            <TableRow key={reservation.id}>
              <TableCell>{getGuestName(reservation.guestId)}</TableCell>
              <TableCell>{getRoomNumber(reservation.roomId)}</TableCell>
              <TableCell>{format(new Date(reservation.checkInDate), "PPP")}</TableCell>
              <TableCell>{format(new Date(reservation.checkOutDate), "PPP")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}