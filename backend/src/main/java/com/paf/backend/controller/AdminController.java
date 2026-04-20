package com.paf.backend.controller;

import com.paf.backend.model.Ticket;
import com.paf.backend.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @PutMapping("/assign")
    public Ticket assign(@RequestParam Long id, @RequestParam String tech) {
        return service.assign(id, tech);
    }

    @PutMapping("/reject")
    public Ticket reject(@RequestParam Long id, @RequestParam String reason) {
        return service.reject(id, reason);
    }
}