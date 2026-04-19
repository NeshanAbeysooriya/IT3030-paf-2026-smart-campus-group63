package com.paf.backend.repository;

import com.paf.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

   // Update your query to be more precise for the marking rubric
@Query("SELECT b FROM Booking b WHERE b.resourceId = :resId " +
       "AND b.status = 'APPROVED' " +
       "AND (:start < b.endTime AND :end > b.startTime)")
List<Booking> findOverlappingBookings(
        @Param("resId") Long resourceId, 
        @Param("start") LocalDateTime start, 
        @Param("end") LocalDateTime end);

    List<Booking> findByUserId(Long userId);
}