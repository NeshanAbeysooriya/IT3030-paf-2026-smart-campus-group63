package com.paf.backend.controller;


import com.paf.backend.dto.RegisterRequest;
import com.paf.backend.model.Role;
import com.paf.backend.model.User;
import com.paf.backend.repository.UserRepository;
import com.paf.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Update role
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestParam Role role) {
        return userService.updateRole(id, role);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User updatedUser) {
        return userService.updateUser(updatedUser);
    }

    @PutMapping("/change-password")
    public String changePassword(@RequestBody User req) {
        userService.changePassword(req.getEmail(), req.getPassword());
        return "Password updated";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<User> getAllUsers(Authentication auth) {
        System.out.println("AUTH IN CONTROLLER: " + auth);
        return userService.getAllUsers();
    }

    @PutMapping("/toggle/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUser(id));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {

        if (req == null || !req.containsKey("email")) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            String email = req.get("email");

            String response = userService.forgotPassword(email);

            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace(); // 🔥 IMPORTANT

            return ResponseEntity
                    .status(500)
                    .body("Server error occurred");
        }
    }

}
