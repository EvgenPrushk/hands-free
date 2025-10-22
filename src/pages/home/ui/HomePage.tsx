import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/lib/types';
import { useAuth } from '~/features/auth';
import { useTheme } from '~/entities/theme';
import { ThemeSwitcher } from '~/features/theme-switcher';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomePage: React.FC<Props> = ({ navigation }) => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const { colors, spacing, typography } = useTheme();

  const handleLogin = async () => {
    try {
      await login('demo@example.com', 'password123');
      Alert.alert('Success', 'Logged in successfully!');
    } catch {
      Alert.alert('Error', 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch {
      Alert.alert('Error', 'Logout failed');
    }
  };

  const styles = createStyles(colors, spacing, typography);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Hands Free</Text>

      {isAuthenticated && user ? (
        <View style={styles.userSection}>
          <Text style={styles.welcomeText}>Hello, {user.name}!</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      ) : (
        <Text style={styles.guestText}>You are not logged in</Text>
      )}

      <View style={styles.buttonSection}>
        {isAuthenticated ? (
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Demo Login'}
            </Text>
          </TouchableOpacity>
        )}

        <ThemeSwitcher />

        <TouchableOpacity
          style={[styles.button, styles.navButton]}
          onPress={() => navigation.navigate('Details', { itemId: 42 })}
        >
          <Text style={styles.buttonText}>Go to Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any, spacing: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  userSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    minWidth: 200,
  },
  welcomeText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emailText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  guestText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttonSection: {
    gap: spacing.md,
    minWidth: 200,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
  navButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});