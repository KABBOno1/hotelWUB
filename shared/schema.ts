import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Room Table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNumber: text("room_number").notNull().unique(),
  type: text("type").notNull(), // Single, Double, Suite
  price: real("price").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, maintenance
});

// Guest Table 
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

// Reservation Table
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  guestId: integer("guest_id").notNull().references(() => guests.id),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
});

// Insert Schemas with proper date validation
export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true });
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export const insertReservationSchema = createInsertSchema(reservations)
  .omit({ id: true })
  .extend({
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
  });

// Types
export type Room = typeof rooms.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;