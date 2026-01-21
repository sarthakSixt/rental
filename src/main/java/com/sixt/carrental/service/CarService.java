package com.sixt.carrental.service;

import com.sixt.carrental.entity.Car;
import com.sixt.carrental.repository.CarRepository;
import com.sixt.carrental.entity.Car.CarStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class CarService{
    private final CarRepository carRepository;

    //Create new Car
    public Car createCar(Car car){
        return carRepository.save(car);
    }

    // get all available cars for page 2
    public List<Car> getAvailableCars(){
        return carRepository.findByStatus(CarStatus.AVAILABLE);
    }

    // Get available cars by cAtegory (filtering)
    public List<Car> getAvailableCarsByCategory(Long categoryId){
        return carRepository.findByCategoryIdAndStatus(categoryId, CarStatus.AVAILABLE);
    }

    // Get the AVAILABLE cars by brand
    public List<Car> getAvailableCarsByBrand(String brand){
        return carRepository.findByBrandAndStatus(brand, CarStatus.AVAILABLE);
    }

    // Find car by ID
    public Optional<Car> findById(Long id){
        return carRepository.findById(id);
    }

    // get All cars (Admin)
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // Update car
    public Car updateCar(Car car) {
        if (!carRepository.existsById(car.getId())) {
            throw new RuntimeException("Car not found with ID: " + car.getId());
        }
        return carRepository.save(car);
    }

    // Change car status
    public Car updateCarStatus(Long carId, CarStatus status){
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with ID: " + carId));
        car.setStatus(status); // this line will change the status
        return carRepository.save(car);
    }

    // Mark car as rented
    public void markAsRented(Long carId){
        updateCarStatus(carId, CarStatus.RENTED);
    }
    // mark car as available
    public void markAsAvailable(Long carId){
        updateCarStatus(carId, CarStatus.AVAILABLE);
    }

    // Delete car
    public void deleteCar(Long id){
        if(!carRepository.existsById(id)){
            throw new RuntimeException("Car not found with ID: " + id);
        }
        carRepository.deleteById(id);
    }
}
