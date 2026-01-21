# Frontend-Backend Integration Guide

This guide explains how the frontend and backend are integrated and how to ensure everything works together properly.

## Architecture Overview

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│   React Frontend│  ────────────────────────────> │  Spring Boot    │
│   (Port 3000)   │  <──────────────────────────── │  (Port 8080)    │
└─────────────────┘         JSON Responses        └─────────────────┘
                                                          │
                                                          │ JDBC/JPA
                                                          ▼
                                                  ┌─────────────────┐
                                                  │   PostgreSQL    │
                                                  │   (Port 5432)   │
                                                  └─────────────────┘
```

## Prerequisites

### 1. Database Setup

Ensure PostgreSQL is running and the database exists:

```sql
-- Connect to PostgreSQL
psql -U s324429

-- Create database if it doesn't exist
CREATE DATABASE carrental_db;

-- Verify
\l
```

### 2. Backend Configuration

The backend is configured in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/carrental_db
spring.datasource.username=s324429
spring.datasource.password=  # Add your password if needed

# Server
server.port=8080
```

**Important**: Update the database password if your PostgreSQL requires authentication.

### 3. Frontend Configuration

The frontend API service automatically detects the environment:
- **Development**: Uses Vite proxy (`/api` → `http://localhost:8080/api`)
- **Production**: Direct connection to backend

## Starting the Application

### Step 1: Start the Backend

```bash
# From project root
./gradlew bootRun

# Or using Gradle wrapper
./gradlew clean build
java -jar build/libs/carrental-0.0.1-SNAPSHOT.jar
```

**Verify Backend is Running:**
- Open: http://localhost:8080/api/categories
- Should return JSON response

### Step 2: Start the Frontend

```bash
# From frontend directory
cd frontend
npm install  # First time only
npm run dev
```

**Verify Frontend is Running:**
- Open: http://localhost:3000
- Should see the landing page

## API Integration Details

### Authentication Flow

1. **User Signs Up/Logs In**
   ```
   Frontend → POST /api/auth/signup or /api/auth/login
   Backend → Returns JWT token + user info
   Frontend → Stores token in localStorage
   ```

2. **Authenticated Requests**
   ```
   Frontend → Adds "Authorization: Bearer <token>" header
   Backend → JwtAuthenticationFilter validates token
   Backend → Processes request
   ```

### API Endpoints

#### Public Endpoints (No Auth Required)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/cars` - Get all available cars
- `GET /api/cars/{id}` - Get car by ID
- `GET /api/cars/category/{categoryId}` - Get cars by category
- `GET /api/cars/brand/{brand}` - Get cars by brand
- `GET /api/pricing/category/{categoryId}` - Get pricing plans
- `GET /api/pricing/calculate` - Calculate rental price

#### Protected Endpoints (Auth Required)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `POST /api/payments/process` - Process payment
- `GET /api/payments/booking/{bookingId}` - Get payment by booking

### Request/Response Format

All API responses follow this format:

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

## CORS Configuration

CORS is configured in two places:

1. **Spring Security** (`SecurityConfig.java`)
   - Allows requests from `http://localhost:3000` and `http://localhost:5173`
   - Allows all HTTP methods
   - Allows credentials (cookies, auth headers)

2. **Controller Level** (`@CrossOrigin(origins = "*")`)
   - Additional CORS annotation on each controller
   - Allows all origins (for development)

## Database Integration

### Automatic Schema Creation

The backend uses JPA with `spring.jpa.hibernate.ddl-auto=update`, which means:
- Tables are created automatically on first run
- Schema is updated when entities change
- Data is preserved (unless you change table structure)

### Sample Data

The `DataSeeder` class automatically creates:
- 3 Categories (Sedan, SUV, Luxury)
- 27 Pricing Plans (combinations of duration and KM packages)
- 12 Cars (distributed across categories)

**To reset data:**
1. Drop and recreate the database
2. Restart the backend
3. DataSeeder will run automatically

### Database Tables

- `users` - User accounts
- `categories` - Car categories
- `cars` - Available cars
- `pricing_plans` - Pricing configurations
- `bookings` - User bookings
- `payments` - Payment records

## Testing the Integration

### 1. Test Authentication

```bash
# Sign up a new user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Car Listing

```bash
# Get all cars
curl http://localhost:8080/api/cars

# Get categories
curl http://localhost:8080/api/categories
```

### 3. Test Booking Flow

1. **Login** via frontend → Get JWT token
2. **Browse cars** → Select a car
3. **Configure** → Select duration and KM package
4. **Review** → Enter start date and confirm
5. **Payment** → Process payment (mock)
6. **Confirmation** → View booking details

### 4. Verify Database

```sql
-- Check bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- Check payments
SELECT * FROM payments ORDER BY created_at DESC;

-- Check users
SELECT id, email, first_name, last_name FROM users;
```

## Common Issues & Solutions

### Issue 1: CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solution**:
- Verify backend is running on port 8080
- Check SecurityConfig has CORS enabled
- Ensure frontend is using the proxy in development

### Issue 2: 401 Unauthorized

**Symptoms**: API calls return 401 status

**Solution**:
- Check if user is logged in (token in localStorage)
- Verify token is being sent in Authorization header
- Check token hasn't expired (24 hours default)
- Try logging out and logging back in

### Issue 3: Database Connection Error

**Symptoms**: Backend fails to start, database errors

**Solution**:
- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l | grep carrental_db`
- Verify credentials in `application.properties`
- Check PostgreSQL is listening on port 5432

### Issue 4: No Data Showing

**Symptoms**: Frontend loads but no cars/categories

**Solution**:
- Check backend logs for errors
- Verify DataSeeder ran (check logs for "Sample data seeded successfully")
- Check database has data: `SELECT COUNT(*) FROM cars;`
- Restart backend to trigger DataSeeder

### Issue 5: Booking Not Saving

**Symptoms**: Booking appears to work but not in database

**Solution**:
- Check browser console for API errors
- Verify JWT token is valid
- Check backend logs for exceptions
- Verify booking endpoint is being called (Network tab)
- Check database directly: `SELECT * FROM bookings;`

## Environment Variables (Optional)

You can use environment variables for configuration:

### Backend (.env or application.properties)

```properties
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/carrental_db
SPRING_DATASOURCE_USERNAME=s324429
SPRING_DATASOURCE_PASSWORD=your_password

# Server
SERVER_PORT=8080

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080/api
```

Then update `api.ts`:
```typescript
baseURL: import.meta.env.VITE_API_URL || '/api'
```

## Production Deployment

### Backend
1. Build: `./gradlew clean build`
2. Run: `java -jar build/libs/carrental-0.0.1-SNAPSHOT.jar`
3. Update CORS to allow production frontend URL
4. Configure production database

### Frontend
1. Build: `npm run build`
2. Serve: Use a web server (nginx, Apache, etc.)
3. Update API base URL to production backend
4. Configure environment variables

## Monitoring & Debugging

### Backend Logs
- Check console output for SQL queries
- Look for exceptions and stack traces
- Monitor JWT token validation

### Frontend Logs
- Browser console for JavaScript errors
- Network tab for API requests/responses
- Application tab for localStorage (tokens)

### Database Queries
```sql
-- Check recent bookings
SELECT b.*, u.email, c.brand, c.model 
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN cars c ON b.car_id = c.id
ORDER BY b.created_at DESC
LIMIT 10;

-- Check payment status
SELECT p.*, b.id as booking_id
FROM payments p
JOIN bookings b ON p.booking_id = b.id
ORDER BY p.created_at DESC;
```

## Complete Integration Checklist

- [ ] PostgreSQL is running
- [ ] Database `carrental_db` exists
- [ ] Backend starts without errors
- [ ] DataSeeder creates sample data
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can see cars list in frontend
- [ ] Can sign up a new user
- [ ] Can log in with credentials
- [ ] Can browse and filter cars
- [ ] Can configure rental (duration, KM)
- [ ] Price calculation works
- [ ] Can create booking
- [ ] Booking appears in database
- [ ] Payment processing works
- [ ] Can view bookings in dashboard

## Next Steps

1. **Test the complete flow** from signup to booking confirmation
2. **Verify data persistence** - refresh page, check bookings still exist
3. **Test error scenarios** - invalid login, booking conflicts, etc.
4. **Monitor performance** - check API response times
5. **Add error handling** - improve user feedback for errors

Your application is now fully integrated! 🎉
