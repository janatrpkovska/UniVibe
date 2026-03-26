package com.univibe.backend.web;

import com.univibe.backend.model.Event;
import com.univibe.backend.service.SavedEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-events")
@RequiredArgsConstructor
public class SavedEventController {
    private final SavedEventService savedEventService;

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return auth.getName();
    }

    @GetMapping
    public ResponseEntity<List<Event>> getSavedEvents() {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(savedEventService.getSavedEventsForUser(username));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<Void> saveEvent(@PathVariable Long eventId) {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            savedEventService.saveEvent(username, eventId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> unsaveEvent(@PathVariable Long eventId) {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            savedEventService.unsaveEvent(username, eventId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/check/{eventId}")
    public ResponseEntity<Boolean> isEventSaved(@PathVariable Long eventId) {
        String username = getCurrentUsername();
        if (username == null) {
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(savedEventService.isEventSaved(username, eventId));
    }
}
