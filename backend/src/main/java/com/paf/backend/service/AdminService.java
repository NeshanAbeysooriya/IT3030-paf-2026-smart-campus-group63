package com.paf.backend.service;

import com.paf.backend.model.Ticket;
import com.paf.backend.model.TicketStatus;
import com.paf.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final TicketRepository repo;

    public AdminService(TicketRepository repo) {
        this.repo = repo;
    }

    // Assign technician
    public Ticket assign(Long id, String technician) {
        Ticket t = repo.findById(id).orElseThrow();
        t.setAssignedTechnician(technician);
        t.setStatus(TicketStatus.IN_PROGRESS); // ✅ FIXED
        return repo.save(t);
    }

    // Reject ticket
    public Ticket reject(Long id, String reason) {
        Ticket t = repo.findById(id).orElseThrow();
        if (t.getAssignedTechnician() == null || t.getAssignedTechnician().isEmpty()) {
            t.setStatus(TicketStatus.CLOSED); // Disable if no technician available
        } else {
            t.setStatus(TicketStatus.REJECTED); // Keep as rejected if technician was assigned
        }
        t.setResolutionNotes(reason);
        return repo.save(t);
    }
}