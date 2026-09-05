package com.supportportal.auth.service;

import java.util.Map;

public interface UserService {
    /**
     * Authenticate user using email and password.
     * Returns a map containing token and user details on success.
     * Throws RuntimeException on failure.
     */
    Map<String,Object> authenticate(String email, String password);
}
