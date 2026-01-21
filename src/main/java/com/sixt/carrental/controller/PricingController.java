package com.sixt.carrental.controller;

import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.dto.response.PriceCalculationResponse;
import com.sixt.carrental.entity.Category;
import com.sixt.carrental.entity.PricingPlan;
import com.sixt.carrental.service.CategoryService;
import com.sixt.carrental.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PricingController {

    private final PricingService pricingService;
    private final CategoryService categoryService;

    // GET /api/pricing/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> getPricingPlans(@PathVariable Long categoryId) {
        try {
            List<PricingPlan> plans = pricingService.getActivePricingPlans(categoryId);
            return ResponseEntity.ok(ApiResponse.success("Pricing plans fetched successfully", plans));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch pricing plans: " + e.getMessage()));
        }
    }

    // GET /api/pricing/calculate?categoryId=1&durationMonths=3&kmPackage=1000
    @GetMapping("/calculate")
    public ResponseEntity<ApiResponse> calculatePrice(
            @RequestParam Long categoryId,
            @RequestParam Integer durationMonths,
            @RequestParam Integer kmPackage) {
        try {
            // Get category
            Category category = categoryService.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            // Get pricing plan
            PricingPlan plan = pricingService.findPricingPlan(categoryId, durationMonths, kmPackage)
                    .orElseThrow(() -> new RuntimeException("Pricing plan not found"));

            // Calculate total
            BigDecimal totalAmount = pricingService.calculateTotalPrice(categoryId, durationMonths, kmPackage);

            // Create response
            PriceCalculationResponse response = new PriceCalculationResponse(
                    categoryId,
                    category.getName(),
                    durationMonths,
                    kmPackage,
                    plan.getPricePerMonth(),
                    totalAmount
            );

            return ResponseEntity.ok(ApiResponse.success("Price calculated successfully", response));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to calculate price: " + e.getMessage()));
        }
    }
}