package com.univibe.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequest {
    String title;
    String description;
    String date; // ISO date string
    String time; // Time string
    String location;
    String imageUrl;
    String categoryName; // Category name like "Технологија"
    String eventTypeName; // Event type name like "Работилница / Workshop"
    String facultyName; // Optional faculty name
    String mode; // "во живо" or "онлајн"
}
