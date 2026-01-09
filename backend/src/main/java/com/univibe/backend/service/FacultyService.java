package com.univibe.backend.service;

import com.univibe.backend.model.Faculty;

import java.util.List;

public interface FacultyService {
    Faculty findById(Long id);
    Faculty findByName(String name);
    Faculty createFaculty(String name);
    Faculty updateFaculty(Long id, String name);
    List<Faculty> findAll();
    Faculty deleteFaculty(Long id);
}
