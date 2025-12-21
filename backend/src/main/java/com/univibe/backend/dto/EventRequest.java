package com.univibe.backend.dto;

import com.univibe.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    Long id;
    String title;
    String description;
    LocalDateTime startDate;
    LocalDate endDate;
    String location;
    String image_url;
    EventMode mode;
    EventStatus status;
    EventSource source;
    Category category;
    EventType eventType;
    Faculty faculty;
}
