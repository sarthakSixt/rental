package com.sixt.carrental.service;

import com.sixt.carrental.entity.*;
import com.sixt.carrental.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Booking Service Tests - Price Snapshot Feature")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CarService carService;

    @Mock
    private PricingService pricingService;

    @Mock
    private UserService userService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Car testCar;
    private Category sedanCategory;
    private PricingPlan pricingPlan;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");

        // Create test category
        sedanCategory = new Category();
        sedanCategory.setId(1L);
        sedanCategory.setCode("SEDAN_STANDARD");
        sedanCategory.setName("Standard Sedan");

        // Create test car
        testCar = new Car();
        testCar.setId(1L);
        testCar.setBrand("Honda");
        testCar.setModel("City");
        testCar.setCategory(sedanCategory);
        testCar.setStatus(Car.CarStatus.AVAILABLE);

        // Create test pricing plan
        pricingPlan = new PricingPlan();
        pricingPlan.setId(1L);
        pricingPlan.setCategory(sedanCategory);
        pricingPlan.setDurationMonths(3);
        pricingPlan.setKmPackage(1000);
        pricingPlan.setPricePerMonth(new BigDecimal("26000"));
        pricingPlan.setIsActive(true);
    }

    @Test
    @DisplayName("Should create booking with price snapshot")
    void shouldCreateBookingWithPriceSnapshot() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 2, 1);

        when(userService.findById(1L)).thenReturn(Optional.of(testUser));
        when(carService.findById(1L)).thenReturn(Optional.of(testCar));
        when(pricingService.findPricingPlan(1L, 3, 1000)).thenReturn(Optional.of(pricingPlan));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // When
        Booking booking = bookingService.createBooking(1L, 1L, 1L, 3, 1000, startDate);

        // Then - CRITICAL: Verify price is snapshotted!
        assertNotNull(booking);
        assertEquals(new BigDecimal("26000"), booking.getPricePerMonth());  // Snapshot!
        assertEquals(new BigDecimal("78000"), booking.getTotalAmount());    // 26000 × 3
        assertEquals(3, booking.getDurationMonths());
        assertEquals(1000, booking.getKmPackage());
        assertEquals(startDate, booking.getStartDate());
        assertEquals(startDate.plusMonths(3), booking.getEndDate());
        assertEquals(Booking.BookingStatus.PENDING, booking.getStatus());

        verify(bookingRepository).save(any(Booking.class));
        verify(carService).markAsRented(1L);
    }

    @Test
    @DisplayName("Should throw exception when car is not available")
    void shouldThrowExceptionWhenCarNotAvailable() {
        // Given
        testCar.setStatus(Car.CarStatus.RENTED);

        when(userService.findById(1L)).thenReturn(Optional.of(testUser));
        when(carService.findById(1L)).thenReturn(Optional.of(testCar));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bookingService.createBooking(1L, 1L, 1L, 3, 1000, LocalDate.now());
        });

        assertTrue(exception.getMessage().contains("not available"));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should calculate correct end date")
    void shouldCalculateCorrectEndDate() {
        // Given
        LocalDate startDate = LocalDate.of(2024, 1, 15);

        when(userService.findById(1L)).thenReturn(Optional.of(testUser));
        when(carService.findById(1L)).thenReturn(Optional.of(testCar));
        when(pricingService.findPricingPlan(1L, 6, 2000)).thenReturn(Optional.of(pricingPlan));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Booking booking = bookingService.createBooking(1L, 1L, 1L, 6, 2000, startDate);

        // Then
        assertEquals(LocalDate.of(2024, 7, 15), booking.getEndDate());  // 6 months later
    }

    @Test
    @DisplayName("Should mark car as rented after booking")
    void shouldMarkCarAsRentedAfterBooking() {
        // Given
        when(userService.findById(1L)).thenReturn(Optional.of(testUser));
        when(carService.findById(1L)).thenReturn(Optional.of(testCar));
        when(pricingService.findPricingPlan(1L, 3, 1000)).thenReturn(Optional.of(pricingPlan));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        bookingService.createBooking(1L, 1L, 1L, 3, 1000, LocalDate.now());

        // Then
        verify(carService).markAsRented(1L);  // Car status updated!
    }
}