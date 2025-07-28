import * as SecureStore from 'expo-secure-store';

const secureStorage = {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (_) {
            return null;
        }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await SecureStore.setItemAsync(key, jsonValue);
        } catch (_) {
        }
    },
    async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (_) {
        }
    },
};
export default secureStorage