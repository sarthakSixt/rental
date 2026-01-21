package com.sixt.carrental.controller;

import com.sixt.carrental.config.JwtTokenProvider;
import com.sixt.carrental.dto.request.LoginRequest;
import com.sixt.carrental.dto.request.SignupRequest;
import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.dto.response.LoginResponse;
import com.sixt.carrental.entity.User;
import com.sixt.carrental.entity.User.UserRole;
import com.sixt.carrental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // POST /api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignupRequest request) {
        try {
            // Create user entity from request
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // Will be encrypted in service
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(UserRole.CUSTOMER);

            // Register user (password encrypted automatically)
            User savedUser = userService.registerUser(user);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(
                    savedUser.getEmail(),
                    savedUser.getId(),
                    savedUser.getRole().name()
            );

            // Create response with token
            LoginResponse loginResponse = new LoginResponse(
                    token,
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getFirstName(),
                    savedUser.getLastName(),
                    savedUser.getRole().name()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", loginResponse));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            // Find user by email
            Optional<User> userOpt = userService.findByEmail(request.getEmail());

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid email or password"));
            }

            User user = userOpt.get();

            // Verify password using BCrypt
            if (!userService.verifyPassword(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid email or password"));
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getRole().name()
            );

            // Create response with token
            LoginResponse loginResponse = new LoginResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
}