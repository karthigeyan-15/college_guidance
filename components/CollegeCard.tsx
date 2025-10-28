import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { College } from '@/types/database';
import { MapPin, Award, IndianRupee } from 'lucide-react-native';

interface CollegeCardProps {
  college: College;
  onPress: () => void;
}

export function CollegeCard({ college, onPress }: CollegeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {college.image_url ? (
        <Image source={{ uri: college.image_url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Award size={32} color="#94a3b8" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{college.name}</Text>

        <View style={styles.infoRow}>
          <MapPin size={14} color="#64748b" />
          <Text style={styles.location}>{college.location}</Text>
        </View>

        <View style={styles.stats}>
          {college.nirf_ranking && (
            <View style={styles.stat}>
              <Award size={14} color="#2563eb" />
              <Text style={styles.statText}>NIRF #{college.nirf_ranking}</Text>
            </View>
          )}

          <View style={styles.stat}>
            <IndianRupee size={14} color="#059669" />
            <Text style={styles.statText}>
              {(college.total_fees / 100000).toFixed(1)}L
            </Text>
          </View>
        </View>

        <View style={styles.cutoffContainer}>
          <Text style={styles.cutoffLabel}>Last Year Cutoff:</Text>
          <Text style={styles.cutoffValue}>{college.last_year_cutoff}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#64748b',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  cutoffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
  },
  cutoffLabel: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  cutoffValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
});
