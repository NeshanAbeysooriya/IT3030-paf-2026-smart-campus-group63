package com.paf.backend.service;



import com.paf.backend.model.Role;
import com.paf.backend.model.User;
import com.paf.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Save user from Google login
    public User saveGoogleUser(String name, String email, String image) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setRole(Role.USER);
            user.setProvider("GOOGLE");
            user.setPassword(null); // important
        }

        user.setName(name);
        user.setProvider("GOOGLE"); // ALWAYS set

        if (image != null && !image.isEmpty()) {
            user.setImage(image);
        } else {
            user.setImage("/user.png");
        }

        return userRepository.save(user);
    }

    // Change role (ADMIN only)
    public User updateRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(role);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }

    // UPDATE USER PROFILE
    public User updateUser(User updatedUser) {

        User user = userRepository.findByEmail(updatedUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }

        if (updatedUser.getImage() != null) {
            user.setImage(updatedUser.getImage());
        }

        return userRepository.save(user);
    }

    public void changePassword(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow();

        user.setPassword(passwordEncoder.encode(password)); // ✅ ENCRYPTED

        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive());

        return userRepository.save(user);
    }

    public String forgotPassword(String email) {

        System.out.println("EMAIL RECEIVED: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("USER FOUND: " + user.getEmail());

        if (!user.isActive()) {
            throw new RuntimeException("User is blocked");
        }

        return "Reset link sent";
    }

}