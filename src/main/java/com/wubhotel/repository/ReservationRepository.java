package com.wubhotel.repository;

import com.wubhotel.model.Reservation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.util.List;

public class ReservationRepository {
    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("wubhotel");
    private final EntityManager em = emf.createEntityManager();

    public List<Reservation> findAll() {
        return em.createQuery("SELECT r FROM Reservation r", Reservation.class).getResultList();
    }

    public Reservation findById(Long id) {
        return em.find(Reservation.class, id);
    }

    public Reservation save(Reservation reservation) {
        em.getTransaction().begin();
        em.persist(reservation);
        em.getTransaction().commit();
        return reservation;
    }

    public Reservation update(Reservation reservation) {
        em.getTransaction().begin();
        Reservation updatedReservation = em.merge(reservation);
        em.getTransaction().commit();
        return updatedReservation;
    }

    public void delete(Long id) {
        em.getTransaction().begin();
        Reservation reservation = findById(id);
        if (reservation != null) {
            em.remove(reservation);
        }
        em.getTransaction().commit();
    }
}
