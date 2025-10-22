import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/lib/types';
import { useTheme } from '~/entities/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export const DetailsPage: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { colors, spacing, typography } = useTheme();

  // Mock data for demonstration
  const isLoading = false;
  const error = null;
  const item = {
    id: itemId,
    title: `Item ${itemId}`,
    description: 'This is a detailed description of the item. In a real app, this would be fetched from an API using React Query.',
    category: 'Demo',
    price: 99.99,
    inStock: true,
  };

  const styles = createStyles(colors, spacing, typography);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading item details</Text>
        <TouchableOpacity
          style={[styles.button, styles.retryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item?.title}</Text>
          <View style={[styles.badge, item?.inStock ? styles.inStockBadge : styles.outOfStockBadge]}>
            <Text style={styles.badgeText}>
              {item?.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.label}>Item ID:</Text>
          <Text style={styles.value}>{item?.id}</Text>

          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{item?.category}</Text>

          <Text style={styles.label}>Price:</Text>
          <Text style={styles.priceValue}>${item?.price}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.descriptionValue}>{item?.description}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>← Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            // Handle action (e.g., add to cart, edit, etc.)
            console.log('Action pressed for item:', itemId);
          }}
        >
          <Text style={styles.buttonText}>Take Action</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any, spacing: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  inStockBadge: {
    backgroundColor: colors.success,
  },
  outOfStockBadge: {
    backgroundColor: colors.error,
  },
  badgeText: {
    color: 'white',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  priceValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  descriptionValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  backButton: {
    backgroundColor: colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  retryButton: {
    backgroundColor: colors.error,
    marginTop: spacing.md,
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
  },
});