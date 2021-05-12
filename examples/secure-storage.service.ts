import SInfo, { RNSensitiveInfoOptions } from "react-native-sensitive-info";
import { StorageServiceKeyId } from "./async-storage.service";

type RefreshToken = string & { readonly brand: unique symbol };

export enum StorageKeys {
  REFRESH_TOKEN = "REFRESH_TOKEN",
  ACCESS_CREATED_AT = "ACCESS_CREATED_AT",
  APP_LANGUAGE = "APP_LANGUAGE",
}

class SecurityStorage {
  private _secureStorageKey: StorageServiceKeyId | undefined;

  set secureStorageKey(accessKey: StorageServiceKeyId | undefined) {
    this._secureStorageKey = accessKey;
  }

  get secureStorageKey() {
    return this._secureStorageKey;
  }

  async saveStorage({ token }: { token: RefreshToken }) {
    const options = {
      keychainService: this.secureStorageKey,
      sharedPreferencesName: this.secureStorageKey,
    };
    await this.setItem(StorageKeys.REFRESH_TOKEN, token, options);
  }

  async setItem(
    key: string,
    value: string,
    options: RNSensitiveInfoOptions
  ): Promise<void> {
    await SInfo.setItem(key, value, options);
  }

  async getItem(key: string, options: RNSensitiveInfoOptions): Promise<string> {
    const item = await SInfo.getItem(key, options);

    return item;
  }

  async deleteItem(
    key: string,
    options: RNSensitiveInfoOptions
  ): Promise<void> {
    await SInfo.deleteItem(key, options);
  }

  async clearStorage(options: RNSensitiveInfoOptions) {
    await SInfo.deleteItem(StorageKeys.ACCESS_CREATED_AT, options);
    await SInfo.deleteItem(StorageKeys.REFRESH_TOKEN, options);
  }
}

export const securityStorageService = new SecurityStorage();
