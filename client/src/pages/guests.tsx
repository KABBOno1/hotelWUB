import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Guest, insertGuestSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users } from "lucide-react";

export default function Guests() {
  const { toast } = useToast();
  const { data: guests = [] } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });

  const form = useForm({
    resolver: zodResolver(insertGuestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const createGuest = useMutation({
    mutationFn: async (values: ReturnType<typeof form.getValues>) => {
      return apiRequest("POST", "/api/guests", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({ title: "Guest created successfully" });
      form.reset();
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Guests
          </span>
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto bg-primary/90 hover:bg-primary shadow-lg">
              <Users className="h-5 w-5 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(data => createGuest.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createGuest.isPending}>
                  {createGuest.isPending ? "Creating..." : "Create Guest"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map(guest => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}