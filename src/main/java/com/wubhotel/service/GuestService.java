package com.wubhotel.service;

import com.wubhotel.model.Guest;
import com.wubhotel.repository.GuestRepository;
import java.util.List;

public class GuestService {
    private final GuestRepository guestRepository = new GuestRepository();

    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    public Guest getGuest(Long id) {
        return guestRepository.findById(id);
    }

    public Guest createGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    public Guest updateGuest(Guest guest) {
        return guestRepository.update(guest);
    }

    public void deleteGuest(Long id) {
        guestRepository.delete(id);
    }
}
