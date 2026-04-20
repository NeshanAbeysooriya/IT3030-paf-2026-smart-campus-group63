package com.paf.backend.controller;

import com.paf.backend.model.Ticket;
import com.paf.backend.model.TicketStatus;
import com.paf.backend.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Ticket create(@RequestBody Ticket t) {
        return service.create(t);
    }

    // GET ALL
    @GetMapping
    public List<Ticket> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/{email}")
    public List<Ticket> getByUser(@PathVariable String email) {
        return service.getByUser(email);
    }

    @GetMapping("/{id}")
    public Ticket getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ASSIGN
    @PutMapping("/{id}/assign")
    public Ticket assign(@PathVariable Long id, @RequestParam String tech) {
        return service.assign(id, tech);
    }

    // STATUS UPDATE
    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam TicketStatus status) {
        return service.updateStatus(id, status);
    }

    // RESOLVE
    @PutMapping("/{id}/resolve")
    public Ticket resolve(@PathVariable Long id, @RequestParam String note) {
        return service.resolve(id, note);
    }
}