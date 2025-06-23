import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const setKey = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`✅ Key saved: ${key}`);
  } catch (error) {
    console.error(`Error saving key ${key}:`, error);
    throw new Error(`Failed to save key: ${key}`);
  }
};

export const getKey = async (key: string): Promise<string> => {
  const value = await AsyncStorage.getItem(key);

  if (value === null) {
    throw new Error(`${key} not found, please setup this key in settings menu.`);
  }

  return value;
};

export const keyExists = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking key ${key}:`, error);
    return false;
  }
};

export const removeKey = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`🗑️ Key removed: ${key}`);
  } catch (error) {
    console.error(`Error removing key ${key}:`, error);
    throw new Error(`Failed to remove key: ${key}`);
  }
};
