package com.univibe.backend.service.impl;

import com.univibe.backend.model.Event;
import com.univibe.backend.model.SavedEvent;
import com.univibe.backend.model.User;
import com.univibe.backend.repository.EventJpaRepository;
import com.univibe.backend.repository.SavedEventJpaRepository;
import com.univibe.backend.repository.UserJpaRepository;
import com.univibe.backend.service.SavedEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedEventServiceImpl implements SavedEventService {
    private final SavedEventJpaRepository savedEventRepository;
    private final UserJpaRepository userRepository;
    private final EventJpaRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Event> getSavedEventsForUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();
        return savedEventRepository.findByUserWithEvent(user)
                .stream()
                .map(SavedEvent::getEvent)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void saveEvent(String username, Long eventId) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (savedEventRepository.existsByUserAndEvent(user, event)) return;
        savedEventRepository.save(new SavedEvent(user, event));
    }

    @Override
    @Transactional
    public void unsaveEvent(String username, Long eventId) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        savedEventRepository.deleteByUserAndEvent(user, event);
    }

    @Override
    public boolean isEventSaved(String username, Long eventId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return false;
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return false;
        return savedEventRepository.existsByUserAndEvent(user, event);
    }
}
