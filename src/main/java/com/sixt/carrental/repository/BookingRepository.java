package com.sixt.carrental.repository;

import com.sixt.carrental.entity.Booking;
import com.sixt.carrental.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings for a user
    List<Booking> findByUserId(Long userId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find user's bookings by status
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    // Find all bookings for a specific car
    List<Booking> findByCarId(Long carId);
}