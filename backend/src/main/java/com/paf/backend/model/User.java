package com.paf.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users") // database table create karanva
public class User {

    @Id // primary key define karanva
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment id generate karanva
    private Long id;

    private String name;

    @Column(unique = true) //no duplicate email address in database
    private String email;

    private String password; // for normal login

    @Enumerated(EnumType.STRING) // enum type role store karanva, string format ekt store karanva
    private Role role;

    private String provider; // LOCAL or GOOGLE

    private String image;

    //nullable false - not null

    @Column(nullable = false) // user active or not, false means user deactivated by admin, true means active
    private boolean isActive = true;

    private LocalDateTime createdAt;

    @PrePersist // entity save karanna passe execute karanva, createdAt field ekt current time set karanva
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ===================== GETTERS =====================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public String getProvider() {
        return provider;
    }

    public String getImage() {
        return image;
    }

    public boolean isActive() {
        return isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ===================== SETTERS =====================

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}