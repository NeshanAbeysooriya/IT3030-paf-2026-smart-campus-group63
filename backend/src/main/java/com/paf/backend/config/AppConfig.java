package com.paf.backend.config;//project organize karann package use karanva



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration// define spring configuration class 
public class AppConfig {

    @Bean// spring containert kiynva mekem create evena ek bean ekk kiyala
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // return PasswordEncoder implementation
    }
}

//password secure karann project eke onam thenak thiyena password ekak encode karanva
