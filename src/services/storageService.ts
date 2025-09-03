import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 本地存储服务
 * 封装AsyncStorage，提供类型安全的存储操作
 */
class StorageService {
  /**
   * 存储数据
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取数据
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * 删除数据
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * 清除所有数据
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  /**
   * 获取所有键名
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * 批量获取数据
   */
  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Failed to multi get:', error);
      return [];
    }
  }

  /**
   * 批量设置数据
   */
  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Failed to multi set:', error);
      throw error;
    }
  }

  /**
   * 批量删除数据
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to multi remove:', error);
      throw error;
    }
  }

  /**
   * 存储对象数据
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to set object ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取对象数据
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to get object ${key}:`, error);
      return null;
    }
  }

  /**
   * 存储数组数据
   */
  async setArray<T>(key: string, value: T[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to set array ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取数组数据
   */
  async getArray<T>(key: string): Promise<T[]> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error(`Failed to get array ${key}:`, error);
      return [];
    }
  }

  /**
   * 存储布尔值
   */
  async setBoolean(key: string, value: boolean): Promise<void> {
    try {
      await this.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to set boolean ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取布尔值
   */
  async getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value ? value === 'true' : defaultValue;
    } catch (error) {
      console.error(`Failed to get boolean ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * 存储数字
   */
  async setNumber(key: string, value: number): Promise<void> {
    try {
      await this.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to set number ${key}:`, error);
      throw error;
    }
  }

  /**
   * 获取数字
   */
  async getNumber(key: string, defaultValue: number = 0): Promise<number> {
    try {
      const value = await this.getItem(key);
      return value ? parseFloat(value) : defaultValue;
    } catch (error) {
      console.error(`Failed to get number ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * 检查键是否存在
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Failed to check key ${key}:`, error);
      return false;
    }
  }

  /**
   * 获取存储大小（字节）
   */
  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      const items = await this.multiGet(keys);
      
      let totalSize = 0;
      items.forEach(([key, value]) => {
        if (value) {
          totalSize += key.length + value.length;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }

  /**
   * 清理过期数据
   */
  async cleanupExpiredData(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const expiredKeys: string[] = [];
      
      for (const key of keys) {
        if (key.startsWith('cache_') || key.startsWith('temp_')) {
          // 可以在这里添加过期检查逻辑
          const value = await this.getItem(key);
          if (value) {
            try {
              const data = JSON.parse(value);
              if (data.expireAt && new Date(data.expireAt) < new Date()) {
                expiredKeys.push(key);
              }
            } catch (error) {
              // 如果解析失败，可能是旧格式数据，也可以考虑清理
            }
          }
        }
      }
      
      if (expiredKeys.length > 0) {
        await this.multiRemove(expiredKeys);
        console.log(`Cleaned up ${expiredKeys.length} expired items`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired data:', error);
    }
  }

  /**
   * 导出所有数据（用于备份）
   */
  async exportData(): Promise<Record<string, string | null>> {
    try {
      const keys = await this.getAllKeys();
      const items = await this.multiGet(keys);
      
      const data: Record<string, string | null> = {};
      items.forEach(([key, value]) => {
        data[key] = value;
      });
      
      return data;
    } catch (error) {
      console.error('Failed to export data:', error);
      return {};
    }
  }

  /**
   * 导入数据（用于恢复）
   */
  async importData(data: Record<string, string>): Promise<void> {
    try {
      const keyValuePairs: Array<[string, string]> = Object.entries(data);
      await this.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  /**
   * 获取缓存数据（带过期时间）
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const value = await this.getItem(key);
      if (!value) return null;
      
      const data = JSON.parse(value);
      
      // 检查是否过期
      if (data.expireAt && new Date(data.expireAt) < new Date()) {
        await this.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error(`Failed to get cached data ${key}:`, error);
      return null;
    }
  }

  /**
   * 设置缓存数据（带过期时间）
   */
  async setCachedData<T>(
    key: string, 
    value: T, 
    expirationMinutes: number = 60
  ): Promise<void> {
    try {
      const expireAt = new Date();
      expireAt.setMinutes(expireAt.getMinutes() + expirationMinutes);
      
      const cacheData = {
        value,
        expireAt: expireAt.toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      await this.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error(`Failed to set cached data ${key}:`, error);
      throw error;
    }
  }
}

// 创建单例实例
export const storageService = new StorageService();

// 导出类型
export type StorageServiceType = typeof storageService;

export default storageService;


