package com.paf.backend.dto;


public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String image;
    private String email;

    public AuthResponse(String token, String role, String name, String image, String email) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.image = image;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

     public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getEmail() {
        return email;
    }
}

