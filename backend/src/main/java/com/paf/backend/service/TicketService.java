package com.paf.backend.service;

import com.paf.backend.model.Ticket;
import com.paf.backend.model.TicketStatus;
import com.paf.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Ticket create(Ticket t) {
        t.setStatus(TicketStatus.OPEN);   // ✅ FIXED
        return repo.save(t);
    }

    // GET ALL
    public List<Ticket> getAll() {
        return repo.findAll();
    }

    // GET BY ID
    public Ticket getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    // ASSIGN
    public Ticket assign(Long id, String tech) {
        Ticket t = getById(id);
        t.setAssignedTechnician(tech);
        t.setStatus(TicketStatus.IN_PROGRESS);
        return repo.save(t);
    }

    // STATUS UPDATE
    public Ticket updateStatus(Long id, TicketStatus status) {
        Ticket t = getById(id);
        t.setStatus(status);
        return repo.save(t);
    }

    // RESOLVE
    public Ticket resolve(Long id, String note) {
        Ticket t = getById(id);
        if (t.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Ticket must be in progress to resolve");
        }
        t.setStatus(TicketStatus.RESOLVED);
        t.setResolutionNotes(note);
        return repo.save(t);
    }

    // USER FILTER
    public List<Ticket> getByUser(String email) {
        return repo.findAll()
                .stream()
                .filter(t -> email.equals(t.getCreatedBy()))
                .toList();
    }
}