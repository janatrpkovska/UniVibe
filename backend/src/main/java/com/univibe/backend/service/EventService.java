package com.univibe.backend.service;

import com.univibe.backend.dto.EventFilterDTO;
import com.univibe.backend.model.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    Event createEvent(String title, String description, LocalDateTime startDate, LocalDate endDate, String location, String image_url, Category category, EventType eventType, Faculty faculty);
    Event updateEvent(Long id, String title, String description, LocalDateTime startDate, LocalDate endDate, String location, String image_url, EventMode mode, EventStatus status, EventSource source, Category category, EventType eventType, Faculty faculty);
    Event findById(Long id);
    Event deleteEvent(Long id);
    List<Event> findAll();
    List<Event> findAllByCategory(Category category);
    List<Event> filteredEvents (EventFilterDTO eventFilterDTO);
}
