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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.info("Creating booking: userId={}, carId={}, categoryId={}, durationMonths={}, kmPackage={}, startDate={}",
                userId, carId, categoryId, durationMonths, kmPackage, startDate);
        
        // 1. Validate user exists
        User user = userService.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found with ID: " + userId);
                });
        log.debug("User found: {}", user.getEmail());

        // 2. Validate car is available
        Car car = carService.findById(carId)
                .orElseThrow(() -> {
                    log.error("Car not found with ID: {}", carId);
                    return new RuntimeException("Car not found with ID: " + carId);
                });
        log.debug("Car found: {} {}, status: {}", car.getBrand(), car.getModel(), car.getStatus());

        if (car.getStatus() != CarStatus.AVAILABLE) {
            log.error("Car is not available for booking. Current status: {}", car.getStatus());
            throw new RuntimeException("Car is not available for booking");
        }

        // 3. Get pricing plan and snapshot the price
        PricingPlan pricingPlan = pricingService.findPricingPlan(categoryId, durationMonths, kmPackage)
                .orElseThrow(() -> {
                    log.error("No pricing plan found for category: {}, duration: {}, km: {}", 
                            categoryId, durationMonths, kmPackage);
                    return new RuntimeException(
                            "No pricing plan found for category: " + categoryId +
                                    ", duration: " + durationMonths +
                                    ", km: " + kmPackage
                    );
                });
        log.debug("Pricing plan found: pricePerMonth={}", pricingPlan.getPricePerMonth());

        // 4. Calculate dates and total
        LocalDate endDate = startDate.plusMonths(durationMonths);
        BigDecimal pricePerMonth = pricingPlan.getPricePerMonth(); // snapshOT!!!!
        BigDecimal totalAmount = pricePerMonth.multiply(BigDecimal.valueOf(durationMonths));
        log.debug("Calculated: endDate={}, pricePerMonth={}, totalAmount={}", endDate, pricePerMonth, totalAmount);

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
        log.info("Saving booking to database...");
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking saved successfully with ID: {}", savedBooking.getId());

        // 7. mark car as rented
        log.info("Marking car {} as rented", carId);
        carService.markAsRented(carId);

        log.info("Booking creation completed successfully. Booking ID: {}", savedBooking.getId());
        return savedBooking;
    }

    // Get all bookings for a user
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUser_Id(userId);
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