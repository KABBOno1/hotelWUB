import { Room, Guest, Reservation, InsertRoom, InsertGuest, InsertReservation } from "@shared/schema";

export interface IStorage {
  // Room operations
  getRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<Room>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;

  // Guest operations
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<Guest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;

  // Reservation operations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private guests: Map<number, Guest>;
  private reservations: Map<number, Reservation>;
  private currentIds: { rooms: number; guests: number; reservations: number };

  constructor() {
    this.rooms = new Map();
    this.guests = new Map();
    this.reservations = new Map();
    this.currentIds = { rooms: 1, guests: 1, reservations: 1 };
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = this.currentIds.rooms++;
    const newRoom: Room = { 
      ...room, 
      id, 
      status: room.status || "available" 
    };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  async updateRoom(id: number, room: Partial<Room>): Promise<Room | undefined> {
    const existingRoom = this.rooms.get(id);
    if (!existingRoom) return undefined;
    const updatedRoom = { ...existingRoom, ...room };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }

  // Guest operations
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const id = this.currentIds.guests++;
    const newGuest = { ...guest, id };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, guest: Partial<Guest>): Promise<Guest | undefined> {
    const existingGuest = this.guests.get(id);
    if (!existingGuest) return undefined;
    const updatedGuest = { ...existingGuest, ...guest };
    this.guests.set(id, updatedGuest);
    return updatedGuest;
  }

  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Reservation operations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = this.currentIds.reservations++;
    const newReservation = { ...reservation, id };
    this.reservations.set(id, newReservation);
    return newReservation;
  }

  async updateReservation(id: number, reservation: Partial<Reservation>): Promise<Reservation | undefined> {
    const existingReservation = this.reservations.get(id);
    if (!existingReservation) return undefined;
    const updatedReservation = { ...existingReservation, ...reservation };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }
}

export const storage = new MemStorage();