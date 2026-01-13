package com.univibe.backend.web;

import com.univibe.backend.dto.CreateEventRequest;
import com.univibe.backend.dto.EventFilterDTO;
import com.univibe.backend.dto.EventRequest;
import com.univibe.backend.model.Category;
import com.univibe.backend.model.Event;
import com.univibe.backend.model.EventType;
import com.univibe.backend.model.Faculty;
import com.univibe.backend.service.CategoryService;
import com.univibe.backend.service.EventService;
import com.univibe.backend.service.EventTypeService;
import com.univibe.backend.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/event")
public class EventController {
    private final EventService eventService;
    private final CategoryService categoryService;
    private final EventTypeService eventTypeService;
    private final FacultyService facultyService;

    @GetMapping("/public/get-events")
    public List<Event> getAllEvents() {
        return eventService.findAll();
    }

    @GetMapping("/public/get-latest")
    public List<Event> getLatestEvents() {
        return eventService.getLatestEvents();
    }

    @GetMapping("/public/get-event/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.findById(id);
    }

    @GetMapping("/public/get-events/category")
    public List<Event> getEventsByCategory(@RequestParam String category) {
        Category category1 = categoryService.getCategoryByName(category);

        return eventService.findAllByCategory(category1);
    }

    @GetMapping("/public/locations")
    public List<String> getLocations() {
        return eventService.findAll()
                .stream()
                .map(Event::getLocation)
                .distinct()
                .collect(Collectors.toList());
    }

    @PostMapping("/create-event")
    @PreAuthorize("hasRole('ADMIN')")
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

    @PostMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public Event createEventSimple(@RequestBody CreateEventRequest request) {
        // Parse date and time
        LocalDateTime startDate = LocalDateTime.parse(request.getDate() + "T" + request.getTime() + ":00");
        LocalDate endDate = LocalDate.parse(request.getDate());

        // Look up or create category
        Category category = categoryService.getCategoryByName(request.getCategoryName());
        if (category == null) {
            // Create category if it doesn't exist
            category = categoryService.addCategory(request.getCategoryName(), "");
        }

        // Look up or create event type
        EventType eventType = eventTypeService.findEventTypeByName(request.getEventTypeName());
        if (eventType == null) {
            // Create event type if it doesn't exist
            eventType = eventTypeService.createEventType(request.getEventTypeName());
        }

        // Look up or create faculty (optional)
        Faculty faculty = null;
        if (request.getFacultyName() != null && !request.getFacultyName().trim().isEmpty()) {
            faculty = facultyService.findByName(request.getFacultyName());
            if (faculty == null) {
                // Create faculty if it doesn't exist
                faculty = facultyService.createFaculty(request.getFacultyName());
            }
        }

        return this.eventService.createEvent(
                request.getTitle(),
                request.getDescription(),
                startDate,
                endDate,
                request.getLocation(),
                request.getImageUrl(),
                category,
                eventType,
                faculty
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-event-type")
    public EventType createEventType(@RequestBody EventType eventType) {
        return eventTypeService.createEventType(eventType.getName());
    }

    @PostMapping("/edit-event-type")
    @PreAuthorize("hasRole('ADMIN')")
    public EventType editEventType(@RequestBody EventType eventType) {
        return eventTypeService.updateEventType(eventType.getId(), eventType.getName());
    }

    @DeleteMapping("/delete-event-type/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEventType(@PathVariable Long id) {
        eventTypeService.deleteEventType(id);
    }

    @GetMapping("/public/all-event-types")
    public List<EventType> getAllEventTypes() {
        return eventTypeService.findAllEventTypes();
    }

    @GetMapping("/public/filtered-events")
    public Page<Event> getFilteredEvents(@RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) Long categoryId,
                                         @RequestParam(required = false) Long eventTypeId,
                                         @RequestParam(required = false) Long facultyId,
                                         @RequestParam(required = false) String location,
                                         @RequestParam(required = false) String date,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        boolean noFilters = (keyword == null || keyword.trim().isEmpty()) &&
                categoryId == null &&
                eventTypeId == null &&
                facultyId == null &&
                (location == null || location.trim().isEmpty()) &&
                (date == null || date.trim().isEmpty());

        if (noFilters) {
            return Page.empty(PageRequest.of(page, size));
        }

        EventFilterDTO filter = new EventFilterDTO();
        filter.setKeyword(keyword);
        filter.setLocation(location);

        if (categoryId != null) {
            filter.setCategory(categoryService.getCategoryById(categoryId));
        }
        if (eventTypeId != null) {
            filter.setEventType(eventTypeService.findEventTypeById(eventTypeId));
        }
        if (facultyId != null) {
            filter.setFaculty(facultyService.findById(facultyId));
        }
        if (date != null && !date.isEmpty()) {
            filter.setStartDate(LocalDate.parse(date));
        }

        filter.setPageNumber(page);
        filter.setPageSize(size);

        return eventService.filteredEvents(filter);
    }
}
