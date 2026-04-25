package com.paf.backend.repository;

import com.paf.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resId " +
           "AND b.status = 'APPROVED' " +
           "AND b.startTime < :end AND b.endTime > :start")
    List<Booking> findOverlappingBookings(
            @Param("resId") String resourceId, 
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    List<Booking> findByUserId(Long userId);
}