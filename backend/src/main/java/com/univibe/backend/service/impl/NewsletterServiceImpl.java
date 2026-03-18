package com.univibe.backend.service.impl;

import com.univibe.backend.model.NewsletterSubscriber;
import com.univibe.backend.repository.NewsletterSubscriberRepository;
import com.univibe.backend.service.MailSenderService;
import com.univibe.backend.service.NewsletterService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NewsletterServiceImpl implements NewsletterService {
    private final NewsletterSubscriberRepository repository;
    private final MailSenderService mailSenderService;
    private final String BASE_URL = "http://localhost:9091";

    public NewsletterServiceImpl(NewsletterSubscriberRepository repository, MailSenderService mailSenderService) {
        this.repository = repository;
        this.mailSenderService = mailSenderService;
    }

    @Override
    public String subscribe(String email) {

        if (email == null) {
            return "Невалидна email адреса ❌";
        }

        email = email.trim();

        if (email.contains(" ")) {
            email = email.substring(0, email.indexOf(" "));
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return "Невалидна email адреса ❌";
        }

       if (repository.findByEmail(email).isPresent()) {
            return "Веќе си на листата 😊\n\nНаскоро ќе добиеш нови информации на email.";
       }

       NewsletterSubscriber subscriber = new NewsletterSubscriber();
       subscriber.setEmail(email);
       repository.save(subscriber);

       String html = "<html><body>" +
               "<h2>ДОБРЕДОЈДОВТЕ во UniVibe 🎉</h2>" +
               "<p>Ви благодариме што се претплативте!</p>" +
               "<p><a href='" + BASE_URL + "/api/newsletter/unsubscribe?email=" + email + "'>Unsubscribe</a></p>" +
               "</body></html>";

       mailSenderService.sendHtmlMail(email, "Welcome to UniVibe 🎓", html);

       return "💌 Ти благодариме!\n\nЌе те известуваме за нови универзитетски настани ✨";
    }

    @Override
    public void sendNewEventEmail(String title, String description) {
        List<NewsletterSubscriber> subscribers = repository.findAllActiveSubscribers();

        for (NewsletterSubscriber sub : subscribers) {
            String html = "<html><body>" +
                    "<h2>New Event: " + title + "</h2>" +
                    "<p>" + description + "</p>" +
                    "<p><a href='" + BASE_URL + "/api/newsletter/unsubscribe?email=" + sub.getEmail() + "'>Unsubscribe</a></p>" +
                    "</body></html>";

            mailSenderService.sendHtmlMail(
                    sub.getEmail(),
                    "Нов настан во UniVibe 🎓",
                    html
            );
        }
    }
}
