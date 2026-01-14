package com.sixt.carrental.repository;

import com.sixt.carrental.entity.Payment;
import com.sixt.carrental.entity.Payment.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by booking ID
    Optional<Payment> findByBookingId(Long bookingId);

    // Find payment by transaction ID
    Optional<Payment> findByTransactionId(String transactionId);

    // Check if payment exists for booking
    boolean existsByBookingId(Long bookingId);
}