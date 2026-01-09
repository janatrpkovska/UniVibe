package com.univibe.backend.service.impl;

import com.univibe.backend.model.EventType;
import com.univibe.backend.repository.EventTypeJpaRepository;
import com.univibe.backend.service.EventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventTypeServiceImpl implements EventTypeService {
    private final EventTypeJpaRepository eventTypeJpaRepository;

    @Override
    public EventType findEventTypeById(Long id) {
        return eventTypeJpaRepository.findById(id).orElse(null);
    }

    @Override
    public EventType findEventTypeByName(String name) {
        return eventTypeJpaRepository.findByName(name);
    }

    @Override
    public EventType createEventType(String name) {
        EventType eventType = new EventType();
        eventType.setName(name);
        return eventTypeJpaRepository.save(eventType);
    }

    @Override
    public EventType updateEventType(Long id, String name) {
        EventType eventType = this.findEventTypeById(id);
        eventType.setName(name);

        return eventTypeJpaRepository.save(eventType);
    }

    @Override
    public EventType deleteEventType(Long id) {
        EventType toDelete = this.findEventTypeById(id);
        eventTypeJpaRepository.delete(toDelete);
        return toDelete;
    }

    @Override
    public List<EventType> findAllEventTypes() {
        return eventTypeJpaRepository.findAll();
    }
}
