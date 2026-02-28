package com.univibe.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "saved_events", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "event_id"})
})
public class SavedEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private Instant savedAt;

    @PrePersist
    public void prePersist() {
        if (savedAt == null) savedAt = Instant.now();
    }

    public SavedEvent() {}

    public SavedEvent(User user, Event event) {
        this.user = user;
        this.event = event;
    }
}
