# SmartLot - Intelligent Parking Management System

A modern, real-time parking management system built with React, Firebase, and Tailwind CSS. SmartLot helps parking administrators efficiently manage vehicle entries, exits, slot assignments, and revenue tracking.

![SmartLot Logo](https://img.shields.io/badge/SmartLot-Parking%20Management-blue)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.12.0-FFCA28?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2.2-38B2AC?logo=tailwind-css)


## Demo Link - smart-lot.vercel.app

## Features

- **Real-time Dashboard**: Live overview of total slots, occupancy, and availability
- **Slot Map Visualization**: Grid-based visual representation of parking slots with color-coded status
- **Vehicle Entry/Exit Management**: Streamlined check-in and check-out process with automatic slot assignment
- **Dynamic Pricing**: Configurable hourly rates with automatic charge calculation
- **Parking Logs**: Comprehensive history with filtering by vehicle number, date, and status
- **Admin Settings**: Configure grid dimensions (rows/columns), pricing, and regenerate parking slots
- **Authentication**: Secure Firebase Authentication for admin access
- **Responsive Design**: Modern UI with Tailwind CSS and Material UI components

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework |
| **Vite** | Build tool and development server |
| **Firebase** | Backend-as-a-Service (Auth, Firestore Database) |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Material UI** | Component library for React |
| **React Router v7** | Client-side routing |
| **React Icons** | Icon library |

## Project Structure

```
SmartLot/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sidebar navigation with icons
│   │   └── PrivateRoute.jsx    # Route protection for authenticated users
│   ├── context/
│   │   └── AuthContext.jsx     # Firebase auth state management
│   ├── pages/
│   │   ├── Dashboard.jsx       # Overview stats and navigation
│   │   ├── SlotMap.jsx         # Visual parking grid display
│   │   ├── VehicleEntry.jsx    # Vehicle check-in process
│   │   ├── VehicleExit.jsx     # Vehicle check-out with receipt
│   │   ├── Logs.jsx            # Parking history and filters
│   │   ├── Settings.jsx        # Admin configuration panel
│   │   └── Login.jsx           # Authentication page
│   ├── firebase.js             # Firebase initialization and exports
│   ├── utils/
│   │   └── constant.js         # App constants (background URLs, etc.)
│   ├── App.jsx                 # Main app component with routes
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind CSS imports and custom styles
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Firebase Data Model

### Collections

**1. `settings/config`** - Application configuration
```javascript
{
  pricePerHour: number,    // Hourly parking rate (₹)
  rows: number,            // Grid rows
  cols: number             // Grid columns
}
```

**2. `parkingSlots`** - Parking slot documents
```javascript
{
  row: number,             // Row index (0-based)
  col: number,             // Column index (0-based)
  status: "free" | "taken",
  vehicleNumber: string | null,
  vehicleId: string | null
}
// Document ID format: "{row}-{col}" (e.g., "0-0", "1-3")
```

**3. `vehicles`** - Parking session records
```javascript
{
  vehicleNumber: string,   // License plate (uppercase)
  slotId: string,          // Reference to parking slot
  checkInTime: Timestamp,
  checkOutTime: Timestamp | null,
  amountCharged: number | null
}
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartLot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Update `src/firebase.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. **Set up Firebase Authentication**
   - Enable Email/Password authentication in Firebase Console
   - Create an admin user in Firebase Authentication

5. **Initialize Firestore Database**
   - Create a `settings/config` document with initial values:
     ```javascript
     {
       pricePerHour: 50,
       rows: 3,
       cols: 4
     }
     ```
   - Run "Regenerate Parking Slots" from the Settings page to initialize slots

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   
   Navigate to `http://localhost:5173` in your browser

## Usage Guide

### Login
- Access the application with your Firebase email/password credentials

### Dashboard
- View real-time parking statistics: Total Slots, Occupied, Available
- See current pricing rate
- Quick navigation to all sections

### Vehicle Entry
1. Enter the vehicle number (e.g., MH12AB1234)
2. Click "Check In Vehicle"
3. System automatically assigns the first available slot
4. Confirmation shows assigned slot (e.g., A1, B2)

### Vehicle Exit
1. Enter the vehicle number
2. Click "Check Out Vehicle"
3. System calculates charges based on duration × hourly rate
4. Receipt displays with full details

### Slot Map
- Visual grid representation of the parking lot
- Green = Free slots
- Red = Occupied slots (shows vehicle number)
- Legend and live statistics

### Logs
- Complete parking history with real-time updates
- Filters: Vehicle number (search), Date, Status (Active/Completed)
- Summary cards: Total records, Active, Completed, Revenue

### Settings
- **Price per Hour**: Set parking rate (₹)
- **Rows/Columns**: Configure grid dimensions
- **Save Settings**: Apply configuration changes
- **Regenerate Parking Slots**: Rebuild the parking grid after changing dimensions

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Key Design Decisions

### Slot ID Convention
- Slots are identified as `"{row}-{col}"` (e.g., "0-0", "2-3")
- Displayed to users as `{Letter}{Number}` (A1, B2, etc.)
- Row → Letter (0=A, 1=B, ...)
- Column → Number (0=1, 1=2, ...)

### Pricing Logic
- Minimum charge: 1 hour
- Billing: Rounds up to the next hour
- Formula: `Math.ceil(durationHours) × pricePerHour`

### Real-time Updates
- Uses Firebase `onSnapshot` for live data
- Dashboard, Slot Map, and Logs update automatically
- No page refresh needed

### State Management
- React Context for authentication state
- Local component state for UI
- Firebase as the single source of truth

## Security Considerations

- Firebase Auth protects all routes (except login)
- Firestore security rules should be configured server-side
- Vehicle numbers are normalized to uppercase
- Duplicate entry prevention (checks for existing active sessions)

## Future Enhancements

- [ ] QR code scanning for vehicle entry/exit
- [ ] Payment gateway integration
- [ ] SMS/Email receipts
- [ ] Analytics dashboard with charts
- [ ] Multi-location support
- [ ] Reservation system
- [ ] Mobile app (React Native)

## License

[MIT](LICENSE)

## Author

Razik Khan

---

*Built with React, Firebase, and Tailwind CSS*
