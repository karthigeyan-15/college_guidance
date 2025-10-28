import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { College, Course } from '@/types/database';
import { MapPin, Award, IndianRupee, Building2, Bed, Calendar, ArrowLeft, Globe, Phone, Mail } from 'lucide-react-native';

export default function CollegeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (collegeError) throw collegeError;
      setCollege(collegeData);

      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', id)
        .order('name');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!college) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>College not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>College Details</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {college.image_url ? (
          <Image source={{ uri: college.image_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Building2 size={64} color="#94a3b8" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.collegeName}>{college.name}</Text>

          <View style={styles.quickInfo}>
            <View style={styles.infoItem}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.infoText}>{college.location}</Text>
            </View>
            {college.nirf_ranking && (
              <View style={styles.infoItem}>
                <Award size={16} color="#2563eb" />
                <Text style={[styles.infoText, styles.rankText]}>
                  NIRF Rank #{college.nirf_ranking}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.description}>{college.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <View style={styles.iconCircle}>
                  <Calendar size={20} color="#2563eb" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Established</Text>
                  <Text style={styles.infoCardValue}>{college.established_year}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoCardRow}>
                <View style={styles.iconCircle}>
                  <IndianRupee size={20} color="#059669" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Total Fees</Text>
                  <Text style={styles.infoCardValue}>
                    ₹{(college.total_fees / 100000).toFixed(2)} Lakhs
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoCardRow}>
                <View style={styles.iconCircle}>
                  <Award size={20} color="#f59e0b" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Last Year Cutoff</Text>
                  <Text style={styles.infoCardValue}>{college.last_year_cutoff}%</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Infrastructure</Text>
            <View style={styles.infrastructureCard}>
              <Text style={styles.infrastructureText}>
                {college.infrastructure_details}
              </Text>
            </View>
          </View>

          {college.has_hostel && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hostel Facilities</Text>
              <View style={styles.hostelCard}>
                <View style={styles.hostelRow}>
                  <Bed size={20} color="#2563eb" />
                  <Text style={styles.hostelTitle}>Available Facilities</Text>
                </View>
                {college.has_ac_hostel && (
                  <View style={styles.hostelItem}>
                    <Text style={styles.hostelLabel}>AC Hostel</Text>
                    <Text style={styles.hostelValue}>
                      ₹{((college.hostel_fees_ac || 0) / 100000).toFixed(2)}L per year
                    </Text>
                  </View>
                )}
                {college.has_non_ac_hostel && (
                  <View style={styles.hostelItem}>
                    <Text style={styles.hostelLabel}>Non-AC Hostel</Text>
                    <Text style={styles.hostelValue}>
                      ₹{((college.hostel_fees_non_ac || 0) / 100000).toFixed(2)}L per year
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {courses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Courses</Text>
              {courses.map((course) => (
                <View key={course.id} style={styles.courseCard}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <View style={styles.courseDetails}>
                    <View style={styles.courseDetail}>
                      <Text style={styles.courseLabel}>Duration</Text>
                      <Text style={styles.courseValue}>{course.duration_years} years</Text>
                    </View>
                    <View style={styles.courseDetail}>
                      <Text style={styles.courseLabel}>Seats</Text>
                      <Text style={styles.courseValue}>{course.total_seats}</Text>
                    </View>
                    <View style={styles.courseDetail}>
                      <Text style={styles.courseLabel}>Fees/Year</Text>
                      <Text style={styles.courseValue}>
                        ₹{(course.fees_per_year / 100000).toFixed(2)}L
                      </Text>
                    </View>
                  </View>
                  {course.description && (
                    <Text style={styles.courseDescription}>{course.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactCard}>
              {college.website_url && (
                <View style={styles.contactRow}>
                  <Globe size={18} color="#64748b" />
                  <Text style={styles.contactText}>{college.website_url}</Text>
                </View>
              )}
              <View style={styles.contactRow}>
                <Mail size={18} color="#64748b" />
                <Text style={styles.contactText}>{college.contact_email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Phone size={18} color="#64748b" />
                <Text style={styles.contactText}>{college.contact_phone}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  collegeName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
  },
  rankText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  infrastructureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infrastructureText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  hostelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hostelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  hostelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  hostelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  hostelLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  hostelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseDetail: {
    flex: 1,
  },
  courseLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  courseValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  courseDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#475569',
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
  },
});
