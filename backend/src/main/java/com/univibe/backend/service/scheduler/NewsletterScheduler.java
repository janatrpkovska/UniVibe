package com.univibe.backend.service.scheduler;

import com.univibe.backend.model.NewsletterSubscriber;
import com.univibe.backend.repository.NewsletterSubscriberRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.univibe.backend.service.MailSenderService;

import java.util.List;

@Service
public class NewsletterScheduler {
    private final NewsletterSubscriberRepository repository;
    private final MailSenderService mailSender;

    public NewsletterScheduler(NewsletterSubscriberRepository repository, MailSenderService mailSender) {
        this.repository = repository;
        this.mailSender = mailSender;
    }

    @Scheduled(cron = "0 0 9 * * MON")
    public void sendWeeklyNewsletter() {
        List<NewsletterSubscriber> subscribers = repository.findAllActiveSubscribers();
        for (NewsletterSubscriber sub : subscribers) {
            String html = "<html><body>" +
                    "<h2>Здраво од UniVibe 🎓</h2>" +
                    "<p>Погледнете ги новите универзитетски настани!</p>" +
                    "<p><a href='https://yourdomain.com/api/newsletter/unsubscribe?email=" + sub.getEmail() + "'>Unsubscribe</a></p>" +
                    "</body></html>";
            mailSender.sendHtmlMail(sub.getEmail(), "Неделно на UniVibe 🎉", html);
            try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
        }
    }
}
