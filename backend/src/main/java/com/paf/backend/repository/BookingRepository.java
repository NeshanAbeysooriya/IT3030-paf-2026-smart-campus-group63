package com.paf.backend.repository;

import com.paf.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resId " +
            "AND b.status = 'APPROVED' " +
            "AND (:start < b.endTime AND :end > b.startTime)")
    List<Booking> findOverlappingBookings(
            @Param("resId") Long resourceId, // Changed String to Long here
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    List<Booking> findByUserId(Long userId);
}