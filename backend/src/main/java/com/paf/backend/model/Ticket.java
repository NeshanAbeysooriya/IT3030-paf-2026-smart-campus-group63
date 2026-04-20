package com.paf.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String priority;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;   

    private String location;
    private String contact;
    private String createdBy;

    private String assignedTechnician;
    private String resolutionNotes;

    @ElementCollection
    private List<String> images;
}