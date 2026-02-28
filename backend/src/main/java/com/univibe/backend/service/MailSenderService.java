package com.univibe.backend.service;

public interface MailSenderService {

    void sendHtmlMail(String email, String subject, String htmlBody);
}
