# College Guidance Mobile Application

A comprehensive mobile application for HSC students to explore and discover colleges based on their preferences, cutoff marks, fees, and facilities.

## Features

### 1. Dual Authentication System
- **Student Login**: Students can create accounts to browse and explore college information
- **College Admin Login**: College administrators can manage their institution's profile and course offerings
- Email/password authentication with role-based access control

### 2. Student Features
- **Home Screen**: Displays featured colleges sorted by NIRF ranking
- **Explore Screen**: Search and filter colleges by name or location
- **College Details**: Comprehensive information including:
  - College overview and description
  - NIRF ranking and establishment year
  - Fee structure and last year's cutoff marks
  - Infrastructure details
  - Hostel facilities (AC/Non-AC) with fees
  - Available courses with detailed information
  - Contact information (website, email, phone)
- **Profile Management**: View and manage personal information

### 3. College Admin Features
- **Admin Dashboard**: Overview of college statistics
- **Course Management**:
  - Add new courses
  - View all courses
  - Delete courses
  - Manage course details (duration, seats, fees)
- College information display with key metrics

### 4. Sample Data
The application comes pre-populated with information for two colleges:

**Mumbai Institute of Technology**
- Location: Mumbai, Maharashtra
- NIRF Ranking: 45
- Established: 1995
- Total Fees: ₹4.5 Lakhs
- Last Year Cutoff: 85.5%
- Hostel: AC and Non-AC available
- Courses: 4 engineering programs

**Pune Science and Arts College**
- Location: Pune, Maharashtra
- NIRF Ranking: 78
- Established: 1985
- Total Fees: ₹2.8 Lakhs
- Last Year Cutoff: 78.0%
- Hostel: Non-AC available
- Courses: 5 undergraduate programs

## Technical Architecture

### Technology Stack
- **Framework**: Expo (React Native)
- **Routing**: Expo Router (file-based routing)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Language**: TypeScript
- **UI**: React Native with StyleSheet

### Project Structure
```
project/
├── app/
│   ├── (auth)/          # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/          # Student tab navigation
│   │   ├── index.tsx    # Home screen
│   │   ├── explore.tsx  # Search and explore
│   │   └── profile.tsx  # User profile
│   ├── (admin)/         # Admin dashboard
│   │   └── dashboard.tsx
│   ├── college/
│   │   └── [id].tsx     # Dynamic college detail screen
│   └── _layout.tsx      # Root layout with auth routing
├── components/
│   └── CollegeCard.tsx  # Reusable college card component
├── contexts/
│   └── AuthContext.tsx  # Authentication context provider
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── types/
│   └── database.ts      # TypeScript type definitions
└── scripts/
    └── setup-database.sql  # Database schema and sample data
```

### Database Schema

#### Tables
1. **profiles**
   - User profile information
   - Role assignment (student/college_admin)
   - College association for admins

2. **colleges**
   - Complete college information
   - Infrastructure and facility details
   - Contact information

3. **courses**
   - Course details per college
   - Fees, duration, and seat information

#### Security
- Row Level Security (RLS) enabled on all tables
- Students can view all colleges and courses
- Admins can only modify their own college data
- Users can only manage their own profiles

### Navigation Flow

```
Root Layout
├── Auth Group (Unauthenticated)
│   ├── Login
│   └── Signup
├── Tabs Group (Students)
│   ├── Home
│   ├── Explore
│   └── Profile
└── Admin Group (College Admins)
    └── Dashboard
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Expo CLI
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env` file contains Supabase connection details.

3. Set up the database:
- Open Supabase Dashboard
- Navigate to SQL Editor
- Run the SQL script from `scripts/setup-database.sql`

4. Start the development server:
```bash
npm run dev
```

5. Build for web:
```bash
npm run build:web
```

### Creating Test Accounts

**Student Account:**
1. Open the app
2. Click "Sign Up"
3. Enter details and select "Student" role
4. Sign up and login

**Admin Account:**
1. Sign up with "College Admin" role
2. After signup, go to Supabase Dashboard
3. Navigate to Table Editor > profiles
4. Update your user's `college_id` to match one of the sample colleges

## Design Features

### User Interface
- Clean, modern design with consistent color scheme
- Blue accent color (#2563eb) for primary actions
- Professional typography hierarchy
- Intuitive navigation with tab bar
- Responsive layouts for different screen sizes

### User Experience
- Pull-to-refresh on college listings
- Real-time data updates
- Loading states and error handling
- Smooth transitions and animations
- Search functionality with instant results

## Security Considerations

1. **Authentication**
   - Secure email/password authentication
   - JWT-based session management
   - Automatic session refresh

2. **Authorization**
   - Role-based access control
   - Database-level security with RLS
   - Protected routes based on user role

3. **Data Protection**
   - Input validation on forms
   - Secure API communication
   - No sensitive data in client code

## Future Enhancements

Potential features for future development:
- Push notifications for admission updates
- Application tracking system
- Document upload for admissions
- Comparison tool for multiple colleges
- Reviews and ratings system
- Scholarship information
- Admission calendar and deadlines
- Virtual campus tours
- Chat support with college admins

## Support

For technical support or questions about the application:
- Review the DATABASE_SETUP.md file for database configuration
- Check the Expo documentation for framework-specific questions
- Refer to Supabase documentation for database and auth queries

## License

This project is intended for educational and demonstration purposes.
