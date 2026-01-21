# Frontend Flow Documentation

## Complete User Flow

This document explains the 5-page flow implemented in the frontend.

---

## Page Flow Overview

```
1. Landing Page (Home)
   ↓
2. Cars List (Browse & Filter)
   ↓ (Select Car)
3. Configuration Page (Select Duration & KM Package)
   ↓ (Calculate Price & Continue)
4. Review Page (User Details + Payment Mock)
   ↓ (Confirm Payment)
5. Confirmation Page (Success/Failure)
```

---

## Detailed Page Descriptions

### Page 1: Landing Page (`/`)
**Component:** `Home.tsx`

**Features:**
- Hero section with welcome message
- Call-to-action buttons
- Feature highlights
- Navigation to cars list

**User Actions:**
- Click "Browse Cars" → Goes to Page 2
- Click "Get Started" → Goes to Signup

---

### Page 2: Cars List (`/cars`)
**Component:** `CarList.tsx`

**Features:**
- Display all available cars in a grid
- Filter by category (dropdown)
- Filter by brand (dropdown)
- Clear filters option
- Car cards showing:
  - Car image
  - Brand and model
  - Category
  - Availability status

**User Actions:**
- Select filters → Cars update dynamically
- Click on a car card → Goes to Page 3 (Configuration) with car data

**Data Passed:**
- Car object (complete car details)

---

### Page 3: Configuration Page (`/configure`)
**Component:** `Configuration.tsx`

**Features:**
- Car summary header (image, brand, model, category)
- Duration selection (1, 3, or 6 months) - buttons
- KM Package selection (500, 1000, or 2000 km/month) - buttons
- Real-time price calculation
- Price summary display:
  - Price per month
  - Duration
  - KM Package
  - **Total Amount** (highlighted)

**User Actions:**
- Select duration → Price recalculates automatically
- Select KM package → Price recalculates automatically
- Click "Continue to Review" → Goes to Page 4 with all data
- Click "Cancel" → Returns to Page 2

**Data Passed:**
- Car object
- Duration (months)
- KM Package
- Price Calculation (complete pricing details)

**API Calls:**
- `GET /api/pricing/calculate?categoryId=X&durationMonths=Y&kmPackage=Z`

---

### Page 4: Review Page (`/review`)
**Component:** `Review.tsx`

**Features:**
- **Protected Route** (requires login)
- User details section:
  - Full name
  - Email
  - Phone number
- Car details summary
- Rental configuration summary
- Price summary
- Rental start date picker
- Payment buttons:
  - "Test Payment Failure" (red button) - for testing
  - "Confirm & Pay" (green button) - for success

**User Actions:**
- If not logged in → Redirects to login (with return path)
- Select start date (date picker)
- Click "Test Payment Failure" → Tests failure scenario
- Click "Confirm & Pay" → Tests success scenario
- Click "Back" → Returns to Page 3

**Data Passed:**
- Car object
- Duration
- KM Package
- Price Calculation
- Start Date

**API Calls:**
- `POST /api/bookings` - Creates booking
- `POST /api/payments/process` - Processes payment (mock)

**Flow:**
1. User fills start date
2. Clicks payment button
3. Booking created via API
4. Payment processed (mock)
5. Navigate to Page 5 with result

---

### Page 5: Confirmation Page (`/confirmation`)
**Component:** `Confirmation.tsx`

**Features:**
- Success or Failure display based on payment result
- **Success State:**
  - Green header with checkmark
  - Booking reference number
  - Car details
  - Rental period (start/end dates)
  - Payment details (amount, transaction ID, status)
  - "What's Next" information
- **Failure State:**
  - Red header with X mark
  - Error message
  - Instructions to try again

**User Actions:**
- Click "Browse More Cars" → Returns to Page 2
- Click "View My Bookings" (success only) → Goes to Dashboard

**Data Received:**
- Success/failure status
- Booking object
- Payment object
- Car object
- Price Calculation

---

## Additional Pages

### Login Page (`/login`)
**Component:** `Login.tsx`

**Features:**
- Email and password form
- Error handling
- Link to signup
- Redirects to original page after login (if redirected from protected route)

---

### Signup Page (`/signup`)
**Component:** `Signup.tsx`

**Features:**
- Registration form:
  - First name
  - Last name
  - Email
  - Phone number
  - Password
  - Confirm password
- Form validation
- Auto-login after successful signup

---

### Dashboard (`/dashboard`)
**Component:** `Dashboard.tsx`

**Features:**
- **Protected Route** (requires login)
- List of user's bookings
- Booking details:
  - Booking ID
  - Status
  - Car details
  - Rental period
  - Price information
- Cancel booking functionality
- Empty state if no bookings

---

## Data Flow Between Pages

### Using React Router State

Data is passed between pages using React Router's `location.state`:

```typescript
// Navigate with data
navigate('/configure', {
  state: {
    car: selectedCar,
    // ... other data
  }
});

// Receive data
const location = useLocation();
const car = location.state?.car;
```

### Data Flow Chain

```
CarList → Configuration
  car object

Configuration → Review
  car object
  durationMonths
  kmPackage
  priceCalculation

Review → Confirmation
  success (boolean)
  booking object
  payment object
  car object
  priceCalculation
```

---

## Authentication Flow

### Protected Routes
- `/review` - Requires login
- `/dashboard` - Requires login

### Redirect Flow
1. User tries to access protected route
2. Not logged in → Redirect to `/login`
3. Login page stores return path in state
4. After login → Redirect back to original page with state

---

## Payment Mock Flow

### Success Flow
1. User clicks "Confirm & Pay"
2. Booking created (`POST /api/bookings`)
3. Payment processed with `mockSuccess: true` (`POST /api/payments/process`)
4. Navigate to confirmation with `success: true`

### Failure Flow
1. User clicks "Test Payment Failure"
2. Booking created (`POST /api/bookings`)
3. Payment processed with `mockSuccess: false` (`POST /api/payments/process`)
4. Navigate to confirmation with `success: false`

---

## Key Features

### 1. Real-time Price Calculation
- Price updates automatically when duration or KM package changes
- Shows loading state during calculation
- Displays detailed price breakdown

### 2. State Management
- React Router state for page-to-page data
- Context API for global authentication
- Local state for form inputs

### 3. Error Handling
- API error messages displayed to user
- Validation errors
- Network error handling

### 4. User Experience
- Loading states during API calls
- Smooth transitions between pages
- Clear navigation paths
- Responsive design

---

## Testing the Flow

### Complete Happy Path
1. Visit `/` (Landing)
2. Click "Browse Cars" → `/cars`
3. Select a car → `/configure`
4. Select duration (e.g., 3 months)
5. Select KM package (e.g., 1000 km)
6. Wait for price calculation
7. Click "Continue to Review" → `/review`
8. If not logged in → `/login` → Login → Returns to `/review`
9. Select start date
10. Click "Confirm & Pay" → `/confirmation` (Success)

### Testing Payment Failure
1. Follow steps 1-9 above
2. Click "Test Payment Failure" instead
3. See failure confirmation page

---

## File Structure

```
src/
├── components/
│   ├── Home.tsx              # Page 1: Landing
│   ├── CarList.tsx            # Page 2: Cars List
│   ├── Configuration.tsx      # Page 3: Configuration
│   ├── Review.tsx             # Page 4: Review
│   ├── Confirmation.tsx       # Page 5: Confirmation
│   ├── Login.tsx              # Login page
│   ├── Signup.tsx             # Signup page
│   ├── Dashboard.tsx          # User dashboard
│   ├── Navbar.tsx             # Navigation bar
│   └── ProtectedRoute.tsx     # Route protection
├── context/
│   └── AuthContext.tsx        # Authentication state
├── services/
│   └── api.ts                 # API service layer
└── types/
    └── index.ts               # TypeScript types
```

---

## API Endpoints Used

- `GET /api/cars` - Get all cars
- `GET /api/cars/category/:id` - Get cars by category
- `GET /api/cars/brand/:brand` - Get cars by brand
- `GET /api/categories` - Get all categories
- `GET /api/pricing/calculate` - Calculate price
- `POST /api/bookings` - Create booking
- `POST /api/payments/process` - Process payment (mock)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User signup
- `GET /api/bookings/user/:userId` - Get user bookings

---

This flow ensures a smooth, intuitive user experience from browsing cars to completing a booking!
