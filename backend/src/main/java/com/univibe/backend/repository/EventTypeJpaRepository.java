package com.univibe.backend.repository;

import com.univibe.backend.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTypeJpaRepository extends JpaRepository<EventType, Long> {
}
