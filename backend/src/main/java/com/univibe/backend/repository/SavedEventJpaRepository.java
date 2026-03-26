package com.univibe.backend.repository;

import com.univibe.backend.model.Event;
import com.univibe.backend.model.SavedEvent;
import com.univibe.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedEventJpaRepository extends JpaRepository<SavedEvent, Long> {

    @Query("SELECT se FROM SavedEvent se JOIN FETCH se.event e LEFT JOIN FETCH e.category LEFT JOIN FETCH e.eventType LEFT JOIN FETCH e.faculty WHERE se.user = :user ORDER BY se.savedAt DESC")
    List<SavedEvent> findByUserWithEvent(@Param("user") User user);

    List<SavedEvent> findByUserOrderBySavedAtDesc(User user);

    Optional<SavedEvent> findByUserAndEvent(User user, Event event);

    boolean existsByUserAndEvent(User user, Event event);

    void deleteByUserAndEvent(User user, Event event);
}
