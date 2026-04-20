package com.paf.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration// CORS setting define karan configuration class ekk
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {//Spring container ekt  WebMvcConfigurer ekak denva
        return new WebMvcConfigurer() {//WebMvcConfigurer interface  inline implement karanva
            @Override
            public void addCorsMappings(CorsRegistry registry) { //Frontend ↔ Backend connection control karanva
                registry.addMapping("/**") // CORS mapping define karanva, onam endpoint ekk access karanna allow karanva
                        .allowedOriginPatterns("*") // allow all origins including any port
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow karana http methods define karanva
                        .allowedHeaders("*") // onam header ekk allow karanva JWT, Content-Type, Authorization, etc.
                        .allowCredentials(true);//Cookies / Authorization headers send karanna allow karanva, secure connection ekk thiyenava nam true karanva
            }
        };
    }
}