package com.paf.backend.service;

import com.paf.backend.dto.ResourceStatsResponseDTO;
import com.paf.backend.dto.ResourceRequestDTO;
import com.paf.backend.dto.ResourceResponseDTO;
import com.paf.backend.dto.ResourceWebSocketMessage;
import com.paf.backend.model.Resource;
import com.paf.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create a new resource
     */
    public ResourceResponseDTO create(ResourceRequestDTO requestDTO) {
        if (resourceRepository.existsByName(requestDTO.getName())) {
            throw new IllegalArgumentException("Resource with name '" + requestDTO.getName() + "' already exists");
        }

        Resource resource = new Resource();
        mapDTOToEntity(requestDTO, resource);

        Resource savedResource = resourceRepository.save(resource);
        ResourceResponseDTO responseDTO = mapEntityToDTO(savedResource);

        // Send WebSocket message to all subscribers
        sendWebSocketMessage("CREATE", responseDTO, "Resource created: " + responseDTO.getName());

        return responseDTO;
    }

    /**
     * Update an existing resource
     */
    @CacheEvict(value = "resourceAvailability", allEntries = true)
    public ResourceResponseDTO update(Long id, ResourceRequestDTO requestDTO) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!resource.getName().equals(requestDTO.getName()) && resourceRepository.existsByName(requestDTO.getName())) {
            throw new IllegalArgumentException("Resource with name '" + requestDTO.getName() + "' already exists");
        }

        mapDTOToEntity(requestDTO, resource);
        Resource updatedResource = resourceRepository.save(resource);
        ResourceResponseDTO responseDTO = mapEntityToDTO(updatedResource);

        // Send WebSocket message to all subscribers
        sendWebSocketMessage("UPDATE", responseDTO, "Resource updated: " + responseDTO.getName());

        return responseDTO;
    }

    /**
     * Soft delete - set status to OUT_OF_SERVICE
     */
    @CacheEvict(value = "resourceAvailability", allEntries = true)
    public void delete(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

        resource.setStatus(Resource.ResourceStatus.OUT_OF_SERVICE);
        resourceRepository.save(resource);

        // Send WebSocket message to all subscribers
        ResourceResponseDTO responseDTO = mapEntityToDTO(resource);
        sendWebSocketMessage("DELETE", responseDTO, "Resource deleted (soft): " + responseDTO.getName());
    }

    /**
     * Get resource by id
     */
    @Transactional(readOnly = true)
    public ResourceResponseDTO getById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

        return mapEntityToDTO(resource);
    }

    /**
     * Get all resources with pagination
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> getAll(Pageable pageable) {
        return resourceRepository.findAll(pageable)
                .map(this::mapEntityToDTO);
    }

    /**
     * Get all active resources with pagination
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> getAllActive(Pageable pageable) {
        return resourceRepository.findByStatus(Resource.ResourceStatus.ACTIVE, pageable)
                .map(this::mapEntityToDTO);
    }

    /**
     * Search resources by type
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchByType(Resource.ResourceType type) {
        return resourceRepository.findByType(type).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search resources by status
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchByStatus(Resource.ResourceStatus status) {
        return resourceRepository.findByStatus(status).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search resources by minimum capacity
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchByCapacity(Integer minCapacity) {
        return resourceRepository.findByCapacityGreaterThanEqual(minCapacity).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search resources by location (contains)
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchByLocation(String location) {
        return resourceRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search resources by name (contains)
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchByName(String name) {
        return resourceRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search resources with multiple filters
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> searchWithFilters(
            Resource.ResourceStatus status,
            Resource.ResourceType type,
            Integer minCapacity,
            String location,
            String name) {

        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> minCapacity == null || r.getCapacity() >= minCapacity)
                .filter(r -> location == null || r.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(r -> name == null || r.getName().toLowerCase().contains(name.toLowerCase()))
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update resource status
     */
    @CacheEvict(value = "resourceAvailability", allEntries = true)
    public ResourceResponseDTO updateStatus(Long id, Resource.ResourceStatus newStatus) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

        resource.setStatus(newStatus);
        Resource updatedResource = resourceRepository.save(resource);
        ResourceResponseDTO responseDTO = mapEntityToDTO(updatedResource);

        // Send WebSocket message to all subscribers
        sendWebSocketMessage("STATUS_CHANGE", responseDTO, "Resource status changed to: " + newStatus);

        return responseDTO;
    }

    /**
     * Check if a resource is available for a given time slot
     * Returns true if the resource is ACTIVE and the time slot falls within availability window
     */
    @Transactional(readOnly = true)
    public boolean isAvailableForTimeSlot(Long id, LocalTime startTime, LocalTime endTime) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

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

    /**
     * Check if a resource is available at a specific time
     */
    @Transactional(readOnly = true)
    public boolean isAvailableAtTime(Long id, LocalTime time) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));

        // Check if resource status is ACTIVE
        if (resource.getStatus() != Resource.ResourceStatus.ACTIVE) {
            return false;
        }

        // Check if the time is within availability window
        LocalTime windowStart = resource.getAvailabilityWindowStart();
        LocalTime windowEnd = resource.getAvailabilityWindowEnd();

        return !time.isBefore(windowStart) && !time.isAfter(windowEnd);
    }

    /**
     * Get resource statistics
     */
    @Transactional(readOnly = true)
    public ResourceStatsResponseDTO getResourceStats() {
        long totalResources = resourceRepository.count();

        Map<Resource.ResourceType, Long> countByType = Map.of(
            Resource.ResourceType.LECTURE_HALL, resourceRepository.countByType(Resource.ResourceType.LECTURE_HALL),
            Resource.ResourceType.LAB, resourceRepository.countByType(Resource.ResourceType.LAB),
            Resource.ResourceType.MEETING_ROOM, resourceRepository.countByType(Resource.ResourceType.MEETING_ROOM),
            Resource.ResourceType.EQUIPMENT, resourceRepository.countByType(Resource.ResourceType.EQUIPMENT)
        );

        Map<Resource.ResourceStatus, Long> countByStatus = Map.of(
            Resource.ResourceStatus.ACTIVE, resourceRepository.countByStatus(Resource.ResourceStatus.ACTIVE),
            Resource.ResourceStatus.OUT_OF_SERVICE, resourceRepository.countByStatus(Resource.ResourceStatus.OUT_OF_SERVICE),
            Resource.ResourceStatus.MAINTENANCE, resourceRepository.countByStatus(Resource.ResourceStatus.MAINTENANCE)
        );

        return new ResourceStatsResponseDTO(totalResources, countByType, countByStatus);
    }

    /**
     * Map ResourceRequestDTO to Resource entity
     */
    private void mapDTOToEntity(ResourceRequestDTO dto, Resource entity) {
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setCapacity(dto.getCapacity());
        entity.setLocation(dto.getLocation());
        entity.setStatus(dto.getStatus());
        entity.setAvailabilityWindowStart(dto.getAvailabilityWindowStart());
        entity.setAvailabilityWindowEnd(dto.getAvailabilityWindowEnd());
        entity.setDescription(dto.getDescription());
    }

    /**
     * Map Resource entity to ResourceResponseDTO
     */
    private ResourceResponseDTO mapEntityToDTO(Resource entity) {
        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setCapacity(entity.getCapacity());
        dto.setLocation(entity.getLocation());
        dto.setStatus(entity.getStatus());
        dto.setAvailabilityWindowStart(entity.getAvailabilityWindowStart());
        dto.setAvailabilityWindowEnd(entity.getAvailabilityWindowEnd());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    /**
     * Send WebSocket message to all connected clients
     */
    private void sendWebSocketMessage(String action, ResourceResponseDTO resource, String message) {
        try {
            ResourceWebSocketMessage wsMessage = new ResourceWebSocketMessage();
            wsMessage.setAction(action);
            wsMessage.setResource(resource);
            wsMessage.setMessage(message);
            wsMessage.setTimestamp(System.currentTimeMillis());

            // Send to /topic/resources topic
            messagingTemplate.convertAndSend("/topic/resources", wsMessage);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Error sending WebSocket message: " + e.getMessage());
        }
    }
}
