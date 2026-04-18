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
// OPTIONAL: Since you have SecurityConfig, you can restrict this to your React
// URL
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. POST: Create a new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking created = bookingService.requestBooking(booking);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // 2. GET: Retrieve all bookings (For Admin View)
    // Map this to /api/bookings/all to match your SecurityConfig ADMIN rule
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * FIX 1: Added ("userId") inside @PathVariable.
     * This ensures the {userId} in the URL maps perfectly to the Long variable.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable("userId") Long userId) {
        List<Booking> userBookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(userBookings);
    }

    // 3. PATCH: Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable("id") Long id, // Added ("id") for strict mapping
            @RequestParam String status,
            @RequestParam(required = false) String reason) {

        Booking updated = bookingService.updateStatus(id, status, reason);
        return ResponseEntity.ok(updated);
    }

    // 4. DELETE: Cancel/Remove a booking record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}