package com.sixt.carrental.service;

import com.sixt.carrental.entity.Booking;
import com.sixt.carrental.entity.Payment;
import com.sixt.carrental.entity.Payment.PaymentStatus;
import com.sixt.carrental.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;

    // Process payment (mocked)
    @Transactional
    public Payment processPayment(Long bookingId, boolean shouldSucceed) {
        // 1. get booking
        Booking booking = bookingService.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // 2. Check if payment already exists
        if(paymentRepository.existsByBookingId(bookingId)){
            throw new RuntimeException("Payment already exists for booking ID: " + bookingId);
        }

        // 3. Create payment
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());

        // 4. Mock payment processing
        if(shouldSucceed){
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("Txn-" + UUID.randomUUID().toString());

            // Confirm booking
            bookingService.confirmBooking(bookingId);
        }else{
            payment.setStatus(PaymentStatus.FAILED);
            payment.setTransactionId("Failed-" + UUID.randomUUID().toString());
        }
        // 5. Save Payment
        return paymentRepository.save(payment);
    }

    // get payment by ID
    public Optional<Payment> getPaymentByBookingId(Long bookingId){
        return paymentRepository.findByBookingId(bookingId);
    }

    // Get payment by ID
    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    // Get payment by transaction ID
    public Optional<Payment> findByTransactionId(String transactionId){
        return paymentRepository.findByTransactionId(transactionId);
    }
}