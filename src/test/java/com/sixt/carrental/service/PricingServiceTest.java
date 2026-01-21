package com.sixt.carrental.service;

import com.sixt.carrental.entity.Category;
import com.sixt.carrental.entity.PricingPlan;
import com.sixt.carrental.repository.PricingPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pricing Service Tests")
class PricingServiceTest {

    @Mock
    private PricingPlanRepository pricingPlanRepository;

    @InjectMocks
    private PricingService pricingService;

    private Category sedanCategory;
    private PricingPlan pricingPlan;

    @BeforeEach
    void setUp() {
        // Create test category
        sedanCategory = new Category();
        sedanCategory.setId(1L);
        sedanCategory.setCode("SEDAN_STANDARD");
        sedanCategory.setName("Standard Sedan");

        // Create test pricing plan
        pricingPlan = new PricingPlan();
        pricingPlan.setId(1L);
        pricingPlan.setCategory(sedanCategory);
        pricingPlan.setDurationMonths(3);
        pricingPlan.setKmPackage(1000);
        pricingPlan.setPricePerMonth(new BigDecimal("26000"));
        pricingPlan.setIsActive(true);
    }

    @Test
    @DisplayName("Should calculate total price correctly")
    void shouldCalculateTotalPriceCorrectly() {
        // Given
        when(pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                1L, 3, 1000
        )).thenReturn(Optional.of(pricingPlan));

        // When
        BigDecimal totalPrice = pricingService.calculateTotalPrice(1L, 3, 1000);

        // Then
        assertEquals(new BigDecimal("78000"), totalPrice);
        verify(pricingPlanRepository).findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(1L, 3, 1000);
    }

    @Test
    @DisplayName("Should throw exception when pricing plan not found")
    void shouldThrowExceptionWhenPricingPlanNotFound() {
        // Given
        when(pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                1L, 3, 1000
        )).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pricingService.calculateTotalPrice(1L, 3, 1000);
        });

        assertTrue(exception.getMessage().contains("No pricing plan found"));
    }

    @Test
    @DisplayName("Should find pricing plan by parameters")
    void shouldFindPricingPlanByParameters() {
        // Given
        when(pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                1L, 3, 1000
        )).thenReturn(Optional.of(pricingPlan));

        // When
        Optional<PricingPlan> found = pricingService.findPricingPlan(1L, 3, 1000);

        // Then
        assertTrue(found.isPresent());
        assertEquals(new BigDecimal("26000"), found.get().getPricePerMonth());
        assertEquals(3, found.get().getDurationMonths());
        assertEquals(1000, found.get().getKmPackage());
    }

    @Test
    @DisplayName("Should verify price calculation for 1 month")
    void shouldCalculatePriceForOneMonth() {
        // Given
        PricingPlan oneMonthPlan = new PricingPlan();
        oneMonthPlan.setCategory(sedanCategory);
        oneMonthPlan.setDurationMonths(1);
        oneMonthPlan.setKmPackage(500);
        oneMonthPlan.setPricePerMonth(new BigDecimal("25000"));

        when(pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                1L, 1, 500
        )).thenReturn(Optional.of(oneMonthPlan));

        // When
        BigDecimal totalPrice = pricingService.calculateTotalPrice(1L, 1, 500);

        // Then
        assertEquals(new BigDecimal("25000"), totalPrice);  // 25000 × 1
    }

    @Test
    @DisplayName("Should verify price calculation for 6 months")
    void shouldCalculatePriceForSixMonths() {
        // Given
        PricingPlan sixMonthPlan = new PricingPlan();
        sixMonthPlan.setCategory(sedanCategory);
        sixMonthPlan.setDurationMonths(6);
        sixMonthPlan.setKmPackage(2000);
        sixMonthPlan.setPricePerMonth(new BigDecimal("28000"));

        when(pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                1L, 6, 2000
        )).thenReturn(Optional.of(sixMonthPlan));

        // When
        BigDecimal totalPrice = pricingService.calculateTotalPrice(1L, 6, 2000);

        // Then
        assertEquals(new BigDecimal("168000"), totalPrice);  // 28000 × 6
    }
}