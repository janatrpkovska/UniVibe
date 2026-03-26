package com.univibe.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateEventRequest {
    String title;
    String description;
    String date;
    String endDate;
    String time;
    String location;
    String imageUrl;
    String categoryName;
    String eventTypeName;
    String facultyName;
    String mode;
}
