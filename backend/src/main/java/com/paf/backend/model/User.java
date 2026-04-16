package com.paf.backend.model;



import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password; // for normal login

    @Enumerated(EnumType.STRING)
    private Role role;

    private String provider; // LOCAL or GOOGLE

    private String image;

    @Column(nullable = false)
    private boolean isActive = true;

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
}