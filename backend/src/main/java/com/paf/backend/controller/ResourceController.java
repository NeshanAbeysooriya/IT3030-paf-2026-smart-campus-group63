package com.paf.backend.controller;

import com.paf.backend.dto.ResourceRequestDTO;
import com.paf.backend.dto.ResourceResponseDTO;
import com.paf.backend.model.Resource;
import com.paf.backend.service.ResourceAvailabilityService;
import com.paf.backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;
    private final ResourceAvailabilityService resourceAvailabilityService;

    /**
     * Create a new resource (Admin only)
     * POST /api/resources
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO requestDTO) {
        try {
            ResourceResponseDTO createdResource = resourceService.create(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Update a resource (Admin only)
     * PUT /api/resources/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        try {
            ResourceResponseDTO updatedResource = resourceService.update(id, requestDTO);
            return ResponseEntity.ok(updatedResource);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Soft delete a resource (Admin only) - sets status to OUT_OF_SERVICE
     * DELETE /api/resources/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        try {
            resourceService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get all resources with pagination (Authenticated users)
     * GET /api/resources?page=0&size=10
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ResourceResponseDTO> resources = resourceService.getAll(pageable);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get a single resource by ID (Public)
     * GET /api/resources/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        try {
            ResourceResponseDTO resource = resourceService.getById(id);
            return ResponseEntity.ok(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Search resources with filters (Public)
     * GET /api/resources/search?type=LECTURE_HALL&status=ACTIVE&minCapacity=20&location=Block%20A&name=Room
     */
    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Resource.ResourceStatus status,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name) {

        List<ResourceResponseDTO> resources = resourceService.searchWithFilters(
                status, type, minCapacity, location, name);
        return ResponseEntity.ok(resources);
    }

    /**
     * Get only active resources (Public)
     * GET /api/resources/available?page=0&size=10
     */
    @GetMapping("/available")
    public ResponseEntity<Page<ResourceResponseDTO>> getAvailableResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ResourceResponseDTO> activeResources = resourceService.getAllActive(pageable);
        return ResponseEntity.ok(activeResources);
    }

    /**
     * Update resource status (Admin only)
     * PATCH /api/resources/{id}/status?newStatus=MAINTENANCE
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam Resource.ResourceStatus newStatus) {
        try {
            ResourceResponseDTO updatedResource = resourceService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updatedResource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Check if a resource is available for a time slot (Public)
     * GET /api/resources/{id}/check-availability?startTime=09:00&endTime=10:00
     */
    @GetMapping("/{id}/check-availability")
    public ResponseEntity<?> checkResourceAvailability(
            @PathVariable Long id,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            LocalTime start = LocalTime.parse(startTime);
            LocalTime end = LocalTime.parse(endTime);

            boolean isAvailable = resourceAvailabilityService.isResourceAvailable(id, start, end);
            return ResponseEntity.ok(new AvailabilityCheckResponse(isAvailable));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Invalid time format. Use HH:mm"));
        }
    }

    /**
     * Search by type (Public)
     * GET /api/resources/type/LECTURE_HALL
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceResponseDTO>> searchByType(@PathVariable Resource.ResourceType type) {
        List<ResourceResponseDTO> resources = resourceService.searchByType(type);
        return ResponseEntity.ok(resources);
    }

    /**
     * Search by status (Public)
     * GET /api/resources/status/ACTIVE
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ResourceResponseDTO>> searchByStatus(@PathVariable Resource.ResourceStatus status) {
        List<ResourceResponseDTO> resources = resourceService.searchByStatus(status);
        return ResponseEntity.ok(resources);
    }

    /**
     * Search by minimum capacity (Public)
     * GET /api/resources/capacity/50
     */
    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<List<ResourceResponseDTO>> searchByCapacity(@PathVariable Integer minCapacity) {
        if (minCapacity <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        List<ResourceResponseDTO> resources = resourceService.searchByCapacity(minCapacity);
        return ResponseEntity.ok(resources);
    }

    /**
     * Search by location (Public)
     * GET /api/resources/location/Block%20A
     */
    @GetMapping("/location/{location}")
    public ResponseEntity<List<ResourceResponseDTO>> searchByLocation(@PathVariable String location) {
        List<ResourceResponseDTO> resources = resourceService.searchByLocation(location);
        return ResponseEntity.ok(resources);
    }

    /**
     * Search by name (Public)
     * GET /api/resources/name/Lecture%20Hall%201
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<List<ResourceResponseDTO>> searchByName(@PathVariable String name) {
        List<ResourceResponseDTO> resources = resourceService.searchByName(name);
        return ResponseEntity.ok(resources);
    }

    // Helper classes for response DTOs
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class AvailabilityCheckResponse {
        private boolean available;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private String message;
    }
}
