package com.paf.backend.dto;

import com.paf.backend.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceStatsResponseDTO {

    private long totalResources;
    private Map<Resource.ResourceType, Long> countByType;
    private Map<Resource.ResourceStatus, Long> countByStatus;
}