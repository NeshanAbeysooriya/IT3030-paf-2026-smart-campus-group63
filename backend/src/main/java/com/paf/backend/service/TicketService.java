package com.paf.backend.service;

import com.paf.backend.model.Ticket;
import com.paf.backend.model.TicketStatus;
import com.paf.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository repo;
    private final NotificationService notificationService;

    public TicketService(TicketRepository repo, NotificationService notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }

    // CREATE
    public Ticket create(Ticket t) {
        t.setStatus(TicketStatus.OPEN); // ✅ FIXED
        Ticket saved = repo.save(t);

        // =========================
        // ✅ ADD NOTIFICATION HERE
        // =========================
        if (saved.getCreatedBy() != null) {
            notificationService.createNotificationByEmail(
                    saved.getCreatedBy(),
                    "Your ticket has been created successfully 🎫");
        }

        return saved;
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
        Ticket updated = repo.save(t);

        // =========================
        // ✅ ADD NOTIFICATION HERE
        // =========================
        if (updated.getCreatedBy() != null) {
            notificationService.createNotificationByEmail(
                    updated.getCreatedBy(),
                    "Your ticket status changed to: " + status);
        }

        return updated;
    }

    // RESOLVE
    public Ticket resolve(Long id, String note) {
        Ticket t = getById(id);
        if (t.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Ticket must be in progress to resolve");
        }
        t.setStatus(TicketStatus.RESOLVED);
        t.setResolutionNotes(note);
        Ticket updated = repo.save(t);

        // =========================
        // ✅ ADD NOTIFICATION HERE
        // =========================
        if (updated.getCreatedBy() != null) {
            notificationService.createNotificationByEmail(
                    updated.getCreatedBy(),
                    "Your ticket has been RESOLVED ✅");
        }

        return updated;
    }

    // USER FILTER
    public List<Ticket> getByUser(String email) {
        return repo.findAll()
                .stream()
                .filter(t -> email.equals(t.getCreatedBy()))
                .toList();
    }
}