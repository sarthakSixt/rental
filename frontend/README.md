# Car Rental Frontend

Modern, dynamic frontend for the Car Rental Subscription Platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Login and Signup with JWT
- 🚗 **Car Browsing** - Browse and filter cars by category and brand
- 📅 **Booking System** - Create bookings with flexible duration and KM packages
- 💳 **Payment Processing** - Integrated payment flow
- 📊 **Dashboard** - View and manage your bookings
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Navbar.tsx
│   │   ├── CarList.tsx
│   │   ├── CarDetails.tsx
│   │   ├── BookingForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/          # React Context for state
│   │   └── AuthContext.tsx
│   ├── services/         # API service layer
│   │   └── api.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Key Concepts Explained

### 1. API Service Layer (`src/services/api.ts`)
- Centralized HTTP client using Axios
- Automatic JWT token injection
- Error handling
- All backend API calls are defined here

### 2. Authentication Context (`src/context/AuthContext.tsx`)
- Global authentication state
- Login/logout functions
- User information management
- Persists authentication across page refreshes

### 3. Protected Routes (`src/components/ProtectedRoute.tsx`)
- Wraps components that require authentication
- Redirects to login if not authenticated
- Shows loading state while checking auth

### 4. Component Structure
- Each component is self-contained
- Uses TypeScript for type safety
- Follows React best practices (hooks, functional components)
- Responsive design with Tailwind CSS

## API Integration

The frontend communicates with the backend REST API at `http://localhost:8080/api`:

- `/api/auth/login` - User login
- `/api/auth/signup` - User registration
- `/api/cars` - Get all cars
- `/api/cars/:id` - Get car details
- `/api/bookings` - Create booking
- `/api/bookings/user/:userId` - Get user bookings
- `/api/payments/process` - Process payment
- `/api/pricing/calculate` - Calculate rental price

## Development Tips

1. **Hot Module Replacement**: Vite provides instant updates during development
2. **TypeScript**: All components are typed for better development experience
3. **Tailwind CSS**: Use utility classes for styling, check [Tailwind docs](https://tailwindcss.com/docs)
4. **React Router**: Use `useNavigate()` for programmatic navigation
5. **Context API**: Use `useAuth()` hook to access authentication state

## Troubleshooting

- **CORS Errors**: Make sure backend has CORS enabled (already configured)
- **API Connection**: Verify backend is running on port 8080
- **Token Issues**: Check browser localStorage for `authToken`
- **Build Errors**: Run `npm install` to ensure all dependencies are installed
