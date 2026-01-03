package com.univibe.backend.web;

import com.univibe.backend.model.Faculty;
import com.univibe.backend.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {
    private final FacultyService facultyService;

    @GetMapping("/public/get-all")
    public List<Faculty> getAllFaculties() {
        return facultyService.findAll();
    }

    @PostMapping("/create-faculty")
    @PreAuthorize("hasRole('ADMIN')")
    public Faculty createFaculty(@RequestBody Faculty faculty) {
        return facultyService.createFaculty(faculty.getName());
    }

    @PostMapping("/update-faculty")
    @PreAuthorize("hasRole('ADMIN')")
    public Faculty updateFaculty(@RequestBody Faculty faculty) {
        return facultyService.updateFaculty(faculty.getId(), faculty.getName());
    }

    @DeleteMapping("/delete-faculty/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
    }
}
