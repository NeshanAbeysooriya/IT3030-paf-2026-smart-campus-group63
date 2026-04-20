package com.paf.backend.controller;

import com.paf.backend.model.Comment;
import com.paf.backend.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping
    public Comment add(@RequestBody Comment c) {
        return service.add(c);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<Comment> get(@PathVariable Long ticketId) {
        return service.getByTicket(ticketId);
    }
}