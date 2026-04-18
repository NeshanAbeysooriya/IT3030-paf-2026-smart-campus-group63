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

    public Booking requestBooking(Booking booking) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflict: Resource is already booked for this time.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateStatus(Long id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());

        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

            boolean hasOtherApproved = conflicts.stream().anyMatch(b -> !b.getId().equals(id));

            if (hasOtherApproved) {
                throw new BookingConflictException("Resource is already booked for this time.");
            }
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    // Unified name to match the Controller call
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}