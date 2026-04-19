package com.paf.backend.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

//generate JWT token, extract claims from token, etc. karanva

public class JwtUtil {

    private static final String SECRET = "my-secret-key-my-secret-key-my-secret-key-123456"; //token ek secure karan password ek vage ekak - JWT signing key

    private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes()); //secret string → cryptographic key ekakt convert karanva

    public static String generateToken(String email, String role) { // login unam jwt token create karnva
        return Jwts.builder() // JWT token create karanva, email and role token eke thiyenava, token issue date and expiration date set karanva, token sign karanva using secret key, etc.
                .setSubject(email)
                .claim("role", role.replace("ROLE_", ""))//ROLE_ADMIN → ADMIN
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))//86400000 ms = 24 hours 1 day
                .signWith(key) // secret key ekem enncrypt karana
                .compact(); //final token string return karanva
    }

    public static Claims extractClaims(String token) { // JWT token decode karanva, token valid nam claims return karanva, token invalid nam exception throw karanva, etc.
        return Jwts.parserBuilder() // token reading start
                .setSigningKey(key) // verify token valid or not
                .build() // parser build karanva
                .parseClaimsJws(token) // decode token
                .getBody(); // actual data extract
    }

}