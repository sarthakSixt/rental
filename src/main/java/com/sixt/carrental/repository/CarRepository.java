package com.sixt.carrental.repository;

import com.sixt.carrental.entity.Car;
import com.sixt.carrental.entity.Car.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    // Find all available cars
    List<Car> findByStatus(CarStatus status);

    // Find available cars by category
    List<Car> findByCategoryIdAndStatus(Long categoryId, CarStatus status);

    // Find cars by brand
    List<Car> findByBrandAndStatus(String brand, CarStatus status);
}