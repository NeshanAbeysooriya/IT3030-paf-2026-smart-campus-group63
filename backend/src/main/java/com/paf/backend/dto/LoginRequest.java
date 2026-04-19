package com.paf.backend.dto;

import lombok.Data;// lomback - auto generate setter and getter

@Data
public class LoginRequest { // user login venkor frontend ekt send karan data object ek
    private String email;
    private String password;
}
