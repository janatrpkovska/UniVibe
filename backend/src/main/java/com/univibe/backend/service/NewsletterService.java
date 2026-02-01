package com.univibe.backend.service;

import com.univibe.backend.model.NewsletterSubscriber;
import com.univibe.backend.repository.NewsletterSubscriberRepository;
import org.springframework.stereotype.Service;

@Service
public class NewsletterService {

    private final NewsletterSubscriberRepository repository;

    public NewsletterService(NewsletterSubscriberRepository repository) {
        this.repository = repository;
    }

    public String subscribe(String email) {
        if (repository.findByEmail(email).isPresent()) {
            return "Веќе си пријавен 🙂";
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);

        repository.save(subscriber);
        return "Успешно се пријави 🎉";
    }
}
