package com.sixt.carrental.repository;

import com.sixt.carrental.entity.Booking;
import com.sixt.carrental.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings for a user (navigate through User relationship)
    List<Booking> findByUser_Id(Long userId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find user's bookings by status (navigate through User relationship)
    List<Booking> findByUser_IdAndStatus(Long userId, BookingStatus status);

    // Find all bookings for a specific car (navigate through Car relationship)
    List<Booking> findByCar_Id(Long carId);
}