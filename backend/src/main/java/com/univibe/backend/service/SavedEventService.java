package com.univibe.backend.service;

import com.univibe.backend.model.Event;

import java.util.List;

public interface SavedEventService {
    List<Event> getSavedEventsForUser(String username);

    void saveEvent(String username, Long eventId);

    void unsaveEvent(String username, Long eventId);

    boolean isEventSaved(String username, Long eventId);
}
