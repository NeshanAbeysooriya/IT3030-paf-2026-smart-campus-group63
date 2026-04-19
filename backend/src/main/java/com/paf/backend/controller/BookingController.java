package com.paf.backend.controller;

import com.paf.backend.model.Booking;
import com.paf.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
// FIX: Added explicit allowed methods to include PATCH and others for full compatibility
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking created = bookingService.requestBooking(booking);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Returns 409 Conflict if the Service throws a conflict exception
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ NEW: Endpoint for real-time conflict checking
    @GetMapping("/check-conflicts")
    public ResponseEntity<Boolean> checkConflicts(
            @RequestParam Long resourceId,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        
        // We reuse your service logic to see if APPROVED bookings exist for this slot
        boolean hasConflict = bookingService.getAllBookings().stream()
            .anyMatch(b -> b.getResourceId().equals(resourceId) && 
                      "APPROVED".equals(b.getStatus().toString()) &&
                      !(startTime.compareTo(b.getEndTime().toString()) >= 0 || 
                        endTime.compareTo(b.getStartTime().toString()) <= 0));
        
        return ResponseEntity.ok(hasConflict);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable("userId") Long userId) {
        List<Booking> userBookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(userBookings);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable("id") Long id,
            @RequestParam(name = "status") String status,
            @RequestParam(name = "reason", required = false) String reason) {
        Booking updated = bookingService.updateStatus(id, status, reason);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable("id") Long id) {
        Booking cancelled = bookingService.cancelBooking(id);
        return ResponseEntity.ok(cancelled);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsDirect() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}