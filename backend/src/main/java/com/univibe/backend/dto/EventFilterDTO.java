package com.univibe.backend.dto;

import com.univibe.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventFilterDTO {
    private Category category;
    private EventType eventType;
    private Faculty faculty;
    private EventStatus status;
    private EventMode mode;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
