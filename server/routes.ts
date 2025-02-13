import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertGuestSchema, insertReservationSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Rooms API
  app.get("/api/rooms", async (_req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.post("/api/rooms", async (req, res) => {
    const parsed = insertRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const room = await storage.createRoom(parsed.data);
    res.status(201).json(room);
  });

  app.put("/api/rooms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const room = await storage.updateRoom(id, req.body);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  });

  app.delete("/api/rooms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteRoom(id);
    if (!success) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(204).end();
  });

  // Guests API
  app.get("/api/guests", async (_req, res) => {
    const guests = await storage.getGuests();
    res.json(guests);
  });

  app.post("/api/guests", async (req, res) => {
    const parsed = insertGuestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const guest = await storage.createGuest(parsed.data);
    res.status(201).json(guest);
  });

  app.put("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const guest = await storage.updateGuest(id, req.body);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json(guest);
  });

  app.delete("/api/guests/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteGuest(id);
    if (!success) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.status(204).end();
  });

  // Reservations API
  app.get("/api/reservations", async (_req, res) => {
    const reservations = await storage.getReservations();
    res.json(reservations);
  });

  app.post("/api/reservations", async (req, res) => {
    const parsed = insertReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const reservation = await storage.createReservation(parsed.data);
    res.status(201).json(reservation);
  });

  app.put("/api/reservations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const reservation = await storage.updateReservation(id, req.body);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  });

  app.delete("/api/reservations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteReservation(id);
    if (!success) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(204).end();
  });

  return createServer(app);
}
