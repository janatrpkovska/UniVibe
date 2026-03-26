package com.univibe.backend.service;

public interface NewsletterService {

    String subscribe(String email);

    void sendNewEventEmail(String title, String description);
}
