package com.univibe.backend.repository;

import com.univibe.backend.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyJpaRepository extends JpaRepository<Faculty, Long> {
    Faculty findByName(String name);
}
