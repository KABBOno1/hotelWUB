package com.wubhotel.repository;

import com.wubhotel.model.Guest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.util.List;

public class GuestRepository {
    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("wubhotel");
    private final EntityManager em = emf.createEntityManager();

    public List<Guest> findAll() {
        return em.createQuery("SELECT g FROM Guest g", Guest.class).getResultList();
    }

    public Guest findById(Long id) {
        return em.find(Guest.class, id);
    }

    public Guest save(Guest guest) {
        em.getTransaction().begin();
        em.persist(guest);
        em.getTransaction().commit();
        return guest;
    }

    public Guest update(Guest guest) {
        em.getTransaction().begin();
        Guest updatedGuest = em.merge(guest);
        em.getTransaction().commit();
        return updatedGuest;
    }

    public void delete(Long id) {
        em.getTransaction().begin();
        Guest guest = findById(id);
        if (guest != null) {
            em.remove(guest);
        }
        em.getTransaction().commit();
    }
}
