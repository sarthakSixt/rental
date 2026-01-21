package com.sixt.carrental.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long userId;
    private Long carId;
    private Long categoryId;
    private Integer durationMonths;
    private Integer kmPackage;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
}
