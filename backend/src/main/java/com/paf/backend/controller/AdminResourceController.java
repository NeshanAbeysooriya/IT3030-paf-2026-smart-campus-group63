package com.paf.backend.controller;

import com.paf.backend.dto.ResourceStatsResponseDTO;
import com.paf.backend.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/resources")
@RequiredArgsConstructor
public class AdminResourceController {

    private final ResourceService resourceService;

    /**
     * Get resource statistics (Admin only)
     * GET /api/admin/resources/stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceStatsResponseDTO> getResourceStats() {
        ResourceStatsResponseDTO stats = resourceService.getResourceStats();
        return ResponseEntity.ok(stats);
    }
}