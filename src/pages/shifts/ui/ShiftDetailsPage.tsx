import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { useSelectedShift } from '~/entities/shift';
import { useTheme } from '~/entities/theme';

const ShiftDetailsPage = observer(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { selectedShift } = useSelectedShift();

  const handleApplyPress = useCallback(() => {
    Alert.alert(
      'Apply for Shift',
      `Would you like to apply for this ${selectedShift?.workTypes} position at ${selectedShift?.companyName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Apply',
          onPress: () => {
            Alert.alert('Success', 'Your application has been submitted!');
          },
        },
      ]
    );
  }, [selectedShift]);

  // Removed unused handleBackPress as navigation back is handled by header

  if (!selectedShift) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Shift details not found
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const shift = selectedShift;
  const isFullyBooked = shift.currentWorkers >= shift.planWorkers;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.headerContent}>
            {shift.logo ? (
              <Image
                source={{ uri: shift.logo }}
                style={styles.companyLogo}
                accessibilityLabel={`${shift.companyName} logo`}
              />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.logoText, { color: colors.textSecondary }]}>
                  {shift.companyName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.headerInfo}>
              <Text style={[styles.companyName, { color: colors.text }]}>
                {shift.companyName}
              </Text>
              <Text style={[styles.workType, { color: colors.primary }]}>
                {shift.workTypes}
              </Text>
              <Text style={[styles.price, { color: colors.success }]}>
                {shift.priceWorker}₽ per shift
              </Text>
            </View>
          </View>

          {shift.customerRating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.ratingContent}>
                <Text style={[styles.ratingText, { color: colors.warning }]}>
                  ⭐ {shift.customerRating.toFixed(1)}
                </Text>
                <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                  Based on {shift.customerFeedbacksCount} reviews
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Time & Location Section */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Schedule & Location
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              📅 Date:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {shift.dateStartByCity}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              🕐 Time:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {shift.timeStartByCity} - {shift.timeEndByCity}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              📍 Location:
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {shift.address}
            </Text>
          </View>
        </View>

        {/* Workers Section */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Team Information
          </Text>

          <View style={styles.workersRow}>
            <View style={styles.workersStat}>
              <Text style={[styles.workersNumber, { color: colors.primary }]}>
                {shift.currentWorkers}
              </Text>
              <Text style={[styles.workersLabel, { color: colors.textSecondary }]}>
                Current Workers
              </Text>
            </View>

            <View style={styles.workersSeperator}>
              <Text style={[styles.seperatorText, { color: colors.textSecondary }]}>
                /
              </Text>
            </View>

            <View style={styles.workersStat}>
              <Text style={[styles.workersNumber, { color: colors.success }]}>
                {shift.planWorkers}
              </Text>
              <Text style={[styles.workersLabel, { color: colors.textSecondary }]}>
                Needed
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: isFullyBooked ? colors.warning : colors.success,
                    width: `${Math.min((shift.currentWorkers / shift.planWorkers) * 100, 100)}%`
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {isFullyBooked ? 'Fully booked' : `${shift.planWorkers - shift.currentWorkers} spots remaining`}
            </Text>
          </View>
        </View>

        {/* Company Rating Section */}
        {shift.customerFeedbacksCount > 0 && (
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Company Reviews
            </Text>

            <View style={styles.ratingDetailsContainer}>
              <View style={styles.ratingStars}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.star,
                      { color: index < Math.floor(shift.customerRating) ? colors.warning : colors.border }
                    ]}
                  >
                    ⭐
                  </Text>
                ))}
              </View>
              <Text style={[styles.ratingScore, { color: colors.text }]}>
                {shift.customerRating.toFixed(1)} out of 5
              </Text>
              <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
                ({shift.customerFeedbacksCount} total reviews)
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Apply Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.applyButton,
            {
              backgroundColor: isFullyBooked ? colors.textSecondary : colors.primary,
            },
            isFullyBooked && styles.disabledButton
          ]}
          onPress={handleApplyPress}
          disabled={isFullyBooked}
          accessibilityRole="button"
          accessibilityLabel={isFullyBooked ? 'Shift is fully booked' : 'Apply for this shift'}
        >
          <Text style={[styles.applyButtonText, { color: colors.background }]}>
            {isFullyBooked ? 'Fully Booked' : 'Apply for Shift'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for footer button
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workType: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  workersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  workersStat: {
    alignItems: 'center',
    flex: 1,
  },
  workersSeperator: {
    paddingHorizontal: 20,
  },
  seperatorText: {
    fontSize: 24,
    fontWeight: '300',
  },
  workersNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workersLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  ratingDetailsContainer: {
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  ratingScore: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ShiftDetailsPage;