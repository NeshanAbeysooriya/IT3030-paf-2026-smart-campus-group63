package com.paf.backend.service;

import com.paf.backend.model.Comment;
import com.paf.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository repo;

    public CommentService(CommentRepository repo) {
        this.repo = repo;
    }

    public Comment add(Comment c) {
        if (c.getUser() == null || c.getUser().trim().isEmpty()) {
            c.setUser("Anonymous");
        }
        return repo.save(c);
    }

    public List<Comment> getByTicket(Long ticketId) {
        return repo.findAll()
                .stream()
                .filter(c -> c.getTicketId().equals(ticketId))
                .toList();
    }
}