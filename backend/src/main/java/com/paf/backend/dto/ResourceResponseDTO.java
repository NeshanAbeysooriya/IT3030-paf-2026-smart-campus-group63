package com.paf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.paf.backend.model.Resource.ResourceType;
import com.paf.backend.model.Resource.ResourceStatus;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponseDTO {

    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private ResourceStatus status;
    private LocalTime availabilityWindowStart;
    private LocalTime availabilityWindowEnd;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
