package com.paf.backend.security;

import com.paf.backend.model.User;
import com.paf.backend.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// JWT token validate and user authenticate

@Component
public class JwtFilter extends OncePerRequestFilter { // every request once only run vena filter ekk- check JWT

    private final UserService userService;

    public JwtFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) // every request ekt JWT validate karanva, user authenticate karanva, then pass
                                     // to next filter or controller
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) { // security filter preflight request ekk (CORS) skip
                                                               // karanva, preflight request ekt JWT token thiyenava nam
                                                               // validate karanva, valid nam allow karanva, invalid nam
                                                               // block karanva, etc.
            
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("🔥 JWT FILTER HIT: " + request.getServletPath());

        String path = request.getServletPath(); // request URL path ek gannva

        // ❌ SKIP authentication for public routes
        if (path.startsWith("/api/auth") // auth related endpoints, onam request ekk aane nam, onam method ekk aane nam,
                                         // etc. access karanna allow karanva
                || path.startsWith("/oauth2")
                || path.startsWith("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization"); // frontend yavan token ek gannva

        System.out.println("AUTH HEADER: " + authHeader);

        String token = null;
        String email = null;
        String role = null; // ✅ declare here so we can use later

        // 1️⃣ Extract token + claims
        if (authHeader != null && authHeader.startsWith("Bearer ")) {// token ek thiyenvd nadd kiyala check karanva
            token = authHeader.substring(7); // "Bearer " remove karala token ekt gannva

            try {
                Claims claims = JwtUtil.extractClaims(token); // decode JWT token

                email = claims.getSubject(); // extract email from token subject
                role = claims.get("role", String.class); // extract role from token claims, role string format ekt
                                                         // thiyenva, JWT token ekt role store karanna enum use karala
                                                         // store karanva, enum value string format ekt store karanva,
                                                         // token ekt role gannva nam string format ekt gannva

                role = role != null ? role.toUpperCase() : null; // role null nathnam uppercase karanva role format
                                                                 // normalize karanva

                System.out.println("ROLE FROM TOKEN: " + role);
                System.out.println("SPRING ROLE SET: ROLE_" + role);

                if (role == null) {// role token eke nathnam block karanva, role is required kiyala message return
                                   // karanva
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid role in token");
                    return;
                }

                User user = userService.getUserByEmail(email); // email ekt user data gannva, user data thiyenava nam
                                                               // check karanva, user data nathnam block karanva,
                                                               // invalid token kiyala message return karanva, etc.
                if (!user.isActive()) { // user blocknm reject
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("User is blocked");
                    return;
                }

                // 🔥 DEBUG
                System.out.println("TOKEN: " + token);
                System.out.println("EMAIL: " + email);
                System.out.println("ROLE: " + role);

            } catch (Exception e) { // token invalidnm block karanva, invalid token kiyala message return karanva
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            }
        }

        // 2️⃣ Set authentication
        if (email != null && role != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {// email and role token eke thiyenava
                                                                                 // nam, user authenticated nathnam, JWT
                                                                                 // token valid nam user authenticate
                                                                                 // karanva, valid nam allow karanva,
                                                                                 // invalid nam block karanva, etc.

            // ✅ Create authorities

            // Convert JWT role → Spring Security role
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            System.out.println("AUTHORITIES: " + authorities);
            System.out.println("ROLE FROM TOKEN: " + role);

            // ✅ Create auth token - login object create
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null,
                    authorities);

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));// ip, session id, etc. details set
                                                                                // karanva

            // ✅ Set to context
            SecurityContextHolder.getContext().setAuthentication(authToken);// user authenticate karanva, user data
                                                                            // thiyenava nam, user authenticated
                                                                            // nathnam, JWT token valid nam user
                                                                            // authenticate karanva, valid nam allow
                                                                            // karanva, invalid nam block karanva, etc.

            System.out.println("AUTH OBJECT: " +
                    SecurityContextHolder.getContext().getAuthentication());
            System.out.println("AUTHORITIES: " + SecurityContextHolder.getContext()
                    .getAuthentication().getAuthorities());

            System.out.println("✅ USER AUTHENTICATED");
        }

        filterChain.doFilter(request, response);// request next step (controller) yanva
    }
}
