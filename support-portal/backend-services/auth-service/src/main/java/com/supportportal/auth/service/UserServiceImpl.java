package com.supportportal.auth.service;

import com.supportportal.auth.model.User;
import com.supportportal.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final byte[] jwtKey;
    private final long jwtExpirationMs;

    public UserServiceImpl(UserRepository userRepository, @Value("${app.jwtSecret}") String secret, @Value("${app.jwtExpirationMs}") long jwtExpirationMs) {
        this.userRepository = userRepository;
        this.jwtKey = secret.getBytes();
        this.jwtExpirationMs = jwtExpirationMs;
    }

    @Override
    public Map<String, Object> authenticate(String email, String password) {
        var opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) throw new RuntimeException("Invalid credentials");
        User user = opt.get();
        if (!encoder.matches(password, user.getPasswordHash())) throw new RuntimeException("Invalid credentials");

        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("name", user.getName())
                .claim("role", user.getRole())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(Keys.hmacShaKeyFor(jwtKey))
                .compact();

        Map<String,Object> resp = new HashMap<>();
        Map<String,Object> usr = new HashMap<>();
        usr.put("id", user.getId()); usr.put("name", user.getName()); usr.put("email", user.getEmail()); usr.put("role", user.getRole());
        resp.put("token", token);
        resp.put("user", usr);
        return resp;
    }
}
