package com.paf.backend.controller;

import com.paf.backend.model.Notification;
import com.paf.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PutMapping("/read/{id}")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }

    @PostMapping("/test")
    public String testNotification() {
        service.createNotificationByEmail(
                "kalanika@my.sliit.lk",
                "Your booking has been approved!");
        return "Notification created successfully";
    }

    @GetMapping("/create-test")
    public String createTest() {

        System.out.println("🔥 CREATE TEST API CALLED");

        service.createNotificationByEmail(
                "kalanika@my.sliit.lk",
                "Test notification");

        return "created";
    }

    @GetMapping("/email/{email}")
    public List<Notification> getByEmail(@PathVariable String email) {
        return service.getNotificationsByEmail(email);
    }
}
