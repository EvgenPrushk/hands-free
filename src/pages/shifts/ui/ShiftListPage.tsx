import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { useShifts, Shift } from '~/entities/shift';
import { useGeolocation } from '~/entities/geolocation';
import { useTheme } from '~/entities/theme';

const ShiftListPage = observer(() => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { location, isLoading: isLocationLoading, error: locationError, hasPermission, retry: retryLocation } = useGeolocation();
  const {
    shifts,
    isLoading,
    error,
    hasShifts,
    loadShifts,
    selectShift,
  } = useShifts();

  const handleShiftPress = useCallback((shift: Shift) => {
    selectShift(shift);
    navigation.navigate('ShiftDetails' as never);
  }, [selectShift, navigation]);

  // Auto-load shifts when location becomes available
  React.useEffect(() => {
    if (location && hasPermission) {
      loadShifts({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location, hasPermission, loadShifts]);

  const handleRefresh = useCallback(async () => {
    if (location) {
      await loadShifts({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      await retryLocation();
    }
  }, [location, loadShifts, retryLocation]);

  const handleRetryLocation = useCallback(() => {
    retryLocation();
  }, [retryLocation]);

  const renderShiftItem = useCallback(({ item }: { item: Shift }) => (
    <ShiftCard
      shift={item}
      onPress={() => handleShiftPress(item)}
      colors={colors}
    />
  ), [handleShiftPress, colors]);

  const keyExtractor = useCallback((item: Shift) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 120, // Estimated height of each item
      offset: 120 * index,
      index,
    }),
    []
  );

  // Memoized empty component
  const EmptyComponent = useMemo(() => {
    if (isLoading || isLocationLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {isLocationLoading ? 'Getting your location...' : 'Loading shifts...'}
          </Text>
        </View>
      );
    }

    if (locationError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {locationError.message}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={handleRetryLocation}
          >
            <Text style={[styles.retryButtonText, { color: colors.background }]}>
              Retry Location
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={handleRefresh}
          >
            <Text style={[styles.retryButtonText, { color: colors.background }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!hasPermission && !isLocationLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.promptText, { color: colors.text }]}>
            Location access is required to find work shifts near you.
          </Text>
          <TouchableOpacity
            style={[styles.locationButton, { backgroundColor: colors.primary }]}
            onPress={handleRetryLocation}
          >
            <Text style={[styles.locationButtonText, { color: colors.background }]}>
              Enable Location
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!hasShifts) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No shifts found in your area.
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Try refreshing or check back later.
          </Text>
        </View>
      );
    }

    return null;
  }, [
    isLoading,
    isLocationLoading,
    locationError,
    error,
    hasPermission,
    hasShifts,
    colors,
    handleRetryLocation,
    handleRefresh,
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={shifts}
        renderItem={renderShiftItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListEmptyComponent={EmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={shifts.length === 0 ? styles.emptyContainer : styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        updateCellsBatchingPeriod={100}
      />
    </View>
  );
});

const ShiftCard = React.memo<{
  shift: Shift;
  onPress: () => void;
  colors: any;
}>(({ shift, onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Shift at ${shift.companyName}, ${shift.address}`}
    >
      <View style={styles.cardHeader}>
        {shift.logo ? (
          <Image
            source={{ uri: shift.logo }}
            style={styles.logo}
          />
        ) : (
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]}>
            <Text style={[styles.logoText, { color: colors.textSecondary }]}>
              {shift.companyName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={[styles.companyName, { color: colors.text }]} numberOfLines={1}>
            {shift.companyName}
          </Text>
          <Text style={[styles.workType, { color: colors.textSecondary }]} numberOfLines={1}>
            {shift.workTypes}
          </Text>
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
            {shift.address}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.timeContainer}>
          <Text style={[styles.date, { color: colors.text }]}>
            {shift.dateStartByCity}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {shift.timeStartByCity} - {shift.timeEndByCity}
          </Text>
        </View>

        <View style={styles.rightInfo}>
          <Text style={[styles.price, { color: colors.success }]}>
            {shift.priceWorker}₽
          </Text>
          <Text style={[styles.workers, { color: colors.textSecondary }]}>
            {shift.currentWorkers}/{shift.planWorkers} workers
          </Text>
        </View>
      </View>

      {shift.customerRating > 0 && (
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { color: colors.warning }]}>
            ⭐ {shift.customerRating.toFixed(1)}
          </Text>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            ({shift.customerFeedbacksCount} reviews)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workType: {
    fontSize: 14,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeContainer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  workers: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShiftListPage;