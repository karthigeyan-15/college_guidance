-- College Guidance App - Sample Data Setup
-- This script populates the database with sample data for two colleges

-- First, create the tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'college_admin')),
  college_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  location text NOT NULL,
  established_year integer NOT NULL,
  nirf_ranking integer,
  total_fees numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  infrastructure_details text NOT NULL DEFAULT '',
  has_hostel boolean DEFAULT false,
  has_ac_hostel boolean DEFAULT false,
  has_non_ac_hostel boolean DEFAULT false,
  hostel_fees_ac numeric,
  hostel_fees_non_ac numeric,
  last_year_cutoff numeric NOT NULL DEFAULT 0,
  website_url text,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_years integer NOT NULL DEFAULT 3,
  total_seats integer NOT NULL DEFAULT 0,
  fees_per_year numeric NOT NULL DEFAULT 0,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view colleges" ON colleges;
DROP POLICY IF EXISTS "College admins can update their college" ON colleges;
DROP POLICY IF EXISTS "College admins can insert colleges" ON colleges;
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "College admins can manage their college courses" ON courses;
DROP POLICY IF EXISTS "College admins can update their college courses" ON courses;
DROP POLICY IF EXISTS "College admins can delete their college courses" ON courses;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Colleges policies
CREATE POLICY "Anyone can view colleges"
  ON colleges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "College admins can update their college"
  ON colleges FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = colleges.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = colleges.id
    )
  );

CREATE POLICY "College admins can insert colleges"
  ON colleges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
    )
  );

-- Courses policies
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "College admins can manage their college courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = courses.college_id
    )
  );

CREATE POLICY "College admins can update their college courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = courses.college_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = courses.college_id
    )
  );

CREATE POLICY "College admins can delete their college courses"
  ON courses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'college_admin'
      AND profiles.college_id = courses.college_id
    )
  );

-- Insert Sample College 1: Mumbai Institute of Technology
INSERT INTO colleges (
  name,
  location,
  established_year,
  nirf_ranking,
  total_fees,
  description,
  infrastructure_details,
  has_hostel,
  has_ac_hostel,
  has_non_ac_hostel,
  hostel_fees_ac,
  hostel_fees_non_ac,
  last_year_cutoff,
  website_url,
  contact_email,
  contact_phone,
  image_url
) VALUES (
  'Mumbai Institute of Technology',
  'Mumbai, Maharashtra',
  1995,
  45,
  450000,
  'Mumbai Institute of Technology (MIT) is a premier engineering institution located in the heart of Mumbai. Established in 1995, MIT has been consistently ranked among the top engineering colleges in India. We offer state-of-the-art facilities, experienced faculty, and excellent placement opportunities.',
  'Our campus spans 25 acres with modern infrastructure including well-equipped laboratories, a central library with over 50,000 books, high-speed internet connectivity, sports complex with indoor and outdoor facilities, cafeteria, medical center, and spacious classrooms with audio-visual aids.',
  true,
  true,
  true,
  120000,
  80000,
  85.5,
  'https://www.mitindia.edu',
  'admissions@mitindia.edu',
  '+91-22-1234-5678',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg'
) ON CONFLICT (name) DO NOTHING;

-- Get the college ID for MIT
DO $$
DECLARE
  mit_id uuid;
BEGIN
  SELECT id INTO mit_id FROM colleges WHERE name = 'Mumbai Institute of Technology';

  -- Insert courses for MIT
  INSERT INTO courses (college_id, name, duration_years, total_seats, fees_per_year, description) VALUES
  (mit_id, 'Bachelor of Engineering in Computer Science', 4, 120, 150000, 'A comprehensive program covering software development, algorithms, data structures, artificial intelligence, and machine learning.'),
  (mit_id, 'Bachelor of Engineering in Electronics and Communication', 4, 90, 140000, 'Focuses on electronic circuits, communication systems, signal processing, and embedded systems.'),
  (mit_id, 'Bachelor of Engineering in Mechanical Engineering', 4, 60, 135000, 'Covers thermodynamics, fluid mechanics, manufacturing processes, and design engineering.'),
  (mit_id, 'Bachelor of Engineering in Civil Engineering', 4, 60, 130000, 'Includes structural engineering, transportation engineering, environmental engineering, and construction management.')
  ON CONFLICT DO NOTHING;
END $$;

-- Insert Sample College 2: Pune Science and Arts College
INSERT INTO colleges (
  name,
  location,
  established_year,
  nirf_ranking,
  total_fees,
  description,
  infrastructure_details,
  has_hostel,
  has_ac_hostel,
  has_non_ac_hostel,
  hostel_fees_ac,
  hostel_fees_non_ac,
  last_year_cutoff,
  website_url,
  contact_email,
  contact_phone,
  image_url
) VALUES (
  'Pune Science and Arts College',
  'Pune, Maharashtra',
  1985,
  78,
  280000,
  'Pune Science and Arts College (PSAC) is a distinguished institution offering quality education in science and arts streams. With over 35 years of academic excellence, PSAC has produced numerous scholars and professionals who excel in their respective fields.',
  'The college features modern science laboratories, computer centers with latest technology, a well-stocked library, seminar halls, art studios, music rooms, and green campus with botanical gardens. The infrastructure supports both academic and extracurricular development.',
  true,
  false,
  true,
  null,
  60000,
  78.0,
  'https://www.psacpune.edu',
  'info@psacpune.edu',
  '+91-20-9876-5432',
  'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
) ON CONFLICT (name) DO NOTHING;

-- Get the college ID for PSAC
DO $$
DECLARE
  psac_id uuid;
BEGIN
  SELECT id INTO psac_id FROM colleges WHERE name = 'Pune Science and Arts College';

  -- Insert courses for PSAC
  INSERT INTO courses (college_id, name, duration_years, total_seats, fees_per_year, description) VALUES
  (psac_id, 'Bachelor of Science in Physics', 3, 60, 80000, 'Comprehensive physics program covering classical mechanics, quantum physics, electronics, and research methodology.'),
  (psac_id, 'Bachelor of Science in Chemistry', 3, 60, 85000, 'In-depth study of organic, inorganic, physical chemistry, and analytical techniques.'),
  (psac_id, 'Bachelor of Science in Mathematics', 3, 50, 75000, 'Advanced mathematics including calculus, algebra, statistics, and computational mathematics.'),
  (psac_id, 'Bachelor of Arts in English Literature', 3, 80, 60000, 'Study of classic and contemporary literature, critical analysis, and creative writing.'),
  (psac_id, 'Bachelor of Arts in History', 3, 70, 60000, 'Explores world history, Indian civilization, historiography, and research methods.')
  ON CONFLICT DO NOTHING;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON profiles(college_id);
CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges(name);
CREATE INDEX IF NOT EXISTS idx_colleges_nirf_ranking ON colleges(nirf_ranking);
CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
