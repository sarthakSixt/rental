package com.sixt.carrental.controller;

import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.entity.Car;
import com.sixt.carrental.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    // GET /api/cars - Get all available cars
    @GetMapping
    public ResponseEntity<ApiResponse> getAllAvailableCars() {
        try {
            List<Car> cars = carService.getAvailableCars();
            return ResponseEntity.ok(ApiResponse.success("Cars fetched successfully", cars));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch cars: " + e.getMessage()));
        }
    }

    // GET /api/cars/category/{categoryId}
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> getCarsByCategory(@PathVariable Long categoryId) {
        try {
            List<Car> cars = carService.getAvailableCarsByCategory(categoryId);
            return ResponseEntity.ok(ApiResponse.success("Cars fetched successfully", cars));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch cars: " + e.getMessage()));
        }
    }

    // GET /api/cars/brand/{brand}
    @GetMapping("/brand/{brand}")
    public ResponseEntity<ApiResponse> getCarsByBrand(@PathVariable String brand) {
        try {
            List<Car> cars = carService.getAvailableCarsByBrand(brand);
            return ResponseEntity.ok(ApiResponse.success("Cars fetched successfully", cars));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch cars: " + e.getMessage()));
        }
    }

    // GET /api/cars/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCarById(@PathVariable Long id) {
        try {
            return carService.findById(id)
                    .map(car -> ResponseEntity.ok(ApiResponse.success("Car found", car)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch car: " + e.getMessage()));
        }
    }
}