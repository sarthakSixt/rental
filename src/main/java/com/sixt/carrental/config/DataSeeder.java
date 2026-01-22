package com.sixt.carrental.config;

import com.sixt.carrental.entity.*;
import com.sixt.carrental.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final PricingPlanRepository pricingPlanRepository;
    private final CarRepository carRepository;
    private final Environment environment;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Skip data seeding during tests
        // String datasourceUrl = environment.getProperty("spring.datasource.url", "");
        // if (datasourceUrl.contains("h2") || datasourceUrl.contains("mem:")) {
        //     System.out.println("Skipping data seeding in test environment");
        //     return;
        // }

        // Check if data already exists
        if (categoryRepository.count() > 0) {
            System.out.println("Sample data already exists. Skipping seed.");
            return;
        }

        System.out.println("Seeding sample data...");

        try {
            // CREATE CATEGORIES
            Category sedanCategory = new Category();
            sedanCategory.setCode("SEDAN_STANDARD");
            sedanCategory.setName("Standard Sedan");
            sedanCategory.setDescription("Comfortable 5-seater sedans for daily commute");
            sedanCategory = categoryRepository.save(sedanCategory);

            Category suvCategory = new Category();
            suvCategory.setCode("SUV_STANDARD");
            suvCategory.setName("Standard SUV");
            suvCategory.setDescription("Spacious SUVs for family trips");
            suvCategory = categoryRepository.save(suvCategory);

            Category luxuryCategory = new Category();
            luxuryCategory.setCode("LUXURY_EXECUTIVE");
            luxuryCategory.setName("Luxury Executive");
            luxuryCategory.setDescription("Premium luxury vehicles");
            luxuryCategory = categoryRepository.save(luxuryCategory);

            System.out.println("Created 3 categories");

            // CREATEing PRICING PLANS
            // Sedan - 9 plans
            createPricingPlan(sedanCategory, 1, 500, "25000");
            createPricingPlan(sedanCategory, 1, 1000, "28000");
            createPricingPlan(sedanCategory, 1, 2000, "32000");
            createPricingPlan(sedanCategory, 3, 500, "23000");
            createPricingPlan(sedanCategory, 3, 1000, "26000");
            createPricingPlan(sedanCategory, 3, 2000, "30000");
            createPricingPlan(sedanCategory, 6, 500, "21000");
            createPricingPlan(sedanCategory, 6, 1000, "24000");
            createPricingPlan(sedanCategory, 6, 2000, "28000");

            // SUV - 9 plans
            createPricingPlan(suvCategory, 1, 500, "35000");
            createPricingPlan(suvCategory, 1, 1000, "40000");
            createPricingPlan(suvCategory, 1, 2000, "45000");
            createPricingPlan(suvCategory, 3, 500, "33000");
            createPricingPlan(suvCategory, 3, 1000, "38000");
            createPricingPlan(suvCategory, 3, 2000, "43000");
            createPricingPlan(suvCategory, 6, 500, "31000");
            createPricingPlan(suvCategory, 6, 1000, "36000");
            createPricingPlan(suvCategory, 6, 2000, "41000");

            // Luxury - 9 plans
            createPricingPlan(luxuryCategory, 1, 500, "75000");
            createPricingPlan(luxuryCategory, 1, 1000, "85000");
            createPricingPlan(luxuryCategory, 1, 2000, "95000");
            createPricingPlan(luxuryCategory, 3, 500, "70000");
            createPricingPlan(luxuryCategory, 3, 1000, "80000");
            createPricingPlan(luxuryCategory, 3, 2000, "90000");
            createPricingPlan(luxuryCategory, 6, 500, "65000");
            createPricingPlan(luxuryCategory, 6, 1000, "75000");
            createPricingPlan(luxuryCategory, 6, 2000, "85000");

            System.out.println("Created 27 pricing plans");

            // CREATE CARS
            createCar(sedanCategory, "Honda", "City", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop");
            createCar(sedanCategory, "Toyota", "Camry", "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop");
            createCar(sedanCategory, "Hyundai", "Verna", "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop");
            createCar(sedanCategory, "Volkswagen", "Virtus", "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop");

            createCar(suvCategory, "Toyota", "Fortuner", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop");
            createCar(suvCategory, "Mahindra", "XUV700", "https://images.unsplash.com/photo-1606664515524-ed2f786a0ad6?w=800&h=600&fit=crop");
            createCar(suvCategory, "Hyundai", "Creta", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop");
            createCar(suvCategory, "Kia", "Seltos", "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop");

            createCar(luxuryCategory, "BMW", "5 Series", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop");
            createCar(luxuryCategory, "Mercedes-Benz", "E-Class", "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop");
            createCar(luxuryCategory, "Audi", "A6", "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop");
            createCar(luxuryCategory, "BMW", "X5", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop");

            System.out.println("Created 12 cars");
            System.out.println("Sample data seeded successfully!");

        } catch (Exception e) {
            System.err.println("Error seeding data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createPricingPlan(Category category, Integer durationMonths,
        Integer kmPackage, String pricePerMonth) {
            // Check if plan already exists
            Optional<PricingPlan> existingPlan = pricingPlanRepository
            .findByCategoryIdAndDurationMonthsAndKmPackageAndIsActiveTrue(
            category.getId(), durationMonths, kmPackage);

            if (existingPlan.isPresent()) {
            // Update existing plan
                PricingPlan plan = existingPlan.get();
                plan.setPricePerMonth(new BigDecimal(pricePerMonth));
                pricingPlanRepository.save(plan);
                System.out.println("Updated pricing plan: " + category.getName() + 
                " - " + durationMonths + " months, " + kmPackage + " km");
            } else {
            // Create new plan
                PricingPlan plan = new PricingPlan();
                plan.setCategory(category);
                plan.setDurationMonths(durationMonths);
                plan.setKmPackage(kmPackage);
                plan.setPricePerMonth(new BigDecimal(pricePerMonth));
                plan.setIsActive(true);
                pricingPlanRepository.save(plan);
                System.out.println("Created pricing plan: " + category.getName() + 
                " - " + durationMonths + " months, " + kmPackage + " km");
            }
        }

    private void createCar(Category category, String brand, String model, String imageUrl) {
        Car car = new Car();
        car.setCategory(category);
        car.setBrand(brand);
        car.setModel(model);
        car.setImageUrl(imageUrl);
        car.setStatus(Car.CarStatus.AVAILABLE);
        carRepository.save(car);
    }
}