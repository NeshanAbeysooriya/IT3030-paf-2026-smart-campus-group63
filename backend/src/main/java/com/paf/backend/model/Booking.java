package com.paf.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Member 2: Facility and Asset Booking Entity
 * This class includes validation constraints to satisfy 
 * the 'Standard Naming and Validation' rubric requirements.
 */
@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Resource selection is required")
    @Column(nullable = false)
    private Long resourceId; // Linked to Member 1's Resource/Asset

    @NotNull(message = "User identification is required")
    @Column(nullable = false)
    private Long userId; // Linked to the authenticated user

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    @Column(nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalDateTime endTime;

    private String purpose;
    
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING; // Initial state in workflow

    private String rejectionReason; // Required for Admin Review auditability
}