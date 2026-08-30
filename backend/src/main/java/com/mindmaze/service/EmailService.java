package com.mindmaze.service;

public interface EmailService {
    void sendPasswordResetEmail(String recipientEmail, String recipientName, String resetUrl);
}
