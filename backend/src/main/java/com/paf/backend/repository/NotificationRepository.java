package com.paf.backend.repository;

import com.paf.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmail(String email); // user email ekt notification list find karanva, user email ekt notification list return karanva, user email ekt notification thiyenava nam return karanva, nathnam empty list return karanva
}