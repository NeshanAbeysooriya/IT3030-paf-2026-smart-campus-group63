package com.paf.backend.service;



import com.paf.backend.dto.AuthResponse;
import com.paf.backend.model.*;
import com.paf.backend.repository.UserRepository;
import com.paf.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // REGISTER
    public User register(String name, String email, String password) {

        if (repo.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));

        user.setProvider("LOCAL");

        if (email.equals("admin@gmail.com")) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.USER);
        }

        return repo.save(user);
    }

    // LOGIN

    public AuthResponse login(String email, String password) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = JwtUtil.generateToken(user.getEmail(), user.getRole().name());

        String image = null;

        if ("GOOGLE".equals(user.getProvider())) {
            image = user.getImage();
        }

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getName(),
                image,
                user.getEmail());
    }
}

