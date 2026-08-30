package com.mindmaze.controller;

import com.mindmaze.dto.AuthResponse;
import com.mindmaze.dto.LoginRequest;
import com.mindmaze.dto.SignupRequest;
import com.mindmaze.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final com.mindmaze.service.PasswordResetService passwordResetService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<java.util.Map<String, String>> forgotPassword(@Valid @RequestBody com.mindmaze.dto.ForgotPasswordRequest request) {
        passwordResetService.processForgotPassword(request);
        return ResponseEntity.ok(java.util.Map.of(
            "message", "If an account with this email exists, a password reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<java.util.Map<String, String>> resetPassword(@Valid @RequestBody com.mindmaze.dto.ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Your password has been successfully reset. You can now log in with your new password."
        ));
    }
}
