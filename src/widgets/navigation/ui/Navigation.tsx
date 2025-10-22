import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '~/entities/theme';
import { RootStackParamList } from '~/shared/lib/types';

// Import pages
import { HomePage } from '~/pages/home';
import { DetailsPage } from '~/pages/details';
import { ShiftListPage, ShiftDetailsPage } from '~/pages/shifts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ShiftList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            title: 'Hands Free',
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsPage}
          options={{
            title: 'Item Details',
          }}
        />
        <Stack.Screen
          name="ShiftList"
          component={ShiftListPage}
          options={{
            title: 'Available Shifts',
          }}
        />
        <Stack.Screen
          name="ShiftDetails"
          component={ShiftDetailsPage}
          options={{
            title: 'Shift Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};