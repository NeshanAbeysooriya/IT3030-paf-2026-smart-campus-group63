package com.paf.backend.controller;

import com.paf.backend.model.Notification;
import com.paf.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // REST controller define karanva, notification related API endpoints define karanva, etc.
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PutMapping("/read/{id}") // mark notification read
    public void markRead(@PathVariable Long id) { // path variable ekem ena id ek aragen e id ekt adalv mark kafranva
        service.markAsRead(id);
    }

    @PostMapping("/test")// test notification craete
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

    @GetMapping("/email/{email}")// adala email ekem notification list ek gannva
    public List<Notification> getByEmail(@PathVariable String email) {
        return service.getNotificationsByEmail(email);
    }
}
