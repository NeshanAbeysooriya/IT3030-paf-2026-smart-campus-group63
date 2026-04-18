package com.paf.backend.controller;

import com.paf.backend.model.Booking;
import com.paf.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // Allows React to connect
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. POST: Create a new booking (Individual Task)
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking created = bookingService.requestBooking(booking);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. GET: Retrieve all bookings (For Admin View)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 3. PATCH: Update status - APPROVED/REJECTED/CANCELLED (Workflow Task)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        
        Booking updated = bookingService.updateStatus(id, status, reason);
        return ResponseEntity.ok(updated);
    }

    // 4. DELETE: Cancel/Remove a booking record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}