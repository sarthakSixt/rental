package com.sixt.carrental.service;

import com.sixt.carrental.entity.Booking;
import com.sixt.carrental.entity.Booking.BookingStatus;
import com.sixt.carrental.entity.Car;
import com.sixt.carrental.entity.Car.CarStatus;
import com.sixt.carrental.entity.PricingPlan;
import com.sixt.carrental.entity.User;
import com.sixt.carrental.repository.BookingRepository;
import com.sixt.carrental.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class BookingService {
    private final BookingRepository bookingRepository;
    private final CarService carService;
    private final PricingService pricingService;
    private final UserService userService;

    // Create booking with price snapshot
    @Transactional
    public Booking createBooking(Long userId, Long carId, Long categoryId,
                                 Integer durationMonths, Integer kmPackage,
                                 LocalDate startDate){
        // 1. Validate user exists
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 2. Validate car is available
        Car car = carService.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with ID: " + carId));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new RuntimeException("Car is not available for booking");
        }

        // 3. Get pricing plan and snapshot the price
        PricingPlan pricingPlan = pricingService.findPricingPlan(categoryId, durationMonths, kmPackage)
                .orElseThrow(() -> new RuntimeException(
                        "No pricing plan found for category: " + categoryId +
                                ", duration: " + durationMonths +
                                ", km: " + kmPackage
                ));

        // 4. Calculate dates and total
        LocalDate endDate = startDate.plusMonths(durationMonths);
        BigDecimal pricePerMonth = pricingPlan.getPricePerMonth(); // snapshOT!!!!
        BigDecimal totalAmount = pricePerMonth.multiply(BigDecimal.valueOf(durationMonths));

        // 5. create the booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setDurationMonths(durationMonths);
        booking.setKmPackage(kmPackage);
        booking.setPricePerMonth(pricePerMonth);
        booking.setTotalAmount(totalAmount);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setStatus(BookingStatus.PENDING);

        // 6. Save Booking
        Booking savedBooking = bookingRepository.save(booking);

        // 7. mark car as rented
        carService.markAsRented(carId);

        return savedBooking;
    }

    // Get all bookings for a user
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    // Get booking by ID
    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }

    // Get all bookings (admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Confirm booking (after the payment get success)
    @Transactional
    public Booking confirmBooking(Long bookingId){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    // Cancel booking
    @Transactional
    public Booking cancelBooking(Long bookingId){
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        //Mark the car available again
        carService.markAsAvailable(booking.getCar().getId());
        return bookingRepository.save(booking);
    }
    // Complete booking (subscription ended)
    @Transactional
    public Booking completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setStatus(BookingStatus.COMPLETED);

        // Make car available again
        carService.markAsAvailable(booking.getCar().getId());

        return bookingRepository.save(booking);
    }
}