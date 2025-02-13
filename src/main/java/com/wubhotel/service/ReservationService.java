package com.wubhotel.service;

import com.wubhotel.model.Reservation;
import com.wubhotel.model.Room;
import com.wubhotel.repository.ReservationRepository;
import java.time.LocalDateTime;
import java.util.List;

public class ReservationService {
    private final ReservationRepository reservationRepository = new ReservationRepository();

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Long id) {
        return reservationRepository.findById(id);
    }

    public Reservation createReservation(Reservation reservation) {
        // Set total amount based on room price and duration
        double roomPrice = reservation.getRoom().getPrice();
        long days = java.time.Duration.between(
            reservation.getCheckInDate(),
            reservation.getCheckOutDate()
        ).toDays();
        reservation.setTotalAmount(roomPrice * days);

        // Update room status
        reservation.getRoom().setStatus(Room.RoomStatus.BOOKED);

        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(Reservation reservation) {
        return reservationRepository.update(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.delete(id);
    }

    public long getCurrentBookings() {
        LocalDateTime now = LocalDateTime.now();
        return getAllReservations().stream()
            .filter(r -> r.getCheckInDate().isBefore(now) && r.getCheckOutDate().isAfter(now))
            .count();
    }
}