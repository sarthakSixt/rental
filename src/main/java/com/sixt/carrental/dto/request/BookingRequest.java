package com.sixt.carrental.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long userId;
    private Long carId;
    private Long categoryId;
    private Integer durationMonths;
    private Integer kmPackage;
    private LocalDate startDate;
}
