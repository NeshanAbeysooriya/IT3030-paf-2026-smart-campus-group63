package com.paf.backend.service;

import com.paf.backend.model.Resource;
import com.paf.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceAvailabilityService {

    private final ResourceRepository resourceRepository;

    /**
     * Check if a resource is available for a given time slot
     * Returns true if the resource is ACTIVE and the time slot falls within availability window
     */
    @Cacheable(value = "resourceAvailability", key = "#resourceId + '_' + #startTime.toString() + '_' + #endTime.toString()")
    public boolean isResourceAvailable(Long resourceId, LocalTime startTime, LocalTime endTime) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + resourceId));

        // Check if resource status is ACTIVE
        if (resource.getStatus() != Resource.ResourceStatus.ACTIVE) {
            return false;
        }

        // Check if requested time slot is within availability window
        LocalTime windowStart = resource.getAvailabilityWindowStart();
        LocalTime windowEnd = resource.getAvailabilityWindowEnd();

        // The requested slot must start at or after window start and end at or before window end
        return !startTime.isBefore(windowStart) && !endTime.isAfter(windowEnd);
    }
}