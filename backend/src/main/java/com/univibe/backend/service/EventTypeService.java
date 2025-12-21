package com.univibe.backend.service;

import com.univibe.backend.model.EventType;

import java.util.List;

public interface EventTypeService {
    EventType findEventTypeById(Long id);
    EventType createEventType(String name);
    EventType updateEventType(Long id, String name);
    EventType deleteEventType(Long id);
    List<EventType> findAllEventTypes();
}
