# Smart Bus Pass Booking System 🚌

A comprehensive full-stack web application for managing bus passes with multi-role authentication, real-time tracking, AI-powered features, and modern UI.

## 🎯 Features

### For Users
- **Registration & Login**: Secure authentication system with role-based access
- **Apply for Bus Pass**: Choose from Monthly, Quarterly, or Yearly passes
- **AI Route Suggestion**: Get intelligent route recommendations based on your locations
- **Crowd Prediction**: Real-time crowd levels for different routes and times
- **Document Upload**: Upload ID proof and photos during application
- **Payment Integration**: Simulated payment system for pass purchases
- **QR Code Generation**: Unique QR codes for each approved pass
- **Download Pass as PDF**: Generate and download professional pass documents
- **Pass Renewal**: Easy renewal process for expiring passes
- **Application Tracking**: Monitor application status in real-time
- **Expiry Notifications**: Get alerts when passes are about to expire
- **Live Bus Tracking**: Track buses on routes with real-time updates

### For Admins
- **Analytics Dashboard**: Comprehensive charts and statistics
  - Monthly pass trends
  - Revenue tracking
  - Pass type distribution
  - User growth metrics
- **Application Management**: Approve or reject pass applications
- **Route Management**: Add, edit, and delete bus routes
- **User Management**: View and manage all registered users
- **Fare Management**: Set and update route fares
- **Recent Activity Feed**: Monitor all system activities
- **Charts & Visualizations**: Interactive graphs using Recharts

### For Bus Operators
- **QR Code Scanner**: Verify passenger passes instantly
- **Pass Validation**: Check pass status, expiry, and payment
- **Passenger Details**: View complete passenger information
- **Scan History**: Track all verification activities
- **Daily Statistics**: View today's verification metrics
- **Success Rate Tracking**: Monitor verification accuracy

## 🎨 Design Features

- **Modern & Colorful UI**: Gradient backgrounds and vibrant colors
- **Dark Mode**: Full dark mode support throughout the app
- **Multi-Language Support**: English, Spanish, and Hindi
- **Mobile Responsive**: Fully responsive design for all devices
- **Smooth Animations**: Motion effects for enhanced UX
- **Toast Notifications**: Real-time feedback for user actions
- **Professional Dashboards**: Clean and organized layouts

## 🔐 Demo Accounts

### Admin
- Email: `admin@buspass.com`
- Password: `admin123`

### Bus Operator
- Email: `operator@buspass.com`
- Password: `operator123`

### User
- Create a new account via registration

## 🚀 Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS v4 for styling
- Recharts for data visualization
- react-qr-code for QR generation
- jsPDF & html2canvas for PDF generation
- i18next for internationalization
- next-themes for dark mode
- Lucide React for icons
- Sonner for toast notifications

### State Management
- Local Storage for data persistence
- React Hooks for component state

### Features Implemented
- QR Code generation and scanning
- PDF document generation
- AI-based route suggestions
- Crowd prediction algorithm
- Real-time bus tracking simulation
- Multi-language support (EN, ES, HI)
- Dark/Light theme switching

## 📱 Application Structure

```
/src/app/
├── components/
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Registration page
│   ├── UserDashboard.tsx      # User dashboard
│   ├── ApplyPass.tsx          # Pass application form
│   ├── MyPasses.tsx           # View & download passes
│   ├── LiveTracking.tsx       # Real-time bus tracking
│   ├── AdminDashboard.tsx     # Admin panel
│   ├── OperatorDashboard.tsx  # Operator QR scanner
│   └── NotFound.tsx           # 404 page
├── utils/
│   └── mockData.ts            # Data management & mock backend
├── routes.tsx                 # App routing configuration
├── i18n.ts                    # Internationalization setup
├── App.tsx                    # Main app component
└── styles.css                 # Custom styles
```

## 🎯 Key Features Explained

### AI Route Suggestion
The system uses an intelligent algorithm to suggest the best routes based on:
- Start and end locations
- Available stops on each route
- Distance and duration
- Current fare rates

### Crowd Prediction
Predicts crowd levels based on:
- Time of day
- Historical patterns
- Route popularity
Returns: High, Medium, or Low crowd levels

### QR Code System
- Unique QR codes generated for each pass
- Contains pass ID, user info, and validity
- Scannable by operators for instant verification
- Includes expiry validation

### PDF Generation
- Professional pass documents
- Includes QR code, passenger details, validity dates
- Downloadable and printable
- Suitable for verification

## 🔧 Data Storage

The application uses browser LocalStorage for data persistence with the following collections:
- Users (with role-based access)
- Bus Passes (with QR codes)
- Routes (with stops and fares)
- Applications (with status tracking)

## 🎨 UI/UX Highlights

- **Gradient Backgrounds**: Blue to purple gradients throughout
- **Card-Based Layout**: Clean, organized information display
- **Color-Coded Status**: Visual indicators for different states
- **Interactive Elements**: Hover effects and animations
- **Responsive Tables**: Mobile-friendly data displays
- **Modal Dialogs**: For confirmations and forms
- **Loading States**: User feedback during operations

## 📊 Analytics & Charts

The admin dashboard includes:
1. **Line Chart**: Monthly pass trends
2. **Bar Chart**: Revenue tracking
3. **Pie Chart**: Pass type distribution
4. **Statistics Cards**: Key metrics at a glance
5. **Activity Feed**: Recent system events

## 🌐 Live Tracking

The live tracking feature simulates real-time bus location with:
- Animated bus icon on map
- ETA calculations
- Current speed and occupancy
- Route visualization
- Stop markers

**Note**: In production, integrate with Google Maps API for actual GPS tracking.

## 🔄 Pass Lifecycle

1. **Application**: User applies with documents
2. **Pending**: Admin review required
3. **Approved**: Pass approved by admin
4. **Payment**: User completes payment
5. **Active**: QR code generated, PDF downloadable
6. **Expiry**: Notification sent, renewal available

## 🎓 Learning Resources

This project demonstrates:
- Multi-role authentication systems
- Complex state management
- QR code generation and scanning
- PDF generation in React
- Data visualization with charts
- Internationalization (i18n)
- Dark mode implementation
- Responsive design patterns
- Form handling and validation

## 🚀 Future Enhancements

For production deployment, consider adding:
- Real backend API (Node.js, Flask, or Django)
- Database (MySQL, PostgreSQL, or MongoDB)
- Payment gateway integration (Stripe, PayPal)
- Email/SMS notification service
- Google Maps API for actual tracking
- Cloud storage for documents
- Advanced analytics and reporting
- Mobile app (React Native)
- Push notifications
- Biometric authentication

## 📝 Notes

- This is a prototype/demo application
- Data is stored in browser LocalStorage
- Payment processing is simulated
- Live tracking is animated/simulated
- For production, implement proper backend and security

## 🎉 Getting Started

1. Open the application
2. Use demo credentials or register a new account
3. Explore features based on your role
4. Try applying for a pass (as user)
5. Approve applications (as admin)
6. Scan QR codes (as operator)

Enjoy exploring the Smart Bus Pass Booking System! 🚌✨
<img width="1446" height="859" alt="image" src="https://github.com/user-attachments/assets/020b503a-deb7-4b23-b6e2-4d7a1b8441e0" />
<img width="1498" height="865" alt="image" src="https://github.com/user-attachments/assets/ec6d1d3e-b532-4430-9924-9980d1d96837" />
<img width="1546" height="872" alt="image" src="https://github.com/user-attachments/assets/7ff55be3-30fa-4a25-8975-56f7dc49c500" />
<img width="891" height="849" alt="image" src="https://github.com/user-attachments/assets/d72e6372-241e-4832-bb71-d3afc8215c40" />
<img width="890" height="808" alt="image" src="https://github.com/user-attachments/assets/012d8a62-5839-4a5e-9686-28071821117d" />
<img width="1365" height="817" alt="image" src="https://github.com/user-attachments/assets/1a88179d-eb3f-4d9c-99de-928065666a33" />
<img width="1363" height="840" alt="image" src="https://github.com/user-attachments/assets/f493b53d-86af-43dc-a298-45c0d547cfc0" />
<img width="1545" height="871" alt="image" src="https://github.com/user-attachments/assets/202781df-2748-4829-8bb3-a2b582214a1e" />
<img width="1535" height="875" alt="image" src="https://github.com/user-attachments/assets/bd93b13d-c9d6-4b82-8c2f-4a360f2c0558" />
