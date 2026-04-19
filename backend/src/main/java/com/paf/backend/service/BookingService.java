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
    private NotificationService notificationService;

    public Booking requestBooking(Booking booking) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

        // Only block if a booking in this slot is already APPROVED
        boolean hasApprovedConflict = conflicts.stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.APPROVED);

        if (hasApprovedConflict) {
            throw new RuntimeException("Conflict: Resource is already booked for this time.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(Long id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());

        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

            boolean hasOtherApproved = conflicts.stream()
                    .anyMatch(b -> !b.getId().equals(id) && b.getStatus() == BookingStatus.APPROVED);

            if (hasOtherApproved) {
                throw new BookingConflictException("Resource is already booked for this time.");
            }
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    /**
     * FULLY COMPLETE CANCELLATION LOGIC
     * Follows the workflow: PENDING/APPROVED -> CANCELLED
     */
    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new RuntimeException("Cannot cancel a booking that has already been rejected.");
        }
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}