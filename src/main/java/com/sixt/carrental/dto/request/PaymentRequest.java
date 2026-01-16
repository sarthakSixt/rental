package com.sixt.carrental.dto.request;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long bookingId;
    private Boolean mockSuccess; // true = payment success, false = payment failed
}