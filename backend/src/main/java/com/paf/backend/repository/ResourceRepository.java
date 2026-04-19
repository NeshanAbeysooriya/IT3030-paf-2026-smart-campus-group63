package com.paf.backend.repository;

import com.paf.backend.model.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Find all resources by status
     */
    List<Resource> findByStatus(Resource.ResourceStatus status);

    /**
     * Find all resources by status with pagination
     */
    Page<Resource> findByStatus(Resource.ResourceStatus status, Pageable pageable);

    /**
     * Find all resources by type
     */
    List<Resource> findByType(Resource.ResourceType type);

    /**
     * Find all resources with capacity greater than or equal to the specified value
     */
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    /**
     * Find all resources where location contains the specified text (case-insensitive)
     */
    List<Resource> findByLocationContainingIgnoreCase(String location);

    /**
     * Find all resources where name contains the specified text (case-insensitive)
     */
    List<Resource> findByNameContainingIgnoreCase(String name);

    /**
     * Check if a resource with the specified name exists
     */
    boolean existsByName(String name);

    /**
     * Find all resources by status and type
     */
    List<Resource> findByStatusAndType(Resource.ResourceStatus status, Resource.ResourceType type);

    /**
     * Find all resources by status and capacity greater than or equal to the specified value
     */
    List<Resource> findByStatusAndCapacityGreaterThanEqual(Resource.ResourceStatus status, Integer capacity);
}
