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

        User user = userRepo.findByEmail(email) // email ekt user find karanva, user thiyenava nam return karanva, nathnam exception throw karanva, user not found message return karanva, etc.
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Notification n = new Notification(); // new notification object create karanva, notification object ekt user, message, read status set karanva, etc. set karanva
        n.setUser(user); // notification belongs venne katad
        n.setMessage(message);
        n.setRead(false);

        repo.save(n); // save in DB
    }

    // ✅ GET NOTIFICATIONS BY EMAIL
    public List<Notification> getNotificationsByEmail(String email) {
        return repo.findByUserEmail(email); // user email ekt notification list find karanva, user email ekt notification list return karanva, user email ekt notification thiyenava nam return karanva, nathnam empty list return karanva
    }

    // ✅ MARK AS READ
    public void markAsRead(Long id) {
        Notification n = repo.findById(id) // id ekt notification find karanva, notification thiyenava nam return karanva, nathnam exception throw karanva, notification not found message return karanva, etc.
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setRead(true); // notification read status update karanva, notification object ekt set karanva, etc.
        repo.save(n);// save 
    }
}
