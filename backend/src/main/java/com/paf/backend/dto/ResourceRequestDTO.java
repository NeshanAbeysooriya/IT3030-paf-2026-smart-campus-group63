package com.paf.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.paf.backend.model.Resource.ResourceType;
import com.paf.backend.model.Resource.ResourceStatus;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequestDTO {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    @NotNull(message = "Availability start time is required")
    private LocalTime availabilityWindowStart;

    @NotNull(message = "Availability end time is required")
    private LocalTime availabilityWindowEnd;

    private String description;
}
