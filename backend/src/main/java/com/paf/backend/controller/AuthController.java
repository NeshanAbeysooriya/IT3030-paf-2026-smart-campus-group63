package com.paf.backend.controller;// api endpoint handle karanva


import com.paf.backend.dto.*;//DTO = frontend ↔ backend data transfer objects
import com.paf.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController // REST API controller define karanva, JSON response return karanva
@RequestMapping("/api/auth")// base URL path define karanva, onam path ekt request handle karanva
public class AuthController {

    private final AuthService service; // create authservice object

    public AuthController(AuthService service) { //constructor
        this.service = service;
    }

    @PostMapping("/register")// register endpoint
    public String register(@RequestBody RegisterRequest req) {// frontend ekem ena json data register request object ekt conver karanva
        service.register(req.name, req.email, req.password);// authservice call karala db save karanva
        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {// frontend ekem ena json data login request object ekt conver karanva
        return service.login(req.getEmail(), req.getPassword());// authservice call karala user validate karanva, valid nam JWT token create karanva, token, name, email, role return karanva
    }
}
