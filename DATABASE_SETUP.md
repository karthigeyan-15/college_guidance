# Database Setup Instructions

This document provides instructions for setting up the database for the College Guidance mobile application.

## Prerequisites

- Supabase account and project
- Database connection details in `.env` file

## Setup Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `scripts/setup-database.sql`
4. Paste and execute the SQL script in the SQL Editor
5. Verify that the tables and sample data have been created

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Database Schema

The application uses three main tables:

### 1. profiles
- Stores user profile information
- Links users to their roles (student or college_admin)
- Links college admins to their respective colleges

### 2. colleges
- Stores comprehensive college information
- Includes fees, infrastructure, NIRF ranking, cutoff marks
- Hostel facility details

### 3. courses
- Stores courses offered by each college
- Linked to colleges via college_id
- Includes duration, seats, and fees information

## Sample Data

The setup script includes sample data for two colleges:

1. **Mumbai Institute of Technology**
   - Engineering college in Mumbai
   - NIRF Rank: 45
   - 4 courses available
   - Both AC and Non-AC hostel facilities

2. **Pune Science and Arts College**
   - Science and Arts college in Pune
   - NIRF Rank: 78
   - 5 courses available
   - Non-AC hostel facility only

## Creating Test Accounts

After setting up the database, create test accounts:

### Student Account
1. Sign up with role: "Student"
2. Use any email and password

### College Admin Account
1. Sign up with role: "College Admin"
2. After signup, update the profile in Supabase Dashboard:
   - Navigate to Table Editor > profiles
   - Find your admin user
   - Set the `college_id` to one of the sample colleges

## Row Level Security (RLS)

The database uses RLS policies to ensure data security:

- Students can view all colleges and courses
- College admins can only modify their own college data
- Users can only view and update their own profiles

## Verification

To verify the setup:

1. Check that all tables exist in the Supabase Dashboard
2. Verify sample data is present in the colleges and courses tables
3. Test user signup and authentication
4. Ensure RLS policies are enabled on all tables
