import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '~/entities/theme';

interface ThemeSwitcherProps {
  style?: any;
  textStyle?: any;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ style, textStyle }) => {
  const { theme, toggleTheme, colors, spacing, typography } = useTheme();

  const styles = createStyles(colors, spacing, typography);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={toggleTheme}
    >
      <Text style={[styles.buttonText, textStyle]}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any, spacing: any, typography: any) => StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});