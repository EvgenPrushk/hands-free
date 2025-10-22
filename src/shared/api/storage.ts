import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../lib/types';

/**
 * Type-safe AsyncStorage wrapper with error handling
 */
class StorageService {
  /**
   * Store data in AsyncStorage
   */
  async setItem<T>(key: StorageKey, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw new Error(`Failed to store data: ${error}`);
    }
  }

  /**
   * Retrieve data from AsyncStorage
   */
  async getItem<T>(key: StorageKey): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async removeItem(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw new Error(`Failed to remove data: ${error}`);
    }
  }

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw new Error(`Failed to clear storage: ${error}`);
    }
  }

  /**
   * Get multiple items at once
   */
  async multiGet(keys: StorageKey[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      values.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });

      return result;
    } catch (error) {
      console.error('Error getting multiple items:', error);
      return {};
    }
  }

  /**
   * Set multiple items at once
   */
  async multiSet(keyValuePairs: [StorageKey, any][]): Promise<void> {
    try {
      const stringifiedPairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(stringifiedPairs);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw new Error(`Failed to set multiple items: ${error}`);
    }
  }

  /**
   * Check if key exists
   */
  async hasItem(key: StorageKey): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }
}

export const storage = new StorageService();