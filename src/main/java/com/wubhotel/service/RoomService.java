package com.wubhotel.service;

import com.wubhotel.model.Room;
import com.wubhotel.repository.RoomRepository;
import java.util.List;
import java.util.stream.Collectors;

public class RoomService {
    private final RoomRepository roomRepository = new RoomRepository();

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoom(Long id) {
        return roomRepository.findById(id);
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Room room) {
        return roomRepository.update(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.delete(id);
    }

    public int getTotalRooms() {
        return getAllRooms().size();
    }

    public List<Room> getAvailableRooms() {
        return getAllRooms().stream()
            .filter(room -> room.getStatus() == Room.RoomStatus.AVAILABLE)
            .collect(Collectors.toList());
    }

    public long getAvailableRoomsCount() {
        return getAvailableRooms().size();
    }
}