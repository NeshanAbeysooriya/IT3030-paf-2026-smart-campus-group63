package com.paf.backend.service;

import com.paf.backend.exception.BookingConflictException;
import com.paf.backend.model.Booking;
import com.paf.backend.model.BookingStatus;
import com.paf.backend.repository.BookingRepository;
import com.paf.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Booking requestBooking(Booking booking) {
        // STEP 1: Check for conflicts before doing anything else
        if (hasConflict(booking.getResourceId(), booking.getStartTime(), booking.getEndTime())) {
            throw new RuntimeException("Conflict: This resource is already booked for the selected time.");
        }

        // STEP 2: If no conflict, set status and save
        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        // =========================
        // ✅ NOTIFICATION ADDED
        // =========================
        if (booking.getUser() != null && booking.getUser().getEmail() != null) {
            notificationService.createNotificationByEmail(
                    booking.getUser().getEmail(),
                    "Your booking request is submitted and is PENDING approval.");
        }

        return savedBooking;
    }

    public boolean hasConflict(String resourceId, LocalDateTime start, LocalDateTime end) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(resourceId, start, end);
        return !conflicts.isEmpty();
    }

    public Booking updateStatus(Long id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value provided.");
        }

        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

            boolean hasOtherApproved = conflicts.stream()
                    .anyMatch(b -> !b.getId().equals(id) && b.getStatus() == BookingStatus.APPROVED);

            if (hasOtherApproved) {
                throw new BookingConflictException("Cannot approve: Resource is already booked for this time.");
            }
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(reason);

        Booking updatedBooking = bookingRepository.save(booking);

        // =========================
        // ✅ NOTIFICATION ADDED
        // =========================
        if (booking.getUser() != null && booking.getUser().getEmail() != null) {

            String message;

            if (newStatus == BookingStatus.APPROVED) {
                message = "Your booking has been APPROVED ✅";
            } else if (newStatus == BookingStatus.REJECTED) {
                message = "Your booking was REJECTED ❌ Reason: " + reason;
            } else {
                message = "Your booking status updated to " + newStatus;
            }

            notificationService.createNotificationByEmail(
                    booking.getUser().getEmail(),
                    message);
        }

        return updatedBooking;
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

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // =========================
        // ✅ ADD NOTIFICATION HERE
        // =========================
        if (booking.getUser() != null && booking.getUser().getEmail() != null) {
            notificationService.createNotificationByEmail(
                    booking.getUser().getEmail(),
                    "Your booking has been CANCELLED ❌");
        }

        return updatedBooking;
    }
}