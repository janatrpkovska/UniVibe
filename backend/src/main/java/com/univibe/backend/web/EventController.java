package com.univibe.backend.web;

import com.univibe.backend.dto.EventFilterDTO;
import com.univibe.backend.dto.EventRequest;
import com.univibe.backend.model.Category;
import com.univibe.backend.model.Event;
import com.univibe.backend.model.EventType;
import com.univibe.backend.service.CategoryService;
import com.univibe.backend.service.EventService;
import com.univibe.backend.service.EventTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class EventController {
    private final EventService eventService;
    private final CategoryService categoryService;
    private final EventTypeService eventTypeService;

    @GetMapping("/get-events")
    public List<Event> getAllEvents() {
        return eventService.findAll();
    }

    @GetMapping("/get-event/{id}")
    public Event getEvent(@PathVariable Long id) {
        return eventService.findById(id);
    }

    @GetMapping("/get-events/category")
    public List<Event> getEventsByCategory(@RequestParam String category) {
        Category category1 = categoryService.getCategoryByName(category);

        return eventService.findAllByCategory(category1);
    }

    @PostMapping("/create-event")
    public Event createEvent(@RequestBody EventRequest eventRequest) {
        return this.eventService.createEvent(
                eventRequest.getTitle(),
                eventRequest.getDescription(),
                eventRequest.getStartDate(),
                eventRequest.getEndDate(),
                eventRequest.getLocation(),
                eventRequest.getImage_url(),
                eventRequest.getCategory(),
                eventRequest.getEventType(),
                eventRequest.getFaculty()
        );
    }

    @PostMapping("/create-event-type")
    public EventType createEventType(@RequestBody EventType eventType) {
        return eventTypeService.createEventType(eventType.getName());
    }

    @PostMapping("/edit-event-type")
    public EventType editEventType(@RequestBody EventType eventType) {
        return eventTypeService.updateEventType(eventType.getId(), eventType.getName());
    }

    @DeleteMapping("/delete-event-type/{id}")
    public void deleteEventType(@PathVariable Long id) {
        eventTypeService.deleteEventType(id);
    }

    @GetMapping("/all-event-types")
    public List<EventType> getAllEventTypes() {
        return eventTypeService.findAllEventTypes();
    }

    @GetMapping("/filtered-events")
    public List<Event> getFilteredEvents(EventFilterDTO eventFilterDTO) {
        return eventService.filteredEvents(eventFilterDTO);
    }
}
