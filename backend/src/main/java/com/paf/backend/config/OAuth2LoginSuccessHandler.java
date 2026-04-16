package com.paf.backend.config;



import com.paf.backend.model.User;
import com.paf.backend.security.JwtUtil;
import com.paf.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    public OAuth2LoginSuccessHandler(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        OAuth2User user = (OAuth2User) authentication.getPrincipal();

        System.out.println("GOOGLE ATTRIBUTES: " + user.getAttributes());

        String name = user.getAttribute("name");
        String email = user.getAttribute("email");
        String image = user.getAttribute("picture");

        if (image == null) {
            image = user.getAttribute("avatar_url"); // fallback
        }

        if (image == null) {
            image = user.getAttribute("image"); // another fallback
        }

        // ✅ FIX 1: fallback image
        if (image == null || image.isEmpty()) {
            image = "/user.png";
        }

        System.out.println(user.getAttributes());

        // ✅ SAVE USER (Google login)
        User savedUser = userService.saveGoogleUser(name, email, image);

        String token = JwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().toString());

        // optional safe encode
        String encodedImage = java.net.URLEncoder.encode(
                image,
                java.nio.charset.StandardCharsets.UTF_8);

        response.sendRedirect(
                "http://localhost:5173/login-success" +
                        "?token=" + token +
                        "&name=" + name +
                        "&email=" + email +
                        "&role=" + savedUser.getRole() +
                        "&image=" + encodedImage);
    }
}