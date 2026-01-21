package com.sixt.carrental.controller;

import com.sixt.carrental.dto.request.BookingRequest;
import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.entity.Booking;
import com.sixt.carrental.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    // POST /api/bookings - Create new booking
    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(@RequestBody BookingRequest request) {
        log.info("Received booking request: userId={}, carId={}, categoryId={}, durationMonths={}, kmPackage={}, startDate={}",
                request.getUserId(), request.getCarId(), request.getCategoryId(),
                request.getDurationMonths(), request.getKmPackage(), request.getStartDate());
        
        try {
            // Validate request
            if (request.getUserId() == null || request.getCarId() == null || 
                request.getCategoryId() == null || request.getDurationMonths() == null ||
                request.getKmPackage() == null || request.getStartDate() == null) {
                log.error("Missing required fields in booking request");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("All fields are required"));
            }

            Booking booking = bookingService.createBooking(
                    request.getUserId(),
                    request.getCarId(),
                    request.getCategoryId(),
                    request.getDurationMonths(),
                    request.getKmPackage(),
                    request.getStartDate()
            );

            log.info("Booking created successfully with ID: {}", booking.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Booking created successfully", booking));

        } catch (RuntimeException e) {
            log.error("Error creating booking: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred: " + e.getMessage()));
        }
    }

    // GET /api/bookings/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserBookings(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch bookings: " + e.getMessage()));
        }
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable Long id) {
        try {
            return bookingService.findById(id)
                    .map(booking -> ResponseEntity.ok(ApiResponse.success("Booking found", booking)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch booking: " + e.getMessage()));
        }
    }

    // PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}