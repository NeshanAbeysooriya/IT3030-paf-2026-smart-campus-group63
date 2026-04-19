package com.paf.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {

    @Id // primary key define karanva
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment id generate karanva
    private Long id;

    private String message;
    private boolean isRead = false;

    private LocalDateTime createdAt;

    @ManyToOne // many notification ekk user ekk link karanva, one user ekk multiple notification thiyenva, many to one relationship create karanva
    @JoinColumn(name = "user_id") // notification ekt user link karanva, user_id column ekt join karanva, notification table ekt user_id column thiyenva, foreign key relationship create karanva
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // getters & setters
    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
