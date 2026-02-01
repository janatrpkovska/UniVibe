package com.univibe.backend.web;

import com.univibe.backend.service.NewsletterService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:5173") // React
public class NewsletterController {

    private final NewsletterService service;

    public NewsletterController(NewsletterService service) {
        this.service = service;
    }

    @PostMapping("/subscribe")
    public Map<String, String> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String message = service.subscribe(email);
        return Map.of("message", message);
    }
}
