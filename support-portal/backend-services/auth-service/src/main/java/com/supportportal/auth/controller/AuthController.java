package com.supportportal.auth.controller;

import com.supportportal.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) return ResponseEntity.badRequest().body(Map.of("message","email and password required"));
        try {
            Map<String,Object> resp = userService.authenticate(email, password);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401).body(Map.of("message", ex.getMessage()));
        }
    }
}
