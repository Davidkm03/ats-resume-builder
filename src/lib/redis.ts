import { Redis } from '@upstash/redis';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Redis connection test
export async function testRedisConnection() {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('Redis configuration missing, using fallback in-memory storage');
      return false;
    }

    await redis.ping();
    console.log('✓ Redis connection successful');
    return true;
  } catch (error) {
    console.warn('✗ Redis connection failed, using fallback storage:', error);
    return false;
  }
}

// Fallback in-memory storage for development
class InMemoryStorage {
  private storage: Map<string, any> = new Map();

  async get(key: string) {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: any, options?: { ex?: number }) {
    this.storage.set(key, value);
    if (options?.ex) {
      setTimeout(() => this.storage.delete(key), options.ex * 1000);
    }
    return 'OK';
  }

  async hgetall(key: string) {
    return this.storage.get(key) || {};
  }

  async hset(key: string, field: string, value: any) {
    const hash = this.storage.get(key) || {};
    hash[field] = value;
    this.storage.set(key, hash);
    return 1;
  }

  async hincrby(key: string, field: string, increment: number) {
    const hash = this.storage.get(key) || {};
    hash[field] = (parseInt(hash[field] || '0') + increment).toString();
    this.storage.set(key, hash);
    return parseInt(hash[field]);
  }

  async hincrbyfloat(key: string, field: string, increment: number) {
    const hash = this.storage.get(key) || {};
    hash[field] = (parseFloat(hash[field] || '0') + increment).toString();
    this.storage.set(key, hash);
    return parseFloat(hash[field]);
  }

  async lpush(key: string, value: string) {
    const list = this.storage.get(key) || [];
    list.unshift(value);
    this.storage.set(key, list);
    return list.length;
  }

  async lrange(key: string, start: number, stop: number) {
    const list = this.storage.get(key) || [];
    if (stop === -1) return list.slice(start);
    return list.slice(start, stop + 1);
  }

  async ltrim(key: string, start: number, stop: number) {
    const list = this.storage.get(key) || [];
    const trimmed = list.slice(start, stop + 1);
    this.storage.set(key, trimmed);
    return 'OK';
  }

  async del(key: string) {
    return this.storage.delete(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number) {
    setTimeout(() => this.storage.delete(key), seconds * 1000);
    return 1;
  }

  pipeline() {
    const commands: Array<() => Promise<any>> = [];
    return {
      hincrby: (key: string, field: string, increment: number) => {
        commands.push(() => this.hincrby(key, field, increment));
        return this;
      },
      hincrbyfloat: (key: string, field: string, increment: number) => {
        commands.push(() => this.hincrbyfloat(key, field, increment));
        return this;
      },
      lpush: (key: string, value: string) => {
        commands.push(() => this.lpush(key, value));
        return this;
      },
      ltrim: (key: string, start: number, stop: number) => {
        commands.push(() => this.ltrim(key, start, stop));
        return this;
      },
      expire: (key: string, seconds: number) => {
        commands.push(() => this.expire(key, seconds));
        return this;
      },
      del: (key: string) => {
        commands.push(() => this.del(key));
        return this;
      },
      exec: async () => {
        const results = [];
        for (const command of commands) {
          try {
            const result = await command();
            results.push([null, result]);
          } catch (error) {
            results.push([error, null]);
          }
        }
        return results;
      },
    };
  }
}

// Create fallback storage instance
const fallbackStorage = new InMemoryStorage();

// Enhanced Redis client with fallback
export const enhancedRedis = {
  async get(key: string) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.get(key);
      }
      return await fallbackStorage.get(key);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.get(key);
    }
  },

  async set(key: string, value: any, options?: { ex?: number }) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        if (options?.ex) {
          return await redis.set(key, value, { ex: options.ex });
        }
        return await redis.set(key, value);
      }
      return await fallbackStorage.set(key, value, options);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.set(key, value, options);
    }
  },

  async hgetall(key: string) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.hgetall(key);
      }
      return await fallbackStorage.hgetall(key);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.hgetall(key);
    }
  },

  async hincrby(key: string, field: string, increment: number) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.hincrby(key, field, increment);
      }
      return await fallbackStorage.hincrby(key, field, increment);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.hincrby(key, field, increment);
    }
  },

  async hincrbyfloat(key: string, field: string, increment: number) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.hincrbyfloat(key, field, increment);
      }
      return await fallbackStorage.hincrbyfloat(key, field, increment);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.hincrbyfloat(key, field, increment);
    }
  },

  async lpush(key: string, value: string) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.lpush(key, value);
      }
      return await fallbackStorage.lpush(key, value);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.lpush(key, value);
    }
  },

  async lrange(key: string, start: number, stop: number) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.lrange(key, start, stop);
      }
      return await fallbackStorage.lrange(key, start, stop);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.lrange(key, start, stop);
    }
  },

  async ltrim(key: string, start: number, stop: number) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.ltrim(key, start, stop);
      }
      return await fallbackStorage.ltrim(key, start, stop);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.ltrim(key, start, stop);
    }
  },

  async del(key: string) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.del(key);
      }
      return await fallbackStorage.del(key);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.del(key);
    }
  },

  async expire(key: string, seconds: number) {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return await redis.expire(key, seconds);
      }
      return await fallbackStorage.expire(key, seconds);
    } catch (error) {
      console.warn('Redis operation failed, using fallback:', error);
      return await fallbackStorage.expire(key, seconds);
    }
  },

  pipeline() {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL) {
        return redis.pipeline();
      }
      return fallbackStorage.pipeline();
    } catch (error) {
      console.warn('Redis pipeline failed, using fallback:', error);
      return fallbackStorage.pipeline();
    }
  },
};

// Export the enhanced Redis instance as default
export default enhancedRedis;