package com.univibe.backend.service.impl;

import com.univibe.backend.dto.EventFilterDTO;
import com.univibe.backend.model.*;
import com.univibe.backend.repository.EventJpaRepository;
import com.univibe.backend.service.EventService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {
    private final EventJpaRepository eventJpaRepository;

    public EventServiceImpl(EventJpaRepository eventJpaRepository) {
        this.eventJpaRepository = eventJpaRepository;
    }

    @Override
    public Event createEvent(String title, String description, LocalDateTime startDate, LocalDate endDate, String location, String image_url, Category category, EventType eventType, Faculty faculty) {
        Event event = new Event(
                title,
                description,
                startDate,
                endDate,
                location,
                image_url,
                category,
                eventType,
                faculty
        );

        return eventJpaRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, String title, String description, LocalDateTime startDate, LocalDate endDate, String location, String image_url, EventMode mode, EventStatus status, EventSource source, Category category, EventType eventType, Faculty faculty) {
        Event event = this.findById(id);
        event.setTitle(title);
        event.setDescription(description);
        event.setStartDate(startDate);
        event.setEndDate(endDate);
        event.setLocation(location);
        event.setImage_url(image_url);
        event.setMode(mode);
        event.setEventType(eventType);
        event.setFaculty(faculty);
        event.setCategory(category);
        event.setStatus(status);
        event.setSource(source);
        return eventJpaRepository.save(event);
    }

    @Override
    public Event findById(Long id) {
        return eventJpaRepository.findById(id).orElse(null);
    }

    @Override
    public Event deleteEvent(Long id) {
        Event toDelete = this.findById(id);
        eventJpaRepository.delete(toDelete);
        return toDelete;
    }

    @Override
    public List<Event> findAll() {
        return eventJpaRepository.findAll();
    }

    @Override
    public List<Event> findAllByCategory(Category category) {
        return eventJpaRepository.findAllByCategory(category);
    }

    @Override
    public List<Event> filteredEvents(EventFilterDTO filter) {
        Specification<Event> spec = Specification.where(null);

        if (filter.getCategory() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), filter.getCategory()));
        }
        if (filter.getEventType() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("eventType"), filter.getEventType()));
        }
        if (filter.getFaculty() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("faculty"), filter.getFaculty()));
        }
        if (filter.getStatus() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), filter.getStatus()));
        }
        if (filter.getMode() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("mode"), filter.getMode()));
        }
        if (filter.getStartDate() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("startDate"), filter.getStartDate()));
        }
        if (filter.getEndDate() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("endDate"), filter.getEndDate()));
        }

        return eventJpaRepository.findAll(spec);
    }
}
