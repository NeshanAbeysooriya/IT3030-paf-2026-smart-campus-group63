package com.paf.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Resource type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    @NotNull(message = "Availability start time is required")
    @Column(nullable = false)
    private LocalTime availabilityWindowStart;

    @NotNull(message = "Availability end time is required")
    @Column(nullable = false)
    private LocalTime availabilityWindowEnd;

    @Column(length = 1000, columnDefinition = "TEXT")
    private String description;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ResourceType {
        LECTURE_HALL,
        LAB,
        MEETING_ROOM,
        EQUIPMENT
    }

    public enum ResourceStatus {
        ACTIVE,
        OUT_OF_SERVICE,
        MAINTENANCE
    }
}
