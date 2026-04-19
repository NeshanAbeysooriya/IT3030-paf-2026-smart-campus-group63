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

@Component // Spring component ekk kiyala indicate karanva, Spring container ekt manage karanna allow karanva
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler { // Google login success handling karanva

    private final UserService userService;// UserService use karanva, Google user data save karanna use karanva

    public OAuth2LoginSuccessHandler(UserService userService) {// constructor injection use karanva, Spring container ekt UserService inject karanva
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,//google login success vunam run venva request, response, authentication data thiyenva
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {
                

        OAuth2User user = (OAuth2User) authentication.getPrincipal(); //Logged-in Google user data gannva

        System.out.println("GOOGLE ATTRIBUTES: " + user.getAttributes()); 

        //google user data gannva, Google login vune user data thiyenva, name, email, profile picture, etc.

        String name = user.getAttribute("name");
        String email = user.getAttribute("email");
        String image = user.getAttribute("picture");

        if (image == null) {// image nullnm fallback karanva
            image = user.getAttribute("avatar_url"); // fallback
        }

        if (image == null) {
            image = user.getAttribute("image"); // another fallback
        }

        // ✅ FIX 1: fallback image default image set karanva, Google profile picture ekak nathnam default image ekk set karanva
        if (image == null || image.isEmpty()) {
            image = "/user.png";
        }

        System.out.println(user.getAttributes());

        // ✅ SAVE USER (Google login) in to DB , already thiyenm update venva
        User savedUser = userService.saveGoogleUser(name, email, image);

        String token = JwtUtil.generateToken( // create token using save user email and role
                savedUser.getEmail(),
                savedUser.getRole().toString());

        // optional safe encode
        String encodedImage = java.net.URLEncoder.encode(// Image URL safe format ekakt convert karanva
                image,
                java.nio.charset.StandardCharsets.UTF_8);

        response.sendRedirect(
                "http://localhost:5173/login-success" + //login success vunam frontend ekt redirect karanva, token, name, email, role, image pass karanva
                        "?token=" + token +
                        "&name=" + name +
                        "&email=" + email +
                        "&role=" + savedUser.getRole() +
                        "&image=" + encodedImage);
    }
}