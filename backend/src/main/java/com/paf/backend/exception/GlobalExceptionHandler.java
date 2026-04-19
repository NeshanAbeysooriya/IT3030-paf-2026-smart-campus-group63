package com.paf.backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // global exception handler define karanva, onam controller ekt exception handle karanva
public class GlobalExceptionHandler {

    // Handle runtime exceptions (run time errors , manual throw karana errors)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) { // checking erroe

        Map<String, String> error = new HashMap<>();// error message store karanva map hashmap ekt store karanva, key error, value ex.getMessage() - actual error message
        error.put("error", ex.getMessage());// actual error ek frontend ekt yavanva

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);// return bad request status code, error message return karanva
    }

    // Handle generic exceptions - unexpected errors (system crashes)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) { // checking error

        Map<String, String> error = new HashMap<>(); // generic error message store karanva, key error, value something went wrong message
        error.put("error", "Something went wrong"); //safe generic message (real error hide)

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // return internal server error status code, generic error message return karanva
    }
}