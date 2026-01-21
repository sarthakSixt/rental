# Test Cases Document - Car Rental Platform

## Test Execution Summary

**Date:** January 19, 2026  
**Test Framework:** JUnit 5 + Mockito  
**Total Tests:** 14  
**Passed:** 14  
**Failed:** 0  
**Success Rate:** 100%  
**Execution Time:** ~2 seconds

---

## Test Coverage

| Service | Tests | Coverage |
|---------|-------|----------|
| UserService | 5 | Authentication, validation, user management |
| PricingService | 5 | Price calculation, pricing plan lookup |
| BookingService | 4 | Price snapshot, booking creation, car status |

---

## Detailed Test Cases

### 1. UserService Tests

#### TC-001: User Registration with Password Encryption
**Test Method:** `shouldRegisterUserWithEncryptedPassword()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Create user with plain password "password123"
2. Call `userService.registerUser(user)`
3. Verify password is encrypted using BCrypt
4. Verify user is saved to repository

**Expected Result:**
-  User created successfully
-  Password encrypted (not plain text)
-  Repository save method called

**Actual Result:** PASS  
**Assertions:**
- `assertNotNull(registeredUser)`
- `verify(passwordEncoder).encode(rawPassword)`

---

#### TC-002: Duplicate Email Validation
**Test Method:** `shouldThrowExceptionWhenEmailExists()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Mock repository to return true for email exists check
2. Attempt to register user with existing email
3. Verify RuntimeException is thrown

**Expected Result:**
Exception thrown with message "Email already registered"
User NOT saved to database

**Actual Result:** PASS  
**Assertions:**
- `assertThrows(RuntimeException.class)`
- `verify(userRepository, never()).save()`

---

#### TC-003: Find User by Email
**Test Method:** `shouldFindUserByEmail()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Mock repository to return user for given email
2. Call `userService.findByEmail("test@example.com")`
3. Verify user is found

**Expected Result:**
User found
Email matches

**Actual Result:** PASS

---

#### TC-004: User Not Found Scenario
**Test Method:** `shouldReturnEmptyWhenUserNotFound()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Mock repository to return empty for non-existent email
2. Call `userService.findByEmail("notfound@example.com")`
3. Verify empty result

**Expected Result:**
Returns Optional.empty()

**Actual Result:** PASS

---

#### TC-005: Password Verification
**Test Method:** `shouldVerifyPasswordCorrectly()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Provide raw password and encoded password
2. Call `userService.verifyPassword(raw, encoded)`
3. Verify BCrypt matches returns true

**Expected Result:**
Password matches
Returns true

**Actual Result:** PASS

---

### 2. PricingService Tests

#### TC-006: Calculate Total Price for 3 Months
**Test Method:** `shouldCalculateTotalPriceCorrectly()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Mock pricing plan: ₹26,000/month for 3 months
2. Call `pricingService.calculateTotalPrice(1L, 3, 1000)`
3. Verify calculation: 26000 × 3 = 78000

**Expected Result:**
Total = ₹78,000

**Actual Result:** PASS  
**Formula Verified:** `price_per_month × duration_months`

---

#### TC-007: Pricing Plan Not Found
**Test Method:** `shouldThrowExceptionWhenPricingPlanNotFound()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Mock repository to return empty
2. Attempt to calculate price
3. Verify exception thrown

**Expected Result:**
RuntimeException with "No pricing plan found"

**Actual Result:** PASS

---

#### TC-008: Find Pricing Plan by Parameters
**Test Method:** `shouldFindPricingPlanByParameters()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Find plan by categoryId=1, duration=3, km=1000
2. Verify plan found with correct price

**Expected Result:**
Plan found
Price = ₹26,000

**Actual Result:** PASS

---

#### TC-009: Calculate Price for 1 Month
**Test Method:** `shouldCalculatePriceForOneMonth()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Mock pricing: ₹25,000/month for 1 month
2. Calculate total
3. Verify: 25000 × 1 = 25000

**Expected Result:**
Total = ₹25,000

**Actual Result:** PASS

---

#### TC-010: Calculate Price for 6 Months
**Test Method:** `shouldCalculatePriceForSixMonths()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Mock pricing: ₹28,000/month for 6 months
2. Calculate total
3. Verify: 28000 × 6 = 168000

**Expected Result:**
Total = ₹168,000

**Actual Result:** PASS

---

### 3. BookingService Tests (Critical!)

#### TC-011: Create Booking with Price Snapshot ⭐
**Test Method:** `shouldCreateBookingWithPriceSnapshot()`  
**Priority:** CRITICAL  
**Type:** Unit Test

**Test Steps:**
1. Mock user, car (AVAILABLE), pricing plan (₹26,000/month)
2. Create booking for 3 months, 1000 km
3. Verify price is SNAPSHOTTED in booking

**Expected Result:**
Booking created
booking.pricePerMonth = ₹26,000 (LOCKED!)
booking.totalAmount = ₹78,000
booking.durationMonths = 3
booking.kmPackage = 1000
End date = start date + 3 months
Status = PENDING
Car marked as RENTED

**Actual Result:** PASS

**Business Value:**
This test proves that even if pricing plans change later, existing bookings retain original price for fair refunds.

---

#### TC-012: Booking Fails for Rented Car
**Test Method:** `shouldThrowExceptionWhenCarNotAvailable()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Mock car with status = RENTED
2. Attempt to create booking
3. Verify exception thrown

**Expected Result:**
RuntimeException: "Car is not available"
Booking NOT created

**Actual Result:** PASS

---

#### TC-013: End Date Calculation
**Test Method:** `shouldCalculateCorrectEndDate()`  
**Priority:** MEDIUM  
**Type:** Unit Test

**Test Steps:**
1. Start date: Jan 15, 2024
2. Duration: 6 months
3. Calculate end date

**Expected Result:**
End date = July 15, 2024

**Actual Result:** PASS  
**Formula:** `startDate.plusMonths(durationMonths)`

---

#### TC-014: Car Status Update After Booking
**Test Method:** `shouldMarkCarAsRentedAfterBooking()`  
**Priority:** HIGH  
**Type:** Unit Test

**Test Steps:**
1. Create booking successfully
2. Verify car status updated

**Expected Result:**
`carService.markAsRented(carId)` called

**Actual Result:** PASS

---

## Test Execution Report

### Command Used:
```bash
./gradlew test