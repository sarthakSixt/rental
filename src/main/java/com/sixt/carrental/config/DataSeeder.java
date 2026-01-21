package com.sixt.carrental.config;

import com.sixt.carrental.entity.*;
import com.sixt.carrental.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final PricingPlanRepository pricingPlanRepository;
    private final CarRepository carRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

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
            createCar(sedanCategory, "Honda", "City", "https://example.com/honda.jpg");
            createCar(sedanCategory, "Toyota", "Camry", "https://example.com/toyota.jpg");
            createCar(sedanCategory, "Hyundai", "Verna", "https://example.com/hyundai.jpg");
            createCar(sedanCategory, "Volkswagen", "Virtus", "https://example.com/vw.jpg");

            createCar(suvCategory, "Toyota", "Fortuner", "https://example.com/fortuner.jpg");
            createCar(suvCategory, "Mahindra", "XUV700", "https://example.com/xuv.jpg");
            createCar(suvCategory, "Hyundai", "Creta", "https://example.com/creta.jpg");
            createCar(suvCategory, "Kia", "Seltos", "https://example.com/seltos.jpg");

            createCar(luxuryCategory, "BMW", "5 Series", "https://example.com/bmw5.jpg");
            createCar(luxuryCategory, "Mercedes-Benz", "E-Class", "https://example.com/merc.jpg");
            createCar(luxuryCategory, "Audi", "A6", "https://example.com/audi.jpg");
            createCar(luxuryCategory, "BMW", "X5", "https://example.com/bmwx5.jpg");

            System.out.println("Created 12 cars");
            System.out.println("Sample data seeded successfully!");

        } catch (Exception e) {
            System.err.println("Error seeding data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createPricingPlan(Category category, Integer durationMonths,
                                   Integer kmPackage, String pricePerMonth) {
        PricingPlan plan = new PricingPlan();
        plan.setCategory(category);
        plan.setDurationMonths(durationMonths);
        plan.setKmPackage(kmPackage);
        plan.setPricePerMonth(new BigDecimal(pricePerMonth));
        plan.setIsActive(true);
        pricingPlanRepository.save(plan);
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