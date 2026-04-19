package com.paf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceWebSocketMessage {
    private String action; // CREATE, UPDATE, DELETE, STATUS_CHANGE
    private ResourceResponseDTO resource;
    private String message;
    private Long timestamp;
}
