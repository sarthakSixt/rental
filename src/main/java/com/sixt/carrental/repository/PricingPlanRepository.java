package com.sixt.carrental.repository;

import com.sixt.carrental.entity.PricingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PricingPlanRepository extends JpaRepository<PricingPlan, Long> {
    List<PricingPlan> findByCategoryIdAndIsActiveTrue(Long categoryId);

    Optional<PricingPlan> findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
            Long categoryId,
            Integer durationMonths,
            Integer kmPackage
    );
}
