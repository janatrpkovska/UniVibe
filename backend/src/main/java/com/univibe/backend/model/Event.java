package com.univibe.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDate endDate;
    private String location;
    private String image_url;

    @Enumerated(value = EnumType.STRING)
    private EventMode mode;

    @Enumerated(value = EnumType.STRING)
    private EventStatus status;

    @Enumerated(value = EnumType.STRING)
    private EventSource source;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "eventType_id", nullable = true)
    private EventType eventType;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = true)
    private Faculty faculty;

    public Event(String title, String description, LocalDateTime startDate, LocalDate endDate, String location,
                 String image_url, Category category, EventType eventType, Faculty faculty) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.image_url = image_url;
        this.mode = EventMode.HYBRID;
        this.status = EventStatus.SCHEDULED;
        this.source = EventSource.MANUAL;
        this.category = category;
        this.eventType = eventType;
        this.faculty = faculty;
    }

    public Event () {}
}
