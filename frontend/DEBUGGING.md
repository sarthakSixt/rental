# Debugging Guide - Booking Not Saving to Database

## How to Verify Bookings Are Being Saved

### Step 1: Check Browser Console

When you click "Confirm & Pay", you should see console logs like:

```
Creating booking with data: {userId: 1, carId: 1, ...}
JWT Token: Present
API POST /bookings: 201
Booking created successfully with ID: 123
```

### Step 2: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Click "Confirm & Pay"
4. Look for a request to `POST http://localhost:8080/api/bookings`
5. Check:
   - **Status**: Should be `201 Created` (success) or `400/401/500` (error)
   - **Request Payload**: Should contain all booking data
   - **Response**: Should contain the created booking object

### Step 3: Check Backend Logs

In your Spring Boot console, you should see:
```
Hibernate: insert into bookings (user_id, car_id, ...) values (?, ?, ...)
```

### Step 4: Verify Database

Check your PostgreSQL database:
```sql
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;
```

---

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" Error

**Problem**: JWT token is missing or invalid

**Solution**:
1. Check if you're logged in (check localStorage for `authToken`)
2. Try logging out and logging back in
3. Check browser console for "Unauthorized" messages

**Fix**: The token should be automatically added. If not, check:
- Is the user logged in?
- Is the token in localStorage? (Check DevTools → Application → Local Storage)

### Issue 2: "400 Bad Request" Error

**Problem**: Request data format is incorrect

**Check**:
- Is `startDate` in YYYY-MM-DD format? (e.g., "2024-01-15")
- Are all required fields present?
- Check the Network tab → Request Payload

**Fix**: The date input should automatically format correctly. If not, verify:
```javascript
// In Review.tsx, startDate should be from date input
// Format: "YYYY-MM-DD"
```

### Issue 3: "500 Internal Server Error"

**Problem**: Backend error (car not available, user not found, etc.)

**Check**:
- Backend console logs for error messages
- Database connection
- Car availability status

**Fix**: Check backend logs for specific error message

### Issue 4: No Network Request Appears

**Problem**: JavaScript error preventing API call

**Check**:
- Browser console for JavaScript errors
- Check if `handlePayment` function is being called
- Verify all required data is present

**Fix**: Check console for errors and fix them

---

## Testing Checklist

- [ ] User is logged in (check Navbar shows user name)
- [ ] JWT token exists in localStorage
- [ ] Backend is running on port 8080
- [ ] Database is connected
- [ ] Car is available (status = AVAILABLE)
- [ ] All form fields are filled (especially start date)
- [ ] Network request appears in Network tab
- [ ] Response status is 201 (Created)
- [ ] Booking appears in database

---

## Manual API Test

You can test the API directly using curl:

```bash
# First, get a token by logging in
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Then create a booking (replace TOKEN with actual token)
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "userId": 1,
    "carId": 1,
    "categoryId": 1,
    "durationMonths": 3,
    "kmPackage": 1000,
    "startDate": "2024-02-01"
  }'
```

---

## Expected Flow

1. **User clicks "Confirm & Pay"**
   - Console: "Creating booking with data: {...}"
   - Network: POST request to `/api/bookings`

2. **Backend receives request**
   - Validates JWT token
   - Creates booking in database
   - Returns booking object

3. **Frontend receives response**
   - Console: "Booking created successfully with ID: X"
   - Processes payment
   - Navigates to confirmation page

4. **Database**
   - New row inserted in `bookings` table
   - New row inserted in `payments` table

---

## If Still Not Working

1. **Check Backend Logs**: Look for any exceptions or errors
2. **Check Database**: Verify the booking table exists and has correct schema
3. **Check CORS**: Ensure backend allows requests from `http://localhost:3000`
4. **Check Authentication**: Verify JWT token is valid and not expired
5. **Check Car Availability**: Ensure the selected car is available

---

## Quick Debug Code

Add this to Review.tsx temporarily to see all data:

```typescript
console.log('All booking data:', {
  user,
  car,
  durationMonths,
  kmPackage,
  startDate,
  priceCalculation,
  token: apiService.getToken(),
});
```

This will help identify if any data is missing before the API call.
