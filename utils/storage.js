import AsyncStorage from '@react-native-async-storage/async-storage';
const ITEMS_KEY = '@inventory_items';
const HISTORY_KEY = '@inventory_history';

export const loadItems = async () => {
  const json = await AsyncStorage.getItem(ITEMS_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveItems = async items => {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
};

export const addHistory = async record => {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  const history = json ? JSON.parse(json) : [];
  history.unshift(record);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const loadHistory = async () => {
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  return json ? JSON.parse(json) : [];
};