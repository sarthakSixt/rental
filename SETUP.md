# Complete Setup Guide

## Quick Start

### 1. Database Setup

```bash
# Start PostgreSQL (if not running)
# On macOS with Homebrew:
brew services start postgresql

# Create database
psql -U s324429 -c "CREATE DATABASE carrental_db;"

# Verify
psql -U s324429 -l | grep carrental_db
```

### 2. Backend Setup

```bash
# From project root
./gradlew clean build
./gradlew bootRun

# Backend will:
# - Start on http://localhost:8080
# - Connect to PostgreSQL
# - Create tables automatically
# - Seed sample data (cars, categories, pricing)
```

**Verify Backend:**
- Open: http://localhost:8080/api/categories
- Should see JSON with categories

### 3. Frontend Setup

```bash
# From project root
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will:
# - Start on http://localhost:3000
# - Proxy API calls to backend
# - Hot reload on changes
```

**Verify Frontend:**
- Open: http://localhost:3000
- Should see landing page

## Testing the Integration

1. **Sign Up**: Create a new account
2. **Browse Cars**: View available cars
3. **Select Car**: Click on a car
4. **Configure**: Choose duration (1/3/6 months) and KM package (500/1000/2000)
5. **Review**: Check details and select start date
6. **Pay**: Click "Confirm & Pay" (mock payment)
7. **Confirm**: See booking confirmation
8. **Dashboard**: View your bookings

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database exists
- Check `application.properties` credentials

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify Vite proxy configuration

### No data showing
- Check backend logs for DataSeeder output
- Verify database has data: `SELECT COUNT(*) FROM cars;`
- Restart backend to trigger DataSeeder

### Bookings not saving
- Check browser console for errors
- Verify JWT token is present (localStorage)
- Check backend logs for exceptions
- Verify database connection

## Database Verification

```sql
-- Connect to database
psql -U s324429 -d carrental_db

-- Check tables exist
\dt

-- Check sample data
SELECT COUNT(*) FROM categories;  -- Should be 3
SELECT COUNT(*) FROM cars;        -- Should be 12
SELECT COUNT(*) FROM pricing_plans; -- Should be 27

-- Check users
SELECT id, email, first_name FROM users;

-- Check bookings
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;
```

## API Testing

### Using curl

```bash
# Get categories
curl http://localhost:8080/api/categories

# Get cars
curl http://localhost:8080/api/cars

# Sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+1234567890"
  }'
```

### Using Browser

1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions in frontend
4. See API calls in Network tab
5. Check request/response details

## Environment Configuration

### Backend (application.properties)

Update these if needed:
- Database URL, username, password
- Server port (default: 8080)
- JWT secret and expiration

### Frontend (vite.config.ts)

- Proxy target (default: http://localhost:8080)
- Frontend port (default: 3000)

## Production Checklist

- [ ] Update CORS to allow production domain
- [ ] Set secure JWT secret
- [ ] Configure production database
- [ ] Update API base URL in frontend
- [ ] Build frontend: `npm run build`
- [ ] Configure web server (nginx/Apache)
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring/logging
- [ ] Test all endpoints
- [ ] Load test the application

## Support

If you encounter issues:
1. Check logs (backend console, browser console)
2. Verify database connection
3. Check network requests in browser DevTools
4. Review INTEGRATION_GUIDE.md for detailed troubleshooting
