package com.wubhotel.repository;

import com.wubhotel.model.Room;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.util.List;

public class RoomRepository {
    private static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("wubhotel");
    private final EntityManager em = emf.createEntityManager();

    public List<Room> findAll() {
        return em.createQuery("SELECT r FROM Room r", Room.class).getResultList();
    }

    public Room findById(Long id) {
        return em.find(Room.class, id);
    }

    public Room save(Room room) {
        em.getTransaction().begin();
        em.persist(room);
        em.getTransaction().commit();
        return room;
    }

    public Room update(Room room) {
        em.getTransaction().begin();
        Room updatedRoom = em.merge(room);
        em.getTransaction().commit();
        return updatedRoom;
    }

    public void delete(Long id) {
        em.getTransaction().begin();
        Room room = findById(id);
        if (room != null) {
            em.remove(room);
        }
        em.getTransaction().commit();
    }
}
