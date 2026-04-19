package com.paf.backend.service;

import com.paf.backend.exception.BookingConflictException;
import com.paf.backend.model.Booking;
import com.paf.backend.model.BookingStatus;
import com.paf.backend.model.User;
import com.paf.backend.repository.BookingRepository;
import com.paf.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired // ✅ FIX: inject service
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Booking requestBooking(Booking booking) {

        
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        booking.setUser(user); // ✅ FIX HERE





        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime());

        // Only block if a booking in this slot is already APPROVED
        boolean hasApprovedConflict = conflicts.stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.APPROVED);

        if (hasApprovedConflict) {
            throw new RuntimeException("Conflict: Resource is already booked for this time.");
        }

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

    public Booking updateStatus(Long id, String status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        // FIX 2: Added try-catch for Enum conversion to prevent 500 errors
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
                throw new BookingConflictException("Resource is already booked for this time.");
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

    public List<Booking> getBookingsByResourceId(Long resourceId) {
        return bookingRepository.findByResourceId(resourceId);
    }
}