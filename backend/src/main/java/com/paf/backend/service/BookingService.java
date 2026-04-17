package com.paf.backend.service;

import com.paf.backend.exception.BookingConflictException;
import com.paf.backend.model.Booking;
import com.paf.backend.model.BookingStatus;
import com.paf.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking request with PENDING status 
    public Booking requestBooking(Booking booking) {
        // Initial check: Prevent requesting if a slot is already taken 
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
            booking.getResourceId(), booking.getStartTime(), booking.getEndTime());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflict: Resource is already booked for this time.");
        }
        
        booking.setStatus(BookingStatus.PENDING); 
        return bookingRepository.save(booking);
    }

    // Get all bookings for Admin view 
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Update workflow status: APPROVED, REJECTED, or CANCELLED 
    public Booking updateStatus(Long id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());

        // CRITICAL: Final conflict check only if we are moving to APPROVED 
        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime());
            
            // We ignore the current booking itself in the conflict list
            boolean hasOtherApproved = conflicts.stream().anyMatch(b -> !b.getId().equals(id));
            
            if (hasOtherApproved) {
                throw new BookingConflictException("Resource is already booked for this time.");
            }
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(reason); // Store the reason for auditability [cite: 20, 36]
        return bookingRepository.save(booking);
    }

    // Delete/Remove a booking record [cite: 69]
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }
    
    // Get specific user bookings 
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}