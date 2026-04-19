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

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler successHandler;
        private final JwtFilter jwtFilter;

        public SecurityConfig(OAuth2LoginSuccessHandler successHandler, JwtFilter jwtFilter) {
                this.successHandler = successHandler;
                this.jwtFilter = jwtFilter;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                HttpMethod.OPTIONS, "/**",
                                                                "/api/auth/**",
                                                                "/uploads/**",
                                                                "/api/users/register",
                                                                "/api/users/forgot-password",
                                                                "/oauth2/**",
                                                                "/login/**")
                                                .permitAll()
                                                .requestMatchers("/api/users/all").hasRole("ADMIN")
                                                .requestMatchers("/api/users/**").authenticated()
                                                .anyRequest().permitAll())
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(
                                                                new org.springframework.security.web.authentication.HttpStatusEntryPoint(
                                                                                org.springframework.http.HttpStatus.UNAUTHORIZED)))
                                .oauth2Login(oauth -> oauth
                                                .successHandler(successHandler))
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOriginPatterns(List.of("http://localhost:*"));

                // ONLY ADDED "PATCH" TO THIS LIST BELOW
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }
}