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

    /**
     * UPDATED: Added @GetMapping without a sub-path.
     * This ensures that when React calls "http://localhost:8081/api/bookings",
     * it correctly triggers this method instead of a 405 error.
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsDirect() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 2. GET: Retrieve all bookings (Explicitly for /all)
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable("userId") Long userId) {
        List<Booking> userBookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(userBookings);
    }

    // 3. PATCH: Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable("id") Long id,
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