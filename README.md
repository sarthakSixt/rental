# 🚗 Car Rental Subscription Platform

A modern, full-stack car rental application with Spring Boot backend and React frontend.

## 🎯 Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 🚗 **Car Browsing** - Browse and filter cars by category and brand
- ⚙️ **Flexible Configuration** - Choose rental duration (1/3/6 months) and KM packages (500/1000/2000)
- 💰 **Dynamic Pricing** - Real-time price calculation based on configuration
- 📅 **Booking Management** - Create, view, and manage bookings
- 💳 **Payment Processing** - Mock payment integration
- 📊 **User Dashboard** - View all your bookings in one place
- 🎨 **Modern Dark Theme UI** - Beautiful, responsive design with animations

## 🏗️ Tech Stack

### Backend
- **Spring Boot 4.0.1** - Java framework
- **PostgreSQL** - Database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **JPA/Hibernate** - ORM
- **Gradle** - Build tool

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

## 📋 Prerequisites

- **Java 25+** (or Java 17+)
- **Node.js 18+** and npm
- **PostgreSQL** (running on port 5432)
- **Gradle** (or use Gradle wrapper)

## 🚀 Quick Start

### 1. Database Setup

```bash
# Create database
psql -U s324429 -c "CREATE DATABASE carrental_db;"

# Or use the verification script
./verify-db.sh
```

### 2. Backend Setup

```bash
# Build and run backend
./gradlew clean build
./gradlew bootRun

# Backend will start on http://localhost:8080
# Sample data will be automatically seeded
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:3000
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete integration guide
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Integration overview
- **[frontend/FLOW.md](./frontend/FLOW.md)** - Frontend flow documentation
- **[frontend/DEBUGGING.md](./frontend/DEBUGGING.md)** - Debugging guide

## 🎮 Usage

### Complete User Flow

1. **Sign Up** - Create a new account
2. **Browse Cars** - View available cars with filters
3. **Select Car** - Click on a car to configure
4. **Configure Rental** - Choose duration and KM package
5. **Review** - Check details and select start date
6. **Pay** - Process payment (mock)
7. **Confirm** - View booking confirmation
8. **Dashboard** - Manage all your bookings

### API Testing

```bash
# Get all cars
curl http://localhost:8080/api/cars

# Get categories
curl http://localhost:8080/api/categories

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
```

## 🗄️ Database

The application uses PostgreSQL with the following main tables:

- `users` - User accounts
- `categories` - Car categories (Sedan, SUV, Luxury)
- `cars` - Available cars
- `pricing_plans` - Pricing configurations
- `bookings` - User bookings
- `payments` - Payment records

Tables are automatically created by Hibernate on first run.

## 🔧 Configuration

### Backend (`src/main/resources/application.properties`)

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/carrental_db
spring.datasource.username=s324429
spring.datasource.password=  # Add your password

# Server
server.port=8080
```

### Frontend (`frontend/vite.config.ts`)

- Proxy configured to forward `/api` to `http://localhost:8080`
- Frontend runs on port 3000

## 🧪 Testing

### Verify Database

```bash
./verify-db.sh
```

### Test API Endpoints

```bash
# Public endpoints
curl http://localhost:8080/api/categories
curl http://localhost:8080/api/cars

# Protected endpoints (need JWT token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/bookings/user/1
```

### Check Database

```sql
-- Connect to database
psql -U s324429 -d carrental_db

-- Check data
SELECT COUNT(*) FROM cars;        -- Should be 12
SELECT COUNT(*) FROM categories;  -- Should be 3
SELECT COUNT(*) FROM bookings;    -- Your bookings
```

## 🐛 Troubleshooting

### Backend Issues

- **Database connection error**: Check PostgreSQL is running and credentials are correct
- **Port 8080 in use**: Change port in `application.properties` or stop other service
- **No sample data**: Check DataSeeder ran (look for "Sample data seeded successfully" in logs)

### Frontend Issues

- **CORS errors**: Verify backend CORS configuration
- **API errors**: Check backend is running on port 8080
- **No data**: Verify backend is running and database has data

### Integration Issues

- **401 Unauthorized**: Check JWT token is valid, try logging in again
- **Booking not saving**: Check backend logs, verify database connection
- **Network errors**: Verify both frontend and backend are running

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed troubleshooting.

## 📁 Project Structure

```
rental/
├── src/main/java/com/sixt/carrental/
│   ├── controller/     # REST API endpoints
│   ├── service/        # Business logic
│   ├── repository/    # Data access
│   ├── entity/         # Database entities
│   ├── dto/            # Data transfer objects
│   └── config/         # Configuration (Security, JWT, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service layer
│   │   ├── context/    # React context (Auth)
│   │   └── types/      # TypeScript types
│   └── package.json
├── build.gradle
└── README.md
```

## 🎨 UI Features

- **Dark Theme** - Modern dark color scheme
- **Smooth Animations** - Fade-in, slide, scale effects
- **Responsive Design** - Works on all screen sizes
- **Glass Morphism** - Modern card designs
- **Gradient Buttons** - Beautiful interactive buttons
- **Loading States** - Smooth loading indicators

## 🔐 Security

- JWT token-based authentication
- BCrypt password hashing
- Protected API endpoints
- CORS properly configured
- SQL injection prevention (JPA)

## 📝 API Documentation

All API endpoints return data in this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
3. Check backend and frontend logs
4. Verify database connection
5. Check browser console for errors

## 🎉 Success!

Your car rental platform is now fully integrated and ready to use!

- ✅ Backend connected to PostgreSQL
- ✅ Frontend connected to backend
- ✅ Authentication working
- ✅ Booking flow complete
- ✅ Data persistence verified
- ✅ Beautiful dark theme UI

Enjoy your car rental application! 🚗✨
