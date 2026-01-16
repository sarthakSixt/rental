package com.sixt.carrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PriceCalculationResponse {

    private Long categoryId;
    private String categoryName;
    private Integer durationMonths;
    private Integer kmPackage;
    private BigDecimal pricePerMonth;
    private BigDecimal totalAmount;
}