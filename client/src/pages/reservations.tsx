import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Room, Guest, Reservation, insertReservationSchema, insertGuestSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Reservations() {
  const { toast } = useToast();
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ["/api/reservations"] });
  const { data: rooms = [] } = useQuery<Room[]>({ queryKey: ["/api/rooms"] });
  const { data: guests = [] } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      guestId: 0,
      roomId: 0,
      checkInDate: new Date(),
      checkOutDate: new Date()
    }
  });

  const quickBookForm = useForm({
    resolver: zodResolver(insertGuestSchema.extend({
      roomId: insertReservationSchema.shape.roomId,
      checkOutDate: insertReservationSchema.shape.checkOutDate,
    })),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roomId: 0,
      checkOutDate: new Date()
    }
  });

  const [checkInPopoverOpen, setCheckInPopoverOpen] = useState(false);
  const [checkOutPopoverOpen, setCheckOutPopoverOpen] = useState(false);
  const [quickBookCheckOutOpen, setQuickBookCheckOutOpen] = useState(false);

  const createReservation = useMutation({
    mutationFn: async (values: any) => {
      return apiRequest("POST", "/api/reservations", {
        ...values,
        checkInDate: values.checkInDate.toISOString(),
        checkOutDate: values.checkOutDate.toISOString()
      });
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

  const createQuickBooking = useMutation({
    mutationFn: async (values: any) => {
      // First create the guest
      const guestResponse = await apiRequest("POST", "/api/guests", {
        name: values.name,
        email: values.email,
        phone: values.phone
      });

      // Then create the reservation
      return apiRequest("POST", "/api/reservations", {
        guestId: guestResponse.id,
        roomId: values.roomId,
        checkInDate: new Date().toISOString(),
        checkOutDate: values.checkOutDate.toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Quick booking successful" });
      quickBookForm.reset();
      setIsQuickBookOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create quick booking",
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

  const availableRooms = rooms.filter(room => room.status === 'available');

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Reservations
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Button
            size="lg"
            className="w-full md:w-auto bg-primary/90 hover:bg-primary shadow-lg"
            onClick={() => setIsQuickBookOpen(true)}
          >
            <CalendarDays className="h-5 w-5 mr-2" />
            Book Now
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto bg-primary/90 hover:bg-primary shadow-lg">
                <CalendarDays className="h-5 w-5 mr-2" />
                New Reservation
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Reservation</DialogTitle>
                <DialogDescription>Fill in the details to create a new reservation.</DialogDescription>
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
                            {availableRooms.map(room => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.roomNumber} - {room.type} (${room.price})
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
                        <Popover open={checkInPopoverOpen} onOpenChange={setCheckInPopoverOpen}>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  setCheckInPopoverOpen(false);
                                }
                              }}
                              disabled={(date) => date < new Date()}
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
                        <Popover open={checkOutPopoverOpen} onOpenChange={setCheckOutPopoverOpen}>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  setCheckOutPopoverOpen(false);
                                }
                              }}
                              disabled={(date) =>
                                date < form.getValues("checkInDate") ||
                                date < new Date()
                              }
                              initialFocus
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
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-8">
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

      {/* Quick Book Dialog */}
      <Dialog open={isQuickBookOpen} onOpenChange={setIsQuickBookOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Book a Room</DialogTitle>
            <DialogDescription>Book a room instantly with minimal information.</DialogDescription>
          </DialogHeader>

          <Form {...quickBookForm}>
            <form onSubmit={quickBookForm.handleSubmit(data => createQuickBooking.mutate(data))} className="space-y-4">
              <FormField
                control={quickBookForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter guest name" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={quickBookForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="Enter email" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={quickBookForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={quickBookForm.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Room</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map(room => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.roomNumber} - {room.type} (${room.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={quickBookForm.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover open={quickBookCheckOutOpen} onOpenChange={setQuickBookCheckOutOpen}>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setQuickBookCheckOutOpen(false);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => setIsQuickBookOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createQuickBooking.isPending}>
                  {createQuickBooking.isPending ? "Booking..." : "Book Now"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}