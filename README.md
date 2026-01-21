<div align="center">

# 🚗 Car Rental Subscription Platform

**A modern, full-stack car rental application with Spring Boot backend and React frontend**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Modern car rental platform with flexible subscription options, real-time pricing, and seamless booking experience*

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The Car Rental Subscription Platform is a comprehensive full-stack application that allows users to browse, configure, and book car rentals with flexible subscription options. The platform features a modern dark-themed UI, real-time price calculations, secure authentication, and a complete booking management system.

### Key Highlights

- ✨ **Modern UI/UX** - Beautiful dark theme with smooth animations
- 🔒 **Secure Authentication** - JWT-based authentication with Spring Security
- 💰 **Dynamic Pricing** - Real-time price calculation based on rental configuration
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🚀 **Fast Performance** - Optimized React frontend with Vite build tool
- 🗄️ **Robust Backend** - Spring Boot with PostgreSQL for reliable data persistence

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Protected routes and API endpoints
- Secure password hashing with BCrypt
- Session management

### 🚗 Car Management
- Browse available cars with beautiful card layouts
- Filter cars by category (Sedan, SUV, Luxury)
- Filter cars by brand
- View detailed car information
- Real-time availability status

### ⚙️ Flexible Configuration
- **Duration Options**: 1, 3, or 6 months
- **KM Packages**: 500, 1000, or 2000 km/month
- Real-time price calculation
- Visual configuration interface

### 💰 Pricing System
- Dynamic pricing based on category, duration, and KM package
- Price snapshot at booking time
- Transparent pricing breakdown
- Multiple pricing plans per category

### 📅 Booking Management
- Create bookings with date selection
- View all bookings in user dashboard
- Booking status tracking (Pending, Confirmed, Cancelled, Completed)
- Booking history and details

### 💳 Payment Processing
- Mock payment integration
- Payment success/failure handling
- Transaction ID generation
- Payment confirmation

### 📊 User Dashboard
- View all user bookings
- Booking status overview
- Quick access to booking details
- User profile management

### 🎨 UI/UX Features
- Modern dark theme
- Smooth animations and transitions
- Glass morphism design elements
- Gradient buttons and cards
- Loading states and error handling
- Responsive grid layouts
- Interactive hover effects

---

## 🏗️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 4.0.1 | Java framework for building REST APIs |
| **Spring Security** | - | Authentication and authorization |
| **Spring Data JPA** | - | Database abstraction layer |
| **PostgreSQL** | 15+ | Relational database |
| **JWT (JJWT)** | 0.12.3 | Token-based authentication |
| **Hibernate** | - | ORM framework |
| **Gradle** | 9.2.1 | Build automation tool |
| **Lombok** | - | Reduces boilerplate code |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18 | UI library |
| **TypeScript** | 5.0 | Type-safe JavaScript |
| **Vite** | 5.4 | Build tool and dev server |
| **React Router** | 6 | Client-side routing |
| **Axios** | 1.6 | HTTP client |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Context API** | - | State management |

### Development Tools

- **PostgreSQL** - Database
- **Gradle Wrapper** - Build tool
- **npm/yarn** - Package manager
- **Git** - Version control

---

## 📸 Screenshots

### Landing Page
<!-- Insert screenshot of the landing/home page here -->
![Landing Page](./screenshots/landing-page.png)
*Beautiful landing page with hero section and call-to-action buttons*

### Car Browsing
<!-- Insert screenshot of the car list page here -->
![Car List](./screenshots/car-list.png)
*Browse available cars with filtering options by category and brand*

### Configuration Page
<!-- Insert screenshot of the configuration page here -->
![Configuration](./screenshots/configuration.png)
*Configure rental duration and KM package with real-time price calculation*

### Review & Payment
<!-- Insert screenshot of the review page here -->
![Review](./screenshots/review.png)
*Review booking details and process payment*

### User Dashboard
<!-- Insert screenshot of the dashboard here -->
![Dashboard](./screenshots/dashboard.png)
*View and manage all your bookings in one place*

### Authentication
<!-- Insert screenshot of login/signup pages here -->
![Authentication](./screenshots/authentication.png)
*Secure login and signup with JWT authentication*

### Confirmation Page
<!-- Insert screenshot of confirmation page here -->
![Confirmation](./screenshots/confirmation.png)
*Booking confirmation with payment details*

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** (or Java 25)
- **Node.js 18+** and npm
- **PostgreSQL 15+** (running on port 5432)
- **Gradle** (or use Gradle wrapper included)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd rental
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database
psql -U your_username -c "CREATE DATABASE carrental_db;"

# Or use the verification script
./verify-db.sh
```

Update database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/carrental_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Step 3: Backend Setup

```bash
# Build the project
./gradlew clean build

# Run the backend
./gradlew bootRun

# Backend will start on http://localhost:8080
# Sample data will be automatically seeded on first run
```

**Expected Output:**
```
Started CarrentalApplication in X.XXX seconds
Sample data seeded successfully
```

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:3000
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Documentation**: See [API Documentation](#-api-documentation) section

### Quick Start Script

Alternatively, use the provided start script:

```bash
./start.sh
```

This script will:
1. Check prerequisites
2. Start PostgreSQL (if needed)
3. Build and run the backend
4. Start the frontend

---

## 💻 Usage

### Complete User Flow

1. **Sign Up / Login**
   - Create a new account or login with existing credentials
   - JWT token is automatically stored and used for authenticated requests

2. **Browse Cars**
   - View all available cars
   - Filter by category (Sedan, SUV, Luxury)
   - Filter by brand
   - Click on a car to configure rental

3. **Configure Rental**
   - Select rental duration (1, 3, or 6 months)
   - Choose KM package (500, 1000, or 2000 km/month)
   - View real-time price calculation
   - Click "Continue to Review"

4. **Review & Book**
   - Review all booking details
   - Select rental start date
   - Click "Confirm & Pay"
   - Process mock payment

5. **Confirmation**
   - View booking confirmation
   - See payment details
   - Access booking ID for reference

6. **Dashboard**
   - View all your bookings
   - Check booking status
   - Access booking details

### API Testing

#### Public Endpoints

```bash
# Get all categories
curl http://localhost:8080/api/categories

# Get all cars
curl http://localhost:8080/api/cars

# Get cars by category
curl http://localhost:8080/api/cars/category/1

# Calculate price
curl "http://localhost:8080/api/pricing/calculate?categoryId=1&durationMonths=3&kmPackage=1000"
```

#### Authentication Endpoints

```bash
# Sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Protected Endpoints (Require JWT Token)

```bash
# Create booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "carId": 1,
    "categoryId": 1,
    "durationMonths": 3,
    "kmPackage": 1000,
    "startDate": "2024-01-15"
  }'

# Get user bookings
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/bookings/user/1
```

---

## 📁 Project Structure

```
rental/
├── src/main/java/com/sixt/carrental/
│   ├── CarrentalApplication.java      # Main application class
│   ├── config/                        # Configuration classes
│   │   ├── DataSeeder.java            # Sample data seeder
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtTokenProvider.java
│   │   └── SecurityConfig.java
│   ├── controller/                    # REST API controllers
│   │   ├── AuthController.java
│   │   ├── BookingController.java
│   │   ├── CarController.java
│   │   ├── CategoryController.java
│   │   ├── PaymentController.java
│   │   └── PricingController.java
│   ├── service/                       # Business logic layer
│   │   ├── BookingService.java
│   │   ├── CarService.java
│   │   ├── CategoryService.java
│   │   ├── PaymentService.java
│   │   ├── PricingService.java
│   │   └── UserService.java
│   ├── repository/                    # Data access layer
│   │   ├── BookingRepository.java
│   │   ├── CarRepository.java
│   │   ├── CategoryRepository.java
│   │   ├── PaymentRepository.java
│   │   ├── PricingPlanRepository.java
│   │   └── UserRepository.java
│   ├── entity/                        # JPA entities
│   │   ├── Booking.java
│   │   ├── Car.java
│   │   ├── Category.java
│   │   ├── Payment.java
│   │   ├── PricingPlan.java
│   │   └── User.java
│   └── dto/                           # Data transfer objects
│       ├── request/
│       │   ├── BookingRequest.java
│       │   ├── LoginRequest.java
│       │   ├── PaymentRequest.java
│       │   └── SignupRequest.java
│       └── response/
│           ├── ApiResponse.java
│           ├── LoginResponse.java
│           └── PriceCalculationResponse.java
├── frontend/
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── Home.tsx
│   │   │   ├── CarList.tsx
│   │   │   ├── Configuration.tsx
│   │   │   ├── Review.tsx
│   │   │   ├── Confirmation.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/                  # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── services/                  # API service layer
│   │   │   └── api.ts
│   │   ├── types/                     # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx                    # Main app component
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── build.gradle                       # Gradle build configuration
├── start.sh                          # Quick start script
├── verify-db.sh                      # Database verification script
└── README.md                         # This file
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### Authentication Endpoints

#### POST `/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### POST `/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Car Endpoints

#### GET `/cars`
Get all available cars.

#### GET `/cars/{id}`
Get car by ID.

#### GET `/cars/category/{categoryId}`
Get cars by category.

#### GET `/cars/brand/{brand}`
Get cars by brand.

### Booking Endpoints (Protected)

#### POST `/bookings`
Create a new booking.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "userId": 1,
  "carId": 1,
  "categoryId": 1,
  "durationMonths": 3,
  "kmPackage": 1000,
  "startDate": "2024-01-15"
}
```

#### GET `/bookings/user/{userId}`
Get all bookings for a user.

#### GET `/bookings/{id}`
Get booking by ID.

#### PUT `/bookings/{id}/cancel`
Cancel a booking.

### Payment Endpoints (Protected)

#### POST `/payments/process`
Process payment for a booking.

**Request Body:**
```json
{
  "bookingId": 1,
  "mockSuccess": true
}
```

#### GET `/payments/booking/{bookingId}`
Get payment by booking ID.

### Pricing Endpoints

#### GET `/pricing/category/{categoryId}`
Get all pricing plans for a category.

#### GET `/pricing/calculate`
Calculate price for a configuration.

**Query Parameters:**
- `categoryId` - Category ID
- `durationMonths` - Duration in months
- `kmPackage` - KM package

**Example:**
```
GET /api/pricing/calculate?categoryId=1&durationMonths=3&kmPackage=1000
```

For complete API documentation, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

### Users
```sql
users
├── id (PK)
├── email (unique)
├── password (encrypted)
├── first_name
├── last_name
├── phone_number
├── role
└── created_at, updated_at
```

### Categories
```sql
categories
├── id (PK)
├── code (unique)
├── name
└── description
```

### Cars
```sql
cars
├── id (PK)
├── category_id (FK → categories)
├── brand
├── model
├── image_url
├── status
└── created_at, updated_at
```

### Pricing Plans
```sql
pricing_plans
├── id (PK)
├── category_id (FK → categories)
├── duration_month
├── km_package
├── price_per_month
└── is_active
```

### Bookings
```sql
bookings
├── id (PK)
├── user_id (FK → users)
├── car_id (FK → cars)
├── duration_months
├── km_package
├── price_per_month
├── total_amount
├── start_date
├── end_date
├── status
└── created_at, updated_at
```

### Payments
```sql
payments
├── id (PK)
├── booking_id (FK → bookings, unique)
├── amount
├── status
├── transaction_id
└── created_at
```

**Note:** Tables are automatically created by Hibernate on first run with `spring.jpa.hibernate.ddl-auto=update`.

---

## 🔒 Security

### Authentication
- **JWT Tokens** - Stateless authentication
- **Token Expiration** - 24 hours (configurable)
- **Password Hashing** - BCrypt with salt rounds
- **Protected Routes** - Frontend route protection
- **Protected Endpoints** - Backend API security

### Authorization
- **Role-based Access** - User roles (USER, ADMIN)
- **Endpoint Protection** - Spring Security configuration
- **Token Validation** - JWT filter on every request

### Data Security
- **SQL Injection Prevention** - JPA parameterized queries
- **CORS Configuration** - Configured for allowed origins
- **Input Validation** - Request validation
- **Error Handling** - Secure error messages

### Best Practices
- Passwords never stored in plain text
- Tokens stored securely in localStorage
- HTTPS recommended for production
- Regular security updates

---

## 🧪 Testing

### Verify Database Connection

```bash
./verify-db.sh
```

### Check Sample Data

```sql
-- Connect to database
psql -U your_username -d carrental_db

-- Check data counts
SELECT COUNT(*) FROM cars;        -- Should be 12
SELECT COUNT(*) FROM categories;  -- Should be 3
SELECT COUNT(*) FROM pricing_plans; -- Should be 27
```

### Test API Endpoints

Use the examples in the [Usage](#-usage) section or use tools like:
- Postman
- cURL
- Insomnia
- Browser DevTools

### Frontend Testing

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Verify localStorage for JWT token

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Database Connection Error**
```
Solution: Check PostgreSQL is running and credentials in application.properties are correct
```

**Port 8080 Already in Use**
```
Solution: Change server.port in application.properties or stop the service using port 8080
```

**No Sample Data**
```
Solution: Check DataSeeder ran successfully. Look for "Sample data seeded successfully" in logs
```

#### Frontend Issues

**CORS Errors**
```
Solution: Verify backend CORS configuration in SecurityConfig.java
```

**API Connection Errors**
```
Solution: Ensure backend is running on http://localhost:8080
```

**No Data Displayed**
```
Solution: Check backend is running and database has sample data
```

#### Integration Issues

**401 Unauthorized**
```
Solution: Check JWT token is valid. Try logging out and logging back in
```

**Booking Not Saving**
```
Solution: Check backend logs for errors. Verify database connection and transaction logs
```

**Network Errors**
```
Solution: Verify both frontend (port 3000) and backend (port 8080) are running
```

For detailed troubleshooting, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) and [frontend/DEBUGGING.md](./frontend/DEBUGGING.md).

---

## 📖 Additional Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete integration guide
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Integration overview
- **[frontend/FLOW.md](./frontend/FLOW.md)** - Frontend flow documentation
- **[frontend/DEBUGGING.md](./frontend/DEBUGGING.md)** - Debugging guide
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Architecture overview

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow code style guidelines
   - Add comments where necessary
   - Update documentation if needed
4. **Test your changes**
   - Test all affected functionality
   - Verify no breaking changes
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **Backend**: Follow Java conventions and Spring Boot best practices
- **Frontend**: Follow React and TypeScript conventions
- **Documentation**: Update README and relevant docs

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Additional Documentation](#-additional-documentation)
3. Check backend and frontend logs
4. Verify database connection
5. Check browser console for errors

---

<div align="center">

**Made with ❤️ using Spring Boot and React**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#-car-rental-subscription-platform)

</div>
