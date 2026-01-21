package com.sixt.carrental.controller;

import com.sixt.carrental.dto.request.PaymentRequest;
import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.entity.Payment;
import com.sixt.carrental.entity.Payment.PaymentStatus;
import com.sixt.carrental.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments/process
    @PostMapping("/process")
    public ResponseEntity<ApiResponse> processPayment(@RequestBody PaymentRequest request) {
        try {
            // Mock payment processing
            boolean shouldSucceed = request.getMockSuccess() != null && request.getMockSuccess();

            Payment payment = paymentService.processPayment(request.getBookingId(), shouldSucceed);

            // Fix: Compare enum directly, not string
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", payment));
            } else {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                        .body(ApiResponse.error("Payment failed"));
            }

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // GET /api/payments/booking/{bookingId}
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            return paymentService.getPaymentByBookingId(bookingId)
                    .map(payment -> ResponseEntity.ok(ApiResponse.success("Payment found", payment)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch payment: " + e.getMessage()));
        }
    }
}