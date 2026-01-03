package com.univibe.backend.dto;

import com.univibe.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventFilterDTO {
    private String keyword;
    private Category category;
    private EventType eventType;
    private Faculty faculty;
    private EventStatus status;
    private EventMode mode;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private int pageNumber = 0;
    private int pageSize = 10;
}
