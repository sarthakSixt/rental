package com.sixt.carrental.service;

import com.sixt.carrental.entity.PricingPlan;
import com.sixt.carrental.repository.PricingPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class PricingService{
    private final PricingPlanRepository pricingPlanRepository;

    // Create pricing plan
    public PricingPlan createPricingPlan(PricingPlan pricingPlan){
        return pricingPlanRepository.save(pricingPlan);
    }

    //get all active pricing plans for a category
    public List<PricingPlan> getActivePricingPlans(Long categoryId){
        return pricingPlanRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    // find specific pricing plan
    public Optional<PricingPlan> findPricingPlan(Long categoryId, Integer durationMonths, Integer kmPackage){
        return pricingPlanRepository.findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
                categoryId,
                durationMonths,
                kmPackage
        );
    }

    // Calculate total price
    public BigDecimal calculateTotalPrice(Long categoryId, Integer durationMonths, Integer kmPackage){
        PricingPlan plan = findPricingPlan(categoryId, durationMonths, kmPackage)
                .orElseThrow(() -> new RuntimeException(
                        "No pricing plan found for category: " + categoryId +
                                ", duration: " + durationMonths +
                                ", km: " + kmPackage
                )
        );

        return plan.getPricePerMonth().multiply(BigDecimal.valueOf(durationMonths));
    }

    // Get all pricing plans (admin)
    public List<PricingPlan> getAllPricingPlans() {
        return pricingPlanRepository.findAll();
    }

    // Update pricing plan
    public PricingPlan updatePricingPlan(PricingPlan pricingPlan) {
        if (!pricingPlanRepository.existsById(pricingPlan.getId())) {
            throw new RuntimeException("Pricing plan not found with ID: " + pricingPlan.getId());
        }
        return pricingPlanRepository.save(pricingPlan);
    }

    // Deactivate pricing plan (soft delete)
    public void deactivatePricingPlan(Long id){
        PricingPlan plan = pricingPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing plan not found with ID: " + id));
        plan.setIsActive(false);
        pricingPlanRepository.save(plan);
    }
}