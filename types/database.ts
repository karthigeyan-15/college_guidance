export interface College {
  id: string;
  name: string;
  location: string;
  established_year: number;
  nirf_ranking: number | null;
  total_fees: number;
  description: string;
  infrastructure_details: string;
  has_hostel: boolean;
  has_ac_hostel: boolean;
  has_non_ac_hostel: boolean;
  hostel_fees_ac: number | null;
  hostel_fees_non_ac: number | null;
  last_year_cutoff: number;
  website_url: string | null;
  contact_email: string;
  contact_phone: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  college_id: string;
  name: string;
  duration_years: number;
  total_seats: number;
  fees_per_year: number;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'college_admin';
  college_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CollegeWithCourses extends College {
  courses: Course[];
}
