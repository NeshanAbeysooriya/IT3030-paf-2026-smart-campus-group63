package com.paf.backend.service;

import com.paf.backend.model.Notification;
import com.paf.backend.model.User;
import com.paf.backend.repository.NotificationRepository;
import com.paf.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;
    private final UserRepository userRepo;

    public NotificationService(NotificationRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // ✅ CREATE NOTIFICATION (EMAIL BASED - MAIN)
    public void createNotificationByEmail(String email, String message) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setRead(false);

        repo.save(n);
    }

    // ✅ GET NOTIFICATIONS BY EMAIL
    public List<Notification> getNotificationsByEmail(String email) {
        return repo.findByUserEmail(email);
    }

    // ✅ MARK AS READ
    public void markAsRead(Long id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setRead(true);
        repo.save(n);
    }
}
