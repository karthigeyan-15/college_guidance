import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { College, Course } from '@/types/database';
import { Building2, BookOpen, LogOut, Plus, Edit2, Trash2 } from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const { profile, signOut } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('3');
  const [courseSeats, setCourseSeats] = useState('');
  const [courseFees, setCourseFees] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.college_id) {
      fetchCollegeData();
    }
  }, [profile]);

  const fetchCollegeData = async () => {
    if (!profile?.college_id) return;

    try {
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', profile.college_id)
        .maybeSingle();

      if (collegeError) throw collegeError;
      setCollege(collegeData);

      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', profile.college_id)
        .order('name');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching college data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!college || !courseName || !courseSeats || !courseFees) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('courses').insert({
        college_id: college.id,
        name: courseName,
        duration_years: parseInt(courseDuration),
        total_seats: parseInt(courseSeats),
        fees_per_year: parseFloat(courseFees) * 100000,
        description: courseDescription || null,
      });

      if (error) throw error;

      Alert.alert('Success', 'Course added successfully');
      setCourseName('');
      setCourseDuration('3');
      setCourseSeats('');
      setCourseFees('');
      setCourseDescription('');
      setShowAddCourse(false);
      fetchCollegeData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add course');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${courseName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseId);

              if (error) throw error;
              fetchCollegeData();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <LogOut size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Building2 size={64} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No College Assigned</Text>
          <Text style={styles.emptyText}>
            Your account is not linked to any college yet.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>{profile?.full_name}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <LogOut size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.collegeCard}>
          <View style={styles.collegeHeader}>
            <Building2 size={32} color="#2563eb" />
            <View style={styles.collegeInfo}>
              <Text style={styles.collegeName}>{college.name}</Text>
              <Text style={styles.collegeLocation}>{college.location}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{courses.length}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {college.nirf_ranking ? `#${college.nirf_ranking}` : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>NIRF Rank</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{college.last_year_cutoff}%</Text>
              <Text style={styles.statLabel}>Cutoff</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Courses</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddCourse(!showAddCourse)}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Course</Text>
            </TouchableOpacity>
          </View>

          {showAddCourse && (
            <View style={styles.addCourseForm}>
              <Text style={styles.formTitle}>Add New Course</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Course Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bachelor of Engineering"
                  value={courseName}
                  onChangeText={setCourseName}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Duration (years) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    value={courseDuration}
                    onChangeText={setCourseDuration}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Total Seats *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="60"
                    value={courseSeats}
                    onChangeText={setCourseSeats}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fees per Year (in Lakhs) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1.5"
                  value={courseFees}
                  onChangeText={setCourseFees}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Course description (optional)"
                  value={courseDescription}
                  onChangeText={setCourseDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddCourse(false)}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleAddCourse}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Add Course</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {courses.length === 0 ? (
            <View style={styles.emptyCoursesContainer}>
              <BookOpen size={48} color="#cbd5e1" />
              <Text style={styles.emptyCoursesText}>No courses added yet</Text>
            </View>
          ) : (
            courses.map((course) => (
              <View key={course.id} style={styles.courseItem}>
                <View style={styles.courseContent}>
                  <Text style={styles.courseItemName}>{course.name}</Text>
                  <View style={styles.courseItemDetails}>
                    <Text style={styles.courseItemDetail}>
                      {course.duration_years} years
                    </Text>
                    <Text style={styles.courseItemDetail}>•</Text>
                    <Text style={styles.courseItemDetail}>
                      {course.total_seats} seats
                    </Text>
                    <Text style={styles.courseItemDetail}>•</Text>
                    <Text style={styles.courseItemDetail}>
                      ₹{(course.fees_per_year / 100000).toFixed(2)}L/year
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCourse(course.id, course.name)}
                >
                  <Trash2 size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>
            ))
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  collegeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  collegeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  collegeLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addCourseForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyCoursesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyCoursesText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  courseContent: {
    flex: 1,
  },
  courseItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  courseItemDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  courseItemDetail: {
    fontSize: 13,
    color: '#64748b',
  },
  deleteButton: {
    padding: 8,
  },
});
