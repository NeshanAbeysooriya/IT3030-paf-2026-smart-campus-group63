package com.paf.backend.config;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

import com.paf.backend.security.JwtFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // Spring Security configuration class ekk define karanva, application eke security settings manage karanva
@EnableMethodSecurity // method level security enable karanva, onam method ekk @PreAuthorize, @Secured, etc. use karanna allow karanva
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler successHandler; // Google login success handling karanva, Google login vunama onAuthenticationSuccess method run venva, user data save karanva, token create karanva, etc.
        private final JwtFilter jwtFilter; // JWT filter use karanva, onam request ekk aane JWT token thiyenava nam validate karanva, valid nam allow karanva, invalid nam block karanva

        public SecurityConfig(OAuth2LoginSuccessHandler successHandler, JwtFilter jwtFilter) { // constructor injection use karanva, Spring container ekt OAuth2LoginSuccessHandler, JwtFilter inject karanva
                this.successHandler = successHandler;
                this.jwtFilter = jwtFilter;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { //security rules define karanva, onam endpoint ekk access karanna allow karanva, CORS settings, CSRF settings, exception handling, etc.

                http
                                .csrf(csrf -> csrf.disable()) // CSRF protection disable karanva, REST API use karanva nam CSRF disable karanna common practice ekk
                                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS configuration set karanva, corsConfigurationSource method ekt CORS settings define karanva, frontend ↔ backend connection control karanva
                                .authorizeHttpRequests(auth -> auth //define karanva katad access karann puluvam kiyala
                                                .requestMatchers( // onam request ekk aane nam, onam method ekk aane nam, etc. access control karanva
                                                                HttpMethod.OPTIONS, "/**",
                                                                "/api/auth/**",
                                                                "/uploads/**",
                                                                "/api/users/register",
                                                                "/api/users/forgot-password",
                                                                "/oauth2/**",
                                                                "/login/**")
                                                .permitAll() // onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
                                                .requestMatchers("/api/technician/**").hasRole("TECHNICIAN") // only technician role thiyena user lata /api/technician/** endpoint ekk access karanna allow karanva
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN") // only admin role thiyena user lata /api/admin/** endpoint ekk access karanna allow karanva
                                                .requestMatchers("/api/users/all").hasRole("ADMIN") // only admin role thiyena user lata /api/users/all endpoint ekk access karanna allow karanva
                                                .requestMatchers("/api/users/**").authenticated() // only authenticated user lata /api/users/** endpoint ekk access karanna allow karanva
                                                .anyRequest().permitAll())// onam request ekk aane nam, onam method ekk aane nam, etc. access karanna allow karanva
                                .exceptionHandling(ex -> ex // unauthorized access vunama 401 error return karanva, JWT token invalid nam 401 error return karanva, etc.
                                                .authenticationEntryPoint(
                                                                new org.springframework.security.web.authentication.HttpStatusEntryPoint(
                                                                                org.springframework.http.HttpStatus.UNAUTHORIZED)))
                                .oauth2Login(oauth -> oauth
                                                .successHandler(successHandler))// Google login success handler set karanva, Google login vunama onAuthenticationSuccess method run venva, user data save karanva, token create karanva, etc.
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);// JWT filter add karanva, onam request ekk aane nam, JWT token thiyenava nam validate karanva, valid nam allow karanva, invalid nam block karanva

                return http.build(); //final security filter chain build karanva, Spring Security ekt use karanna ready karanva
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() { // CORS configuration define karanva, frontend ↔ backend connection control karanva, onam endpoint ekk access karanna allow karanva, CORS settings, etc.

                CorsConfiguration config = new CorsConfiguration(); //create CorsConfiguration object ekk

                config.setAllowedOriginPatterns(List.of("http://localhost:5173",
                                "http://localhost:5174")); // allow karana origins (URLs) define karanva, frontend ekt access karanna allow karanva
                 // ADDED "PATCH" TO THE LIST BELOW TO ALLOW STATUS UPDATES
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); //allow http method
                config.setAllowedHeaders(List.of("*")); // allow all headers
                config.setAllowCredentials(true);//allow credentials

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // create UrlBasedCorsConfigurationSource object ekk
                source.registerCorsConfiguration("/**", config); // CORS configuration apply karanva, onam endpoint ekk aane nam, CORS settings apply karanva

                return source; // return CorsConfigurationSource object ekk, Spring Security ekt use karanna ready karanva
        }
}