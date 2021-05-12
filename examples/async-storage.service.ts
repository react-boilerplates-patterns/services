import { default as RNAsyncStorage } from "@react-native-async-storage/async-storage";

export type StorageServiceKeyId = string & { readonly brand: unique symbol };

export function generateStorageKey(): string {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export function storageKeyId(id: string): StorageServiceKeyId {
  return id as StorageServiceKeyId;
}

// Write Sensetive Info Storage access key to Async Storage
class AsyncStorage {
  async addKeyToStorage(key: StorageServiceKeyId) {
    await RNAsyncStorage.setItem("storageServiceKey", key);
  }

  async getKeyFromStorage() {
    const storageKey = await RNAsyncStorage.getItem("storageServiceKey");
    return storageKey as StorageServiceKeyId;
  }
}

export const asyncStorageService = new AsyncStorage();
