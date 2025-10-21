import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/Navigation';


type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export const DetailsScreen: React.FC<Props> = ({ route, navigation }) => (
  <View style={styles.container}>
    <Text>Details Screen</Text>
    <Text>Item ID: {route.params.itemId}</Text>
    <Button title="Go Back" onPress={() => navigation.goBack()} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
