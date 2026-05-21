import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class NativeStorageService {
  async setString(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async getString(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await this.setString(key, JSON.stringify(value));
  }

  async getObject<T>(key: string): Promise<T | null> {
    const value = await this.getString(key);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      await this.remove(key);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async removeByPrefix(prefix: string): Promise<void> {
    const { keys } = await Preferences.keys();
    await Promise.all(keys.filter((key) => key.startsWith(prefix)).map((key) => this.remove(key)));
  }
}
