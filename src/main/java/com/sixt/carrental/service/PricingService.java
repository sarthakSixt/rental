package com.sixt.carrental.service;

import com.sixt.carrental.entity.PricingPlan;
import com.sixt.carrental.repository.PricingPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
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

    // Update pricing plan by ID
    @Transactional
    public PricingPlan updatePricingPlan(PricingPlan pricingPlan) {
        if (!pricingPlanRepository.existsById(pricingPlan.getId())) {
            throw new RuntimeException("Pricing plan not found with ID: " + pricingPlan.getId());
        }
        log.info("Updating pricing plan ID: {}, new price: {}", pricingPlan.getId(), pricingPlan.getPricePerMonth());
        return pricingPlanRepository.save(pricingPlan);
    }

    // Update pricing plan by category, duration, and kmPackage (convenient method)
    @Transactional
    public PricingPlan updatePricingPlanByParams(Long categoryId, Integer durationMonths, 
                                                 Integer kmPackage, BigDecimal newPricePerMonth) {
        log.info("Updating pricing plan: categoryId={}, durationMonths={}, kmPackage={}, newPricePerMonth={}",
                categoryId, durationMonths, kmPackage, newPricePerMonth);
        
        PricingPlan plan = findPricingPlan(categoryId, durationMonths, kmPackage)
                .orElseThrow(() -> {
                    log.error("Pricing plan not found for category: {}, duration: {}, km: {}", 
                            categoryId, durationMonths, kmPackage);
                    return new RuntimeException(
                            "Pricing plan not found for category: " + categoryId +
                                    ", duration: " + durationMonths +
                                    ", km: " + kmPackage
                    );
                });
        
        BigDecimal oldPrice = plan.getPricePerMonth();
        plan.setPricePerMonth(newPricePerMonth);
        PricingPlan updatedPlan = pricingPlanRepository.save(plan);
        
        log.info("Pricing plan updated successfully. ID: {}, Old price: {}, New price: {}", 
                updatedPlan.getId(), oldPrice, newPricePerMonth);
        
        return updatedPlan;
    }

    // Deactivate pricing plan (soft delete)
    @Transactional
    public void deactivatePricingPlan(Long id){
        PricingPlan plan = pricingPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing plan not found with ID: " + id));
        plan.setIsActive(false);
        pricingPlanRepository.save(plan);
        log.info("Pricing plan deactivated: ID: {}", id);
    }
}
