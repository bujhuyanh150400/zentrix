import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (_) {
            return null;
        }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (_) {
        }
    },
    async  removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (_) {
        }
    }
}

export default storage;