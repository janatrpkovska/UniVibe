package com.univibe.backend.service.impl;

import com.univibe.backend.model.Faculty;
import com.univibe.backend.repository.FacultyJpaRepository;
import com.univibe.backend.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {
    private final FacultyJpaRepository facultyJpaRepository;

    @Override
    public Faculty findById(Long id) {
        return facultyJpaRepository.findById(id).orElse(null);
    }

    @Override
    public Faculty findByName(String name) {
        return facultyJpaRepository.findByName(name);
    }

    @Override
    public Faculty createFaculty(String name) {
        Faculty faculty = new Faculty();
        faculty.setName(name);

        return facultyJpaRepository.save(faculty);
    }

    @Override
    public Faculty updateFaculty(Long id, String name) {
        Faculty faculty = this.findById(id);
        faculty.setName(name);
        return facultyJpaRepository.save(faculty);
    }

    @Override
    public List<Faculty> findAll() {
        return facultyJpaRepository.findAll();
    }

    @Override
    public Faculty deleteFaculty(Long id) {
        Faculty toDelete = this.findById(id);
        facultyJpaRepository.delete(toDelete);
        return toDelete;
    }
}
