import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Room, insertRoomSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BedDouble } from "lucide-react";

export default function Rooms() {
  const { toast } = useToast();
  const { data: rooms = [] } = useQuery<Room[]>({ queryKey: ["/api/rooms"] });

  const form = useForm({
    resolver: zodResolver(insertRoomSchema),
    defaultValues: {
      roomNumber: "",
      type: "Single",
      price: 0,
      status: "available"
    }
  });

  const createRoom = useMutation({
    mutationFn: async (values: ReturnType<typeof form.getValues>) => {
      return apiRequest("POST", "/api/rooms", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({ title: "Room created successfully" });
      form.reset();
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Rooms
          </span>
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto bg-primary/90 hover:bg-primary shadow-lg">
              <BedDouble className="h-5 w-5 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(data => createRoom.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Double">Double</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createRoom.isPending}>
                  {createRoom.isPending ? "Creating..." : "Create Room"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map(room => (
            <TableRow key={room.id}>
              <TableCell>{room.roomNumber}</TableCell>
              <TableCell>{room.type}</TableCell>
              <TableCell>${room.price}</TableCell>
              <TableCell>{room.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}